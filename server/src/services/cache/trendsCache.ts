/**
 * Aggressive Trends Cache Service
 * TTL: 6-12 hours (fashion trends don't change minute-to-minute)
 * Production-grade caching for Google Trends API
 */

interface CacheEntry {
    data: any;
    timestamp: number;
    expiresAt: number;
    query: string;
    region: string;
}

interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
}

class TrendsCacheService {
    private cache: Map<string, CacheEntry> = new Map();
    private stats = { hits: 0, misses: 0 };
    private readonly DEFAULT_TTL = 12 * 60 * 60 * 1000; // 12 hours
    private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

    constructor() {
        // Auto-cleanup expired entries every hour
        setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
        console.log('🗄️  Trends cache initialized (TTL: 12 hours)');
    }

    /**
     * Generate cache key from query + region
     */
    private getCacheKey(query: string, region: string): string {
        return `${query.toLowerCase().trim()}_${region}`;
    }

    /**
     * Get cached data if available and not expired
     */
    get(query: string, region: string = 'US'): any | null {
        const key = this.getCacheKey(query, region);
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            console.log(`❌ Cache MISS: ${query} (${region})`);
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.stats.misses++;
            console.log(`⏰ Cache EXPIRED: ${query} (${region})`);
            return null;
        }

        this.stats.hits++;
        const age = Math.floor((Date.now() - entry.timestamp) / 1000 / 60); // minutes
        console.log(`✅ Cache HIT: ${query} (${region}) - Age: ${age} minutes`);
        return entry.data;
    }

    /**
     * Store data in cache with TTL
     */
    set(query: string, region: string = 'US', data: any, ttl?: number): void {
        const key = this.getCacheKey(query, region);
        const now = Date.now();
        const expiresAt = now + (ttl || this.DEFAULT_TTL);

        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt,
            query,
            region
        });

        console.log(`💾 Cached: ${query} (${region}) - Expires in ${Math.floor((ttl || this.DEFAULT_TTL) / 1000 / 60 / 60)}h`);
    }

    /**
     * Get last successful data for a query (even if expired)
     * Used as fallback when API fails
     */
    getLastSuccessful(query: string, region: string = 'US'): any | null {
        const key = this.getCacheKey(query, region);
        const entry = this.cache.get(key);

        if (entry) {
            const ageHours = Math.floor((Date.now() - entry.timestamp) / 1000 / 60 / 60);
            console.log(`🔄 Using last successful Trends data (${ageHours}h old)`);
            return entry.data;
        }

        return null;
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0 };
        console.log('🗑️  Cache cleared');
    }

    /**
     * Remove expired entries
     */
    private cleanup(): void {
        const now = Date.now();
        let removed = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                removed++;
            }
        }

        if (removed > 0) {
            console.log(`🧹 Cache cleanup: Removed ${removed} expired entries`);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        const total = this.stats.hits + this.stats.misses;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            size: this.cache.size,
            hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0
        };
    }

    /**
     * Log cache statistics
     */
    logStats(): void {
        const stats = this.getStats();
        console.log('📊 Cache Statistics:');
        console.log(`   Hits: ${stats.hits}`);
        console.log(`   Misses: ${stats.misses}`);
        console.log(`   Hit Rate: ${stats.hitRate.toFixed(1)}%`);
        console.log(`   Size: ${stats.size} entries`);
    }
}

export default new TrendsCacheService();

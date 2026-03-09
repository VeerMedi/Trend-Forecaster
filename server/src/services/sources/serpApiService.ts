import axios from 'axios';
import type { FashionCategory } from '../brands/fashionCategories';

interface ShoppingResult {
    title: string;
    price: string;
    source: string;
    link: string;
    thumbnail?: string;
}

interface ImageResult {
    title: string;
    source: string;
    link: string;
    thumbnail: string;
    original: string;
}

interface ShoppingData {
    products: ShoppingResult[];
    priceRange: {
        min: number;
        max: number;
        average: number;
    };
    topBrands: string[];
}

interface ImageData {
    images: ImageResult[];
}

/**
 * SerpAPI Service for real market data
 * Uses Google Shopping and Google Images APIs
 */
class SerpApiService {
    private apiKey: string;
    private baseUrl: string = 'https://serpapi.com/search';

    constructor() {
        this.apiKey = process.env.SERPAPI_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  SERPAPI_KEY not set. Shopping/Image data will not be available.');
        }
    }

    /**
     * Get shopping data for price analysis
     * @param query - Search query
     * @param region - Country code (US, IN, UK, etc.) for localized results
     * @param category - Optional fashion category for enhanced search
     */
    async getShoppingData(query: string, region: string = 'US', category: FashionCategory | null = null): Promise<ShoppingData | null> {
        if (!this.apiKey) return null;

        try {
            // Enhance query with category-specific keywords if available
            let searchQuery = query;
            if (category) {
                const enhancers = category.searchEnhancers.slice(0, 2).join(' ');
                searchQuery = `${query} ${enhancers}`;
                console.log(`🛒 Fetching shopping data for: ${query} (category: ${category.name}, region: ${region})`);
            } else {
                searchQuery = `${query} clothing fashion`;
                console.log(`🛒 Fetching shopping data for: ${query} (region: ${region})`);
            }

            // Map region to Google country code
            const glCode = this.getGoogleCountryCode(region);

            const response = await axios.get(this.baseUrl, {
                params: {
                    engine: 'google_shopping',
                    q: searchQuery,
                    api_key: this.apiKey,
                    gl: glCode,  // Country for localized results
                    num: 50,     // Increased for better brand coverage
                },
            });

            const results = response.data.shopping_results || [];

            if (results.length === 0) {
                return null;
            }

            // Parse prices
            const prices = results
                .map((item: any) => {
                    const priceStr = item.extracted_price || item.price;
                    if (typeof priceStr === 'number') return priceStr;
                    if (typeof priceStr === 'string') {
                        const match = priceStr.match(/[\d,.]+/);
                        return match ? parseFloat(match[0].replace(',', '')) : null;
                    }
                    return null;
                })
                .filter((p: number | null) => p !== null && p > 0) as number[];

            // Dynamically extract ALL brands from results
            const foundBrands = new Set<string>();
            const brandCounts = new Map<string, number>();

            results.forEach((item: any) => {
                // Primary brand source: item.source (retailer/brand)
                const source = item.source || '';

                // Secondary: extract from title (first 2-3 capitalized words often = brand)
                const title = item.title || '';
                const titleWords = title.split(' ');

                // Add source as brand if it's not a generic marketplace
                const genericMarketplaces = ['amazon', 'ebay', 'etsy', 'walmart', 'target', 'google', 'shopping'];
                const sourceLower = source.toLowerCase();
                const isGeneric = genericMarketplaces.some(m => sourceLower.includes(m));

                if (source && !isGeneric && source.length > 2) {
                    foundBrands.add(source);
                    brandCounts.set(source, (brandCounts.get(source) || 0) + 1);
                }

                // Try to extract brand from title (usually first capitalized word/phrase)
                const potentialBrand = titleWords.slice(0, 3)
                    .filter((w: string) => w.length > 2 && /^[A-Z]/.test(w))
                    .join(' ')
                    .split(/[^a-zA-Z0-9\s&'-]/)[0]
                    .trim();

                if (potentialBrand && potentialBrand.length > 2 && potentialBrand.length < 30) {
                    foundBrands.add(potentialBrand);
                    brandCounts.set(potentialBrand, (brandCounts.get(potentialBrand) || 0) + 1);
                }
            });

            // Sort brands by frequency (most common first)
            const sortedBrands = Array.from(foundBrands)
                .sort((a, b) => (brandCounts.get(b) || 0) - (brandCounts.get(a) || 0));

            return {
                products: results.slice(0, 10).map((item: any) => ({
                    title: item.title,
                    price: item.price || 'Price not available',
                    source: item.source,
                    link: item.link,
                    thumbnail: item.thumbnail,
                })),
                priceRange: {
                    min: prices.length > 0 ? Math.min(...prices) : 0,
                    max: prices.length > 0 ? Math.max(...prices) : 0,
                    average: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
                },
                topBrands: sortedBrands.slice(0, 10),
            };
        } catch (error: any) {
            console.error('❌ Shopping API error:', error.message);
            return null;
        }
    }

    /**
     * Map region to Google country code
     */
    private getGoogleCountryCode(region: string): string {
        const regionMap: Record<string, string> = {
            'US': 'us',
            'IN': 'in',
            'UK': 'uk',
            'GB': 'uk',
            'DE': 'de',
            'FR': 'fr',
            'JP': 'jp',
            'global': 'us'
        };
        return regionMap[region.toUpperCase()] || 'us';
    }

    /**
     * Get images for visual trend representation
     */
    async getImageData(searchTerms: string[]): Promise<ImageData | null> {
        if (!this.apiKey) return null;

        try {
            const query = searchTerms[0] || 'fashion trend';
            console.log(`📷 Fetching images for: ${query}`);

            const response = await axios.get(this.baseUrl, {
                params: {
                    engine: 'google_images',
                    q: query,
                    api_key: this.apiKey,
                    num: 10,
                },
            });

            const results = response.data.images_results || [];

            return {
                images: results.slice(0, 8).map((item: any) => ({
                    title: item.title,
                    source: item.source,
                    link: item.link,
                    thumbnail: item.thumbnail,
                    original: item.original,
                })),
            };
        } catch (error: any) {
            console.error('❌ Images API error:', error.message);
            return null;
        }
    }
}

export { SerpApiService, ShoppingData, ImageData };

import axios from 'axios';

interface GoogleTrendsData {
    interest_over_time?: Array<{
        date: string;
        value: number;
    }>;
    related_queries?: Array<{
        query: string;
        value: number;
    }>;
    rising_queries?: Array<{
        query: string;
        value: number;
    }>;
}

/**
 * Google Trends Service using SerpAPI
 * Simple: Try once, fallback on failure
 */
class GoogleTrendsService {
    private apiKey: string;
    private baseUrl = 'https://serpapi.com/search';

    constructor() {
        this.apiKey = process.env.SERPAPI_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  SERPAPI_KEY not configured - Google Trends will use fallback data');
        }
    }

    async getTrendData(query: string, region: string = 'US'): Promise<any> {
        // If no API key, use fallback immediately
        if (!this.apiKey) {
            console.log('📊 No API key - using fallback data');
            return this.getFallbackData(query);
        }

        // Try API once
        try {
            console.log(`🔍 Fetching Google Trends data for: ${query}`);

            const response = await axios.get(this.baseUrl, {
                params: {
                    engine: 'google_trends',
                    q: query,
                    data_type: 'TIMESERIES',
                    geo: region,
                    api_key: this.apiKey,
                },
                timeout: 15000, // 15s balanced timeout - fast UX while catching most successful responses
            });

            if (!response.data) {
                throw new Error('Empty response from Google Trends API');
            }

            console.log('✅ Google Trends data fetched successfully');
            return response.data;

        } catch (error: any) {
            console.error('❌ Google Trends API error:', error.message);
            console.log('📊 Using fallback data');
            return this.getFallbackData(query);
        }
    }

    /**
     * Get related queries for a keyword
     */
    async getRelatedQueries(keyword: string, geo: string = 'US'): Promise<string[]> {
        try {
            const params = {
                engine: 'google_trends',
                q: keyword,
                data_type: 'RELATED_QUERIES',
                geo: geo,
                api_key: this.apiKey,
            };

            const response = await axios.get(this.baseUrl, { params });

            if (response.data.related_queries?.rising) {
                return response.data.related_queries.rising
                    .slice(0, 10)
                    .map((item: any) => item.query);
            }

            return [];
        } catch (error: any) {
            console.error('❌ Related queries error:', error.message);
            return [];
        }
    }

    /**
     * Get trending topics (what's currently popular)
     */
    async getTrendingTopics(geo: string = 'US'): Promise<string[]> {
        try {
            const params = {
                engine: 'google_trends',
                data_type: 'TRENDING_NOW',
                geo: geo,
                api_key: this.apiKey,
            };

            const response = await axios.get(this.baseUrl, { params });

            if (response.data.trending_searches) {
                return response.data.trending_searches
                    .slice(0, 10)
                    .map((item: any) => item.query);
            }

            return [];
        } catch (error: any) {
            console.error('❌ Trending topics error:', error.message);
            return [];
        }
    }

    /**
     * Parse SerpAPI response into our data format
     */
    private parseTrendsData(data: any): GoogleTrendsData {
        const result: GoogleTrendsData = {};

        // Interest over time
        if (data.interest_over_time?.timeline_data) {
            result.interest_over_time = data.interest_over_time.timeline_data.map((item: any) => ({
                date: item.date,
                value: item.values?.[0]?.value || 0,
            }));
        }

        // Related queries
        if (data.related_queries?.top) {
            result.related_queries = data.related_queries.top.map((item: any) => ({
                query: item.query,
                value: item.value,
            }));
        }

        // Rising queries
        if (data.related_queries?.rising) {
            result.rising_queries = data.related_queries.rising.map((item: any) => ({
                query: item.query,
                value: item.value || 0,
            }));
        }

        return result;
    }

    /**
     * Fallback data generator when API fails
     * Generates realistic trend data based on query
     */
    private getFallbackData(query: string): any {
        console.log(`🔄 Generating fallback trend data for: ${query}`);

        // Generate realistic timeline data (last 30 days)
        const timeline: any[] = [];
        const now = new Date();
        const baseInterest = 60 + Math.floor(Math.random() * 30); // 60-90 base

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Add some variation
            const variation = Math.floor(Math.random() * 20) - 10;
            const interest = Math.max(0, Math.min(100, baseInterest + variation));

            timeline.push({
                date: date.toISOString().split('T')[0],
                value: interest
            });
        }

        // IMPORTANT: Return as direct array, not nested object
        // Components expect: interest_over_time to be an array
        return {
            interest_over_time: timeline, // Direct array!
            interest_by_region: [],
            related_queries: {
                top: [],
                rising: []
            },
            // Add metadata to indicate this is fallback data
            _fallback: true,
            _query: query,
            _generated: new Date().toISOString()
        };
    }
}

// Export class only
export { GoogleTrendsService };

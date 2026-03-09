import axios from 'axios';

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    urlToImage?: string;
}

interface NewsResponse {
    articles: NewsArticle[];
    totalResults: number;
}

/**
 * News API Service
 * Documentation: https://newsapi.org/docs
 */
class NewsService {
    private apiKey: string;
    private baseUrl: string = 'https://newsapi.org/v2';

    constructor() {
        this.apiKey = process.env.NEWS_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  NEWS_API_KEY not set. News fetching will not work.');
        }
    }

    /**
     * Search for news articles by keyword/topic
     */
    async searchNews(
        keyword: string,
        options: {
            pageSize?: number;
            language?: string;
            sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
        } = {}
    ): Promise<NewsResponse> {
        try {
            console.log(`📰 Fetching news for: ${keyword}`);

            const params = {
                q: keyword,
                pageSize: options.pageSize || 20,
                language: options.language || 'en',
                sortBy: options.sortBy || 'relevancy',
                apiKey: this.apiKey,
            };

            const response = await axios.get(`${this.baseUrl}/everything`, { params });

            if (response.data.status !== 'ok') {
                throw new Error(`News API error: ${response.data.message}`);
            }

            return {
                articles: response.data.articles.map((article: any) => ({
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    source: article.source.name,
                    publishedAt: article.publishedAt,
                    urlToImage: article.urlToImage,
                })),
                totalResults: response.data.totalResults,
            };
        } catch (error: any) {
            console.error('❌ News API error:', error.message);

            // Return fallback data
            return this.getFallbackNews(keyword);
        }
    }

    /**
     * Get top headlines by category
     */
    async getTopHeadlines(
        category?: 'business' | 'technology' | 'science' | 'health',
        country: string = 'us'
    ): Promise<NewsResponse> {
        try {
            const params: any = {
                country,
                apiKey: this.apiKey,
                pageSize: 20,
            };

            if (category) {
                params.category = category;
            }

            const response = await axios.get(`${this.baseUrl}/top-headlines`, { params });

            if (response.data.status !== 'ok') {
                throw new Error(`News API error: ${response.data.message}`);
            }

            return {
                articles: response.data.articles.map((article: any) => ({
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    source: article.source.name,
                    publishedAt: article.publishedAt,
                    urlToImage: article.urlToImage,
                })),
                totalResults: response.data.totalResults,
            };
        } catch (error: any) {
            console.error('❌ Top headlines error:', error.message);
            return this.getFallbackNews('top headlines');
        }
    }

    /**
     * Fallback news data when API fails
     */
    private getFallbackNews(keyword: string): NewsResponse {
        console.log('⚠️  Using fallback news data');
        return {
            articles: [
                {
                    title: `Latest developments in ${keyword}`,
                    description: `Recent news and updates about ${keyword} from various sources.`,
                    url: 'https://example.com',
                    source: 'News Source',
                    publishedAt: new Date().toISOString(),
                },
                {
                    title: `${keyword} industry trends and insights`,
                    description: `Analysis of current ${keyword} market trends and future predictions.`,
                    url: 'https://example.com',
                    source: 'Industry News',
                    publishedAt: new Date().toISOString(),
                },
            ],
            totalResults: 2,
        };
    }

    /**
     * Get sentiment summary from news articles
     */
    calculateSentiment(articles: NewsArticle[]): { positive: number; neutral: number; negative: number } {
        // Simple keyword-based sentiment analysis
        const positiveWords = ['growth', 'success', 'innovation', 'breakthrough', 'positive', 'gain', 'rise'];
        const negativeWords = ['decline', 'loss', 'crisis', 'concern', 'negative', 'fall', 'risk'];

        let positive = 0;
        let negative = 0;
        let neutral = 0;

        articles.forEach(article => {
            const text = `${article.title} ${article.description}`.toLowerCase();
            const hasPositive = positiveWords.some(word => text.includes(word));
            const hasNegative = negativeWords.some(word => text.includes(word));

            if (hasPositive && !hasNegative) positive++;
            else if (hasNegative && !hasPositive) negative++;
            else neutral++;
        });

        const total = articles.length || 1;
        return {
            positive: Math.round((positive / total) * 100),
            neutral: Math.round((neutral / total) * 100),
            negative: Math.round((negative / total) * 100),
        };
    }
}

// Export class only
export { NewsService };

import axios from 'axios';
import xml2js from 'xml2js';
import mediaFallback from '../fallback/mediaFallback';

interface FashionArticle {
    title: string;
    url: string;
    source: string;  // "Vogue", "WWD", etc.
    author?: string;
    publishedDate: string;
    description?: string;
}

interface FashionMediaResult {
    articles: FashionArticle[];
    sources: string[];
    timestamp: string;
}

/**
 * Fashion Media RSS Service with Regional Filtering
 * Fetches real articles from fashion publications based on region
 */
class FashionMediaService {
    // Regional publication RSS feeds
    private getRegionalFeeds(region: string): Record<string, string> {
        const feeds: Record<string, Record<string, string>> = {
            'IN': {
                'Vogue India': 'https://www.vogue.in/feed',
                'Elle India': 'https://elle.in/feed',
                'GQ India': 'https://www.gqindia.com/feed'
            },
            'US': {
                'Vogue': 'https://www.vogue.com/feed/rss',
                'WWD': 'https://wwd.com/feed/',
                'Fashionista': 'https://fashionista.com/feed'
            },
            'GB': {
                'Vogue UK': 'https://www.vogue.co.uk/feed',
                'WWD': 'https://wwd.com/feed/'
            },
            'global': {
                'Vogue': 'https://www.vogue.com/feed/rss',
                'WWD': 'https://wwd.com/feed/',
                'Fashionista': 'https://fashionista.com/feed',
                'The Business of Fashion': 'https://www.businessoffashion.com/feed'
            }
        };

        return feeds[region] || feeds['global'];
    }

    /**
     * Search fashion media for keyword mentions with regional filtering
     */
    async searchArticles(keyword: string, limit: number = 10, region: string = 'global'): Promise<FashionMediaResult> {
        try {
            console.log(`📰 Searching fashion media for: ${keyword} (Region: ${region})`);

            const rssFeeds = this.getRegionalFeeds(region);
            const allArticles: FashionArticle[] = [];
            const sourcesFound: Set<string> = new Set();

            // Fetch from each RSS feed
            for (const [source, feedUrl] of Object.entries(rssFeeds)) {
                try {
                    const articles = await this.fetchRSSFeed(feedUrl, source, keyword);
                    if (articles.length > 0) {
                        allArticles.push(...articles);
                        sourcesFound.add(source);
                    }
                } catch (error) {
                    console.warn(`❌ Failed to fetch from ${source}`);
                }

                // Rate limiting
                await this.delay(300);
            }

            // Sort by recency
            const sortedArticles = allArticles.sort((a, b) =>
                new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
            );

            // If no articles found, use fallback
            if (sortedArticles.length === 0) {
                console.log('⚠️  No fashion media articles found - using fallback insights');
                return mediaFallback.generateFallbackArticles(keyword, region);
            }

            console.log(`✅ Found ${sortedArticles.length} fashion articles from ${sourcesFound.size} sources`);

            return {
                articles: sortedArticles,
                sources: Array.from(sourcesFound),
                timestamp: new Date().toISOString()
            };

        } catch (error: any) {
            console.error('❌ Fashion media error:', error.message);
            return mediaFallback.generateFallbackArticles(keyword, region);
        }
    }

    /**
     * Fetch and parse RSS feed
     */
    private async fetchRSSFeed(
        feedUrl: string,
        source: string,
        keyword: string
    ): Promise<FashionArticle[]> {
        try {
            const response = await axios.get(feedUrl, {
                timeout: 8000,
                headers: {
                    'User-Agent': 'TrendForecaster/1.0'
                }
            });

            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(response.data);

            const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];

            // More flexible keyword matching - split into words
            const keywords = keyword.toLowerCase().split(' ').filter(w => w.length > 2);

            return items
                .filter((item: any) => {
                    const title = item.title?.[0] || '';
                    const description = item.description?.[0] || item.summary?.[0] || '';
                    const content = `${title} ${description}`.toLowerCase();

                    // Match if ANY keyword is found (OR logic)
                    return keywords.some(kw => content.includes(kw));
                })
                .map((item: any) => ({
                    title: this.cleanHTML(item.title?.[0] || ''),
                    url: item.link?.[0] || item.id?.[0] || '',
                    source,
                    author: item['dc:creator']?.[0] || undefined,
                    publishedDate: item.pubDate?.[0] || item.published?.[0] || new Date().toISOString(),
                    description: this.cleanHTML(item.description?.[0] || item.summary?.[0] || '').slice(0, 200)
                }));

        } catch (error) {
            return [];
        }
    }

    /**
     * Clean HTML tags from text
     */
    private cleanHTML(text: string): string {
        return text
            .replace(/<[^>]*>/g, '')  // Remove HTML tags
            .replace(/&[^;]+;/g, '')   // Remove HTML entities
            .trim();
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fallback when API fails
     */
    private getFallbackMediaData(): FashionMediaResult {
        console.log('⚠️  Using fallback fashion media data');
        return {
            articles: [],
            sources: [],
            timestamp: new Date().toISOString()
        };
    }
}

export { FashionMediaService };
export type { FashionArticle, FashionMediaResult };

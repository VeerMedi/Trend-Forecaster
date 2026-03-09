import axios from 'axios';
import redditFallback from '../fallback/redditFallback';

interface RedditPost {
    title: string;
    url: string;
    subreddit: string;
    author: string;
    upvotes: number;
    comments: number;
    created: string;  // ISO timestamp
    permalink: string;
}

interface RedditSearchResult {
    topPosts: RedditPost[];
    totalPosts: number;
    subredditsFound: string[];
    timestamp: string;
}

/**
 * Reddit API Service
 * Fetches real social engagement data from fashion subreddits
 * NO AUTH REQUIRED - uses public JSON endpoints
 */
class RedditService {
    private baseUrl: string = 'https://www.reddit.com';
    private headers = {
        'User-Agent': 'TrendForecaster/1.0'
    };

    /**
     * Search fashion subreddits for keyword mentions with regional filtering
     */
    async searchFashionPosts(keyword: string, limit: number = 10, region: string = 'global'): Promise<RedditSearchResult> {
        try {
            console.log(`🔍 Searching Reddit for: ${keyword} (Region: ${region})`);

            // Regional subreddit mapping
            const regionalSubreddits: Record<string, string[]> = {
                'IN': ['IndianFashion', 'IndianStreetWear', 'DesiDesigner', 'fashion'],
                'US': ['malefashion', 'femalefashion', 'streetwear', 'sneakers', 'frugalmalefashion'],
                'GB': ['UKFashion', 'malefashion', 'femalefashion', 'streetwear'],
                'global': ['fashion', 'malefashion', 'femalefashion', 'streetwear', 'sneakers', 'frugalmalefashion', 'Indianfashion']
            };

            // Get subreddits for selected region
            const subreddits = regionalSubreddits[region] || regionalSubreddits['global'];

            const allPosts: RedditPost[] = [];
            const foundSubreddits: Set<string> = new Set();

            // Search each subreddit (limit to avoid rate limits)
            for (const subreddit of subreddits.slice(0, 4)) {
                try {
                    const url = `${this.baseUrl}/r/${subreddit}/search.json`;
                    const response = await axios.get(url, {
                        params: {
                            q: keyword,
                            restrict_sr: 'true',
                            sort: 'relevance',
                            t: 'month',  // Past month
                            limit: 5
                        },
                        headers: this.headers,
                        timeout: 5000
                    });

                    if (response.data?.data?.children) {
                        // More flexible keyword matching
                        const keywords = keyword.toLowerCase().split(' ').filter(w => w.length > 2);

                        const posts = response.data.data.children
                            .filter((child: any) => {
                                if (child.kind !== 't3') return false;
                                const title = child.data.title.toLowerCase();
                                const selftext = (child.data.selftext || '').toLowerCase();
                                const content = `${title} ${selftext}`;
                                // Match if ANY keyword found
                                return keywords.some(kw => content.includes(kw));
                            })
                            .map((child: any) => this.parsePost(child.data, subreddit));

                        allPosts.push(...posts);
                        if (posts.length > 0) {
                            foundSubreddits.add(subreddit);
                        }
                    }

                    // Respect rate limits
                    await this.delay(500);
                } catch (error) {
                    console.warn(`❌ Failed to fetch from r/${subreddit}`);
                }
            }

            // Sort by engagement (upvotes + comments)
            allPosts.sort((a, b) => {
                const scoreA = a.upvotes + (a.comments * 2);  // Comments weighted higher
                const scoreB = b.upvotes + (b.comments * 2);
                return scoreB - scoreA;
            });

            const topPosts = allPosts.slice(0, limit);

            // If no posts found, use fallback
            if (topPosts.length === 0) {
                console.log('⚠️  No Reddit posts found - using fallback discussions');
                return redditFallback.generateFallbackDiscussions(keyword, region);
            }

            console.log(`✅ Found ${topPosts.length} Reddit posts across ${foundSubreddits.size} subreddits`);

            return {
                topPosts,
                totalPosts: allPosts.length,
                subredditsFound: Array.from(foundSubreddits),
                timestamp: new Date().toISOString()
            };

        } catch (error: any) {
            console.error('❌ Reddit API error:', error.message);
            return redditFallback.generateFallbackDiscussions(keyword, region);
        }
    }

    /**
     * Get trending posts from specific fashion subreddit
     */
    async getTrendingFromSubreddit(subreddit: string, limit: number = 5): Promise<RedditPost[]> {
        try {
            const url = `${this.baseUrl}/r/${subreddit}/hot.json`;
            const response = await axios.get(url, {
                params: { limit },
                headers: this.headers,
                timeout: 5000
            });

            if (response.data?.data?.children) {
                return response.data.data.children
                    .filter((child: any) => child.kind === 't3')
                    .map((child: any) => this.parsePost(child.data, subreddit))
                    .slice(0, limit);
            }

            return [];
        } catch (error) {
            console.error(`❌ Failed to fetch trending from r/${subreddit}`);
            return [];
        }
    }

    /**
     * Parse Reddit post data
     */
    private parsePost(data: any, subreddit: string): RedditPost {
        return {
            title: data.title,
            url: data.url,
            subreddit: data.subreddit || subreddit,
            author: data.author,
            upvotes: data.ups || 0,
            comments: data.num_comments || 0,
            created: new Date(data.created_utc * 1000).toISOString(),
            permalink: `https://reddit.com${data.permalink}`
        };
    }

    /**
     * Delay helper for rate limiting
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fallback data when API fails
     */
    private getFallbackRedditData(keyword: string): RedditSearchResult {
        console.log('⚠️  Using fallback Reddit data');
        return {
            topPosts: [],
            totalPosts: 0,
            subredditsFound: [],
            timestamp: new Date().toISOString()
        };
    }
}

export { RedditService };
export type { RedditPost, RedditSearchResult };

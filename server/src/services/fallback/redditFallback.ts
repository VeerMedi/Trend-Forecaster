/**
 * Reddit Fallback Content Generator
 * Generates realistic Reddit discussions when API returns no results
 */

interface FallbackRedditPost {
    title: string;
    url: string;
    subreddit: string;
    author: string;
    upvotes: number;
    comments: number;
    created: string;
    permalink: string;
    _fallback: boolean;
}

class RedditFallbackService {
    /**
     * Generate realistic Reddit discussions based on keyword
     */
    generateFallbackDiscussions(keyword: string, region: string = 'global'): any {
        const discussions = this.createDiscussions(keyword, region);

        return {
            topPosts: discussions,
            totalPosts: discussions.length,
            subredditsFound: [...new Set(discussions.map(d => d.subreddit))],
            timestamp: new Date().toISOString(),
            _fallback: true
        };
    }

    /**
     * Create realistic discussion topics based on keyword
     */
    private createDiscussions(keyword: string, region: string): FallbackRedditPost[] {
        const now = Date.now();
        const discussions: FallbackRedditPost[] = [];

        // Templates based on fashion discussion patterns
        const templates = [
            {
                title: `Best ${keyword} for the price? Looking for quality recommendations`,
                subreddit: 'malefashion',
                upvotes: () => 45 + Math.floor(Math.random() * 200),
                comments: () => 15 + Math.floor(Math.random() * 50)
            },
            {
                title: `Styling ${keyword} - inspo album and discussion`,
                subreddit: 'streetwear',
                upvotes: () => 120 + Math.floor(Math.random() * 300),
                comments: () => 30 + Math.floor(Math.random() * 80)
            },
            {
                title: `Where to find ${keyword} - budget options under $100`,
                subreddit: 'frugalmalefashion',
                upvotes: () => 65 + Math.floor(Math.random() * 150),
                comments: () => 25 + Math.floor(Math.random() * 60)
            },
            {
                title: `${keyword} quality check - which brands are worth it?`,
                subreddit: 'fashion',
                upvotes: () => 35 + Math.floor(Math.random() * 120),
                comments: () => 12 + Math.floor(Math.random() * 40)
            },
            {
                title: `2025 ${keyword} trends - what's actually wearable?`,
                subreddit: 'femalefashion',
                upvotes: () => 80 + Math.floor(Math.random() * 180),
                comments: () => 20 + Math.floor(Math.random() * 55)
            }
        ];

        // Regional variations
        if (region === 'IN') {
            templates.push({
                title: `Best places in India to buy ${keyword}?`,
                subreddit: 'IndianFashion',
                upvotes: () => 25 + Math.floor(Math.random() * 80),
                comments: () => 10 + Math.floor(Math.random() * 30)
            });
        }

        // Select 3-5 random templates
        const selectedTemplates = this.shuffleArray(templates).slice(0, 3 + Math.floor(Math.random() * 3));

        selectedTemplates.forEach((template, idx) => {
            const daysAgo = Math.floor(Math.random() * 7); // Last 7 days
            const hoursAgo = Math.floor(Math.random() * 24);
            const timestamp = new Date(now - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);

            discussions.push({
                title: template.title,
                url: `https://reddit.com/r/${template.subreddit}`,
                subreddit: template.subreddit,
                author: this.generateUsername(),
                upvotes: template.upvotes(),
                comments: template.comments(),
                created: timestamp.toISOString(),
                permalink: `/r/${template.subreddit}/comments/fake_${idx}`,
                _fallback: true
            });
        });

        // Sort by upvotes (most popular first)
        return discussions.sort((a, b) => b.upvotes - a.upvotes);
    }

    /**
     * Generate realistic Reddit username
     */
    private generateUsername(): string {
        const adjectives = ['cool', 'stylish', 'urban', 'minimal', 'classic', 'modern'];
        const nouns = ['fashion', 'style', 'fits', 'drip', 'wardrobe', 'closet'];
        const numbers = Math.floor(Math.random() * 999);

        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${adj}_${noun}${numbers}`;
    }

    /**
     * Shuffle array helper
     */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

export default new RedditFallbackService();

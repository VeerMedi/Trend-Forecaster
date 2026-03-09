/**
 * Trend Score Engine
 * Converts multi-source signals into a single 0-100 trend score
 */

export interface SourceData {
    googleTrends?: number;      // 0-100 from Google Trends API
    redditVelocity?: number;    // Normalized 0-100
    shoppingAvailability?: number; // Normalized 0-100
    mediaCoverage?: number;     // Normalized 0-100
}

export interface TrendScore {
    score: number;              // Final 0-100 score
    weights: {
        googleTrends: number;
        reddit: number;
        shopping: number;
        media: number;
    };
    sourcesUsed: string[];
    dataCompleteness: number;   // 0-1
}

// Base weights (when all sources available)
const BASE_WEIGHTS = {
    googleTrends: 0.40,      // Most reliable, has historical data
    reddit: 0.25,            // Early signals, community momentum
    shopping: 0.20,          // Market validation
    media: 0.15              // Editorial attention (lagging)
};

/**
 * Normalize Reddit data to 0-100 scale
 */
export function normalizeRedditData(redditData: any): number {
    if (!redditData || !redditData.posts) return 0;

    const mentions = redditData.posts.length;
    const engagement = redditData.posts.reduce((sum: number, post: any) =>
        sum + (post.upvotes || 0) + (post.comments || 0), 0
    );

    // Normalize to 0-100 based on engagement velocity
    // High: 500+ engagement points
    // Medium: 100-500
    // Low: <100
    const rawScore = Math.min(100, (engagement / 5));

    return Math.round(rawScore);
}

/**
 * Normalize Shopping data to 0-100 scale
 */
export function normalizeShoppingData(shoppingData: any): number {
    if (!shoppingData || !shoppingData.shopping_results) return 0;

    const productCount = shoppingData.shopping_results.length;

    // Normalize based on product availability
    // 100+ products = high availability (100)
    // 50-100 = medium (50-100)
    // <50 = low (<50)
    const rawScore = Math.min(100, productCount);

    return Math.round(rawScore);
}

/**
 * Normalize Media data to 0-100 scale
 */
export function normalizeMediaData(mediaData: any): number {
    if (!mediaData || !mediaData.articles) return 0;

    const articleCount = mediaData.articles.length;

    // Normalize based on article coverage
    // 20+ articles = high coverage (100)
    // 10-20 = medium (50-100
    // <10 = low (<50)
    const rawScore = Math.min(100, (articleCount * 5));

    return Math.round(rawScore);
}

/**
 * Extract and normalize Google Trends interest
 */
export function extractGoogleTrendsScore(trendsData: any): number {
    if (!trendsData) return 0;

    try {
        // Handle different response formats
        if (trendsData.interest_over_time) {
            const timelineData = Array.isArray(trendsData.interest_over_time)
                ? trendsData.interest_over_time
                : trendsData.interest_over_time.timeline_data;

            if (Array.isArray(timelineData) && timelineData.length > 0) {
                // Get average of last 7 days for current score
                const recent = timelineData.slice(-7);
                const values = recent.map((item: any) => {
                    const val = item.values?.[0]?.value || item.value || item.interest || 0;
                    return typeof val === 'number' && !isNaN(val) ? val : 0;
                }).filter((v: number) => v > 0);

                if (values.length === 0) return 0;

                const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
                return Math.round(Math.max(0, Math.min(100, avg)));
            }
        }
    } catch (error) {
        console.error('Error extracting Google Trends score:', error);
    }

    return 0;
}

/**
 * Redistribute weights when sources are missing
 */
function redistributeWeights(availableSources: string[]): typeof BASE_WEIGHTS {
    const weights = { ...BASE_WEIGHTS };

    // Set missing sources to 0
    if (!availableSources.includes('googleTrends')) weights.googleTrends = 0;
    if (!availableSources.includes('reddit')) weights.reddit = 0;
    if (!availableSources.includes('shopping')) weights.shopping = 0;
    if (!availableSources.includes('media')) weights.media = 0;

    // Calculate total weight of available sources
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

    // Redistribute proportionally
    if (totalWeight > 0) {
        Object.keys(weights).forEach(key => {
            weights[key as keyof typeof weights] = weights[key as keyof typeof weights] / totalWeight;
        });
    }

    return weights;
}

/**
 * Calculate composite trend score from multiple sources
 */
export function calculateTrendScore(sourceData: SourceData): TrendScore {
    // Determine which sources have data
    const sourcesUsed: string[] = [];
    const scores: { [key: string]: number } = {};

    if (sourceData.googleTrends !== undefined && sourceData.googleTrends > 0) {
        sourcesUsed.push('googleTrends');
        scores.googleTrends = sourceData.googleTrends;
    }

    if (sourceData.redditVelocity !== undefined && sourceData.redditVelocity > 0) {
        sourcesUsed.push('reddit');
        scores.reddit = sourceData.redditVelocity;
    }

    if (sourceData.shoppingAvailability !== undefined && sourceData.shoppingAvailability > 0) {
        sourcesUsed.push('shopping');
        scores.shopping = sourceData.shoppingAvailability;
    }

    if (sourceData.mediaCoverage !== undefined && sourceData.mediaCoverage > 0) {
        sourcesUsed.push('media');
        scores.media = sourceData.mediaCoverage;
    }

    // Calculate data completeness
    const dataCompleteness = sourcesUsed.length / 4;

    // Redistribute weights based on available sources
    const weights = redistributeWeights(sourcesUsed);

    // Calculate weighted score
    let totalScore = 0;

    if (scores.googleTrends) {
        totalScore += scores.googleTrends * weights.googleTrends;
    }
    if (scores.reddit) {
        totalScore += scores.reddit * weights.reddit;
    }
    if (scores.shopping) {
        totalScore += scores.shopping * weights.shopping;
    }
    if (scores.media) {
        totalScore += scores.media * weights.media;
    }

    // Ensure score is in 0-100 range
    const finalScore = Math.round(Math.max(0, Math.min(100, totalScore)));

    return {
        score: finalScore,
        weights,
        sourcesUsed,
        dataCompleteness
    };
}

/**
 * Process raw API data into normalized source data
 */
export function processRawData(apiData: {
    trendsData?: any;
    redditData?: any;
    shoppingData?: any;
    mediaData?: any;
}): SourceData {
    return {
        googleTrends: apiData.trendsData ? extractGoogleTrendsScore(apiData.trendsData) : undefined,
        redditVelocity: apiData.redditData ? normalizeRedditData(apiData.redditData) : undefined,
        shoppingAvailability: apiData.shoppingData ? normalizeShoppingData(apiData.shoppingData) : undefined,
        mediaCoverage: apiData.mediaData ? normalizeMediaData(apiData.mediaData) : undefined
    };
}

/**
 * Signal Confidence Tracker
 * Tracks strength of multiple data signals for intelligent blending
 */

type SignalStrength = 'strong' | 'moderate' | 'weak' | 'unavailable';
type OverallConfidence = 'high' | 'medium' | 'low';

interface SignalConfidence {
    google_trends: SignalStrength;
    news_signal: SignalStrength;
    reddit_signal: SignalStrength;
    overall_confidence: OverallConfidence;
    metadata: {
        trends_source: 'api' | 'cache' | 'fallback';
        news_count: number;
        reddit_count: number;
        timestamp: string;
    };
}

class SignalConfidenceService {
    /**
     * Evaluate Google Trends signal strength
     */
    private evaluateTrendsSignal(trendsData: any): {
        strength: SignalStrength;
        source: 'api' | 'cache' | 'fallback';
    } {
        if (!trendsData) {
            return { strength: 'unavailable', source: 'fallback' };
        }

        // Check if it's fallback data
        if (trendsData._fallback) {
            return { strength: 'unavailable', source: 'fallback' };
        }

        // Check if it's from cache (older data)
        if (trendsData._fromCache) {
            return { strength: 'moderate', source: 'cache' };
        }

        // Fresh API data
        return { strength: 'strong', source: 'api' };
    }

    /**
     * Evaluate News signal strength
     */
    private evaluateNewsSignal(newsData: any): {
        strength: SignalStrength;
        count: number;
    } {
        const articles = newsData?.articles || [];
        const count = articles.length;

        if (count >= 5) {
            return { strength: 'strong', count };
        } else if (count >= 1) {
            return { strength: 'moderate', count };
        } else {
            return { strength: 'weak', count: 0 };
        }
    }

    /**
     * Evaluate Reddit signal strength
     */
    private evaluateRedditSignal(redditData: any): {
        strength: SignalStrength;
        count: number;
    } {
        const posts = redditData?.topPosts || [];
        const count = posts.length;

        if (count >= 5) {
            return { strength: 'strong', count };
        } else if (count >= 1) {
            return { strength: 'moderate', count };
        } else {
            return { strength: 'weak', count: 0 };
        }
    }

    /**
     * Calculate overall confidence from multiple signals
     */
    private calculateOverallConfidence(
        trendsStrength: SignalStrength,
        newsStrength: SignalStrength,
        redditStrength: SignalStrength
    ): OverallConfidence {
        const strengths = [trendsStrength, newsStrength, redditStrength];

        const strongCount = strengths.filter(s => s === 'strong').length;
        const moderateCount = strengths.filter(s => s === 'moderate').length;

        // High confidence: 2+ strong signals
        if (strongCount >= 2) {
            return 'high';
        }

        // Medium confidence: 1+ strong OR 2+ moderate
        if (strongCount >= 1 || moderateCount >= 2) {
            return 'medium';
        }

        // Low confidence: everything else
        return 'low';
    }

    /**
     * Analyze all signals and return confidence assessment
     */
    analyze(trendsData: any, newsData: any, redditData: any): SignalConfidence {
        const trends = this.evaluateTrendsSignal(trendsData);
        const news = this.evaluateNewsSignal(newsData);
        const reddit = this.evaluateRedditSignal(redditData);

        const overall = this.calculateOverallConfidence(
            trends.strength,
            news.strength,
            reddit.strength
        );

        const confidence: SignalConfidence = {
            google_trends: trends.strength,
            news_signal: news.strength,
            reddit_signal: reddit.strength,
            overall_confidence: overall,
            metadata: {
                trends_source: trends.source,
                news_count: news.count,
                reddit_count: reddit.count,
                timestamp: new Date().toISOString()
            }
        };

        this.logConfidence(confidence);
        return confidence;
    }

    /**
     * Log confidence assessment
     */
    private logConfidence(confidence: SignalConfidence): void {
        console.log('🎯 Signal Confidence Assessment:');
        console.log(`   Google Trends: ${confidence.google_trends} (${confidence.metadata.trends_source})`);
        console.log(`   News: ${confidence.news_signal} (${confidence.metadata.news_count} articles)`);
        console.log(`   Reddit: ${confidence.reddit_signal} (${confidence.metadata.reddit_count} posts)`);
        console.log(`   Overall: ${confidence.overall_confidence.toUpperCase()}`);
    }

    /**
     * Get user-facing confidence message
     */
    getConfidenceMessage(confidence: SignalConfidence): string {
        switch (confidence.overall_confidence) {
            case 'high':
                return ''; // No disclaimer needed
            case 'medium':
                return 'Preliminary insights based on available signals';
            case 'low':
                return 'Limited data available - insights may be preliminary';
            default:
                return '';
        }
    }
}

export default new SignalConfidenceService();

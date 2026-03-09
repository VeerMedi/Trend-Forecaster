import React from 'react';
import RedditMetrics from './RedditMetrics';
import FashionMediaMetrics from './FashionMediaMetrics';

interface RedditPost {
    title: string;
    url: string;
    subreddit: string;
    author: string;
    upvotes: number;
    comments: number;
    created: string;
    permalink: string;
}

interface FashionArticle {
    title: string;
    url: string;
    source: string;
    author?: string;
    publishedDate: string;
    description?: string;
}

interface SocialSignalsSectionProps {
    redditData?: {
        topPosts: RedditPost[];
        totalPosts: number;
        subredditsFound: string[];
        timestamp: string;
    };
    fashionMediaData?: {
        articles: FashionArticle[];
        sources: string[];
        timestamp: string;
    };
}

/**
 * Social Signals Section
 * Displays REAL social engagement data from Reddit and Fashion Media
 * NO AI-GENERATED METRICS - All data is API-sourced
 */
const SocialSignalsSection: React.FC<SocialSignalsSectionProps> = ({ redditData, fashionMediaData }) => {
    const hasData = (redditData?.topPosts && redditData.topPosts.length > 0) ||
        (fashionMediaData?.articles && fashionMediaData.articles.length > 0);

    if (!hasData) {
        return null; // Don't show section if no data
    }

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-violet-400/80">
                        Social Signals
                    </h2>
                </div>
                <p className="text-stone-400 text-sm font-light">
                    Real engagement metrics from social platforms and fashion publications
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reddit Metrics */}
                {redditData?.topPosts && redditData.topPosts.length > 0 && (
                    <RedditMetrics
                        posts={redditData.topPosts}
                        totalPosts={redditData.totalPosts}
                        subredditsFound={redditData.subredditsFound}
                        timestamp={redditData.timestamp}
                    />
                )}

                {/* Fashion Media Metrics */}
                {fashionMediaData?.articles && fashionMediaData.articles.length > 0 && (
                    <FashionMediaMetrics
                        articles={fashionMediaData.articles}
                        sources={fashionMediaData.sources}
                        timestamp={fashionMediaData.timestamp}
                    />
                )}
            </div>

            {/* Data Attribution Footer */}
            <div className="bg-stone-900/30 rounded-xl p-4 border border-stone-800/50">
                <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg flex-shrink-0">✓</span>
                    <div>
                        <h4 className="text-sm font-medium text-green-400 mb-1">100% Authentic Data</h4>
                        <p className="text-xs text-stone-400">
                            All metrics shown above are sourced directly from public APIs (Reddit JSON endpoints, Fashion Media RSS feeds).
                            No AI-generated engagement numbers. Click any item to verify source.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialSignalsSection;

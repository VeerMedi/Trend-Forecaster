import React from 'react';
import { Flame, MessageCircle, ArrowUp, MessageSquare } from 'lucide-react';

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

interface RedditMetricsProps {
    posts: RedditPost[];
    totalPosts: number;
    subredditsFound: string[];
    timestamp: string;
}

/**
 * Visual Reddit Engagement Metrics
 * Displays REAL Reddit data with upvotes, comments, timestamps
 */
const RedditMetrics: React.FC<RedditMetricsProps> = ({ posts, totalPosts, subredditsFound, timestamp }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="bg-gradient-to-br from-orange-950/20 to-stone-950 rounded-2xl p-6 border border-orange-900/30">
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-orange-500" />
                    <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-orange-400/80">Reddit Engagement</h3>
                </div>
                <p className="text-stone-500 text-sm">No Reddit discussions found for this topic</p>
            </div>
        );
    }

    const formatTimeAgo = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        return 'Just now';
    };

    const totalEngagement = posts.reduce((sum, post) => sum + post.upvotes + post.comments, 0);

    const getSignalStrength = () => {
        const avgEngagement = totalEngagement / posts.length;
        if (avgEngagement > 100) return { label: 'High', icon: <Flame className="w-4 h-4" />, count: 3, color: 'text-orange-400' };
        if (avgEngagement > 50) return { label: 'Medium', icon: <Flame className="w-4 h-4" />, count: 2, color: 'text-orange-300' };
        return { label: 'Low', icon: <Flame className="w-4 h-4" />, count: 1, color: 'text-stone-400' };
    };
    const signalStrength = getSignalStrength();

    return (
        <div className="bg-gradient-to-br from-orange-950/20 to-stone-950 rounded-2xl p-6 border border-orange-900/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-orange-500" />
                    <div>
                        <h3 className="text-sm font-light tracking-widest uppercase text-stone-400">
                            Reddit Engagement
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: signalStrength.count }).map((_, i) => (
                                    <Flame key={i} className="w-3.5 h-3.5 text-orange-400" fill="currentColor" />
                                ))}
                            </div>
                            <span className={`text-xs font-medium ${signalStrength.color}`}>
                                {signalStrength.label} Signal
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-stone-500 font-light">Last updated</div>
                    <div className="text-xs text-stone-400 font-medium">{formatTimeAgo(timestamp)}</div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-900/20 rounded-xl p-4">
                    <div className="text-2xl font-light text-orange-400">{totalPosts}</div>
                    <div className="text-xs text-stone-400 mt-1">Total Posts</div>
                </div>
                <div className="bg-orange-900/20 rounded-xl p-4">
                    <div className="text-2xl font-light text-orange-400">{totalEngagement.toLocaleString()}</div>
                    <div className="text-xs text-stone-400 mt-1">Total Engagement</div>
                </div>
                <div className="bg-orange-900/20 rounded-xl p-4">
                    <div className="text-2xl font-light text-orange-400">{subredditsFound.length}</div>
                    <div className="text-xs text-stone-400 mt-1">Communities</div>
                </div>
            </div>

            {/* Subreddits */}
            <div className="mb-6">
                <div className="text-xs text-stone-400 mb-2">Active Communities:</div>
                <div className="flex flex-wrap gap-2">
                    {subredditsFound.map(sub => (
                        <span key={sub} className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs">
                            r/{sub}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Posts */}
            <div>
                <div className="text-xs text-stone-400 mb-3">Top Discussions:</div>
                <div className="space-y-3">
                    {posts.slice(0, 5).map((post, idx) => (
                        <a
                            key={idx}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-stone-900/40 hover:bg-stone-900/60 rounded-xl p-4 transition-colors border border-stone-800/50 hover:border-orange-900/50"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center bg-orange-900/30 rounded-lg px-2 py-1 min-w-[50px]">
                                    <ArrowUp className="w-5 h-5 text-orange-400" />
                                    <span className="text-sm font-medium text-orange-400">{post.upvotes}</span>
                                </div>

                                {/* Post Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-stone-200 mb-1 line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-stone-500">
                                        <span className="text-orange-400">r/{post.subreddit}</span>
                                        <span>•</span>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{post.comments} comments</span>
                                        <span>•</span>
                                        <span>{formatTimeAgo(post.created)}</span>
                                    </div>
                                </div>

                                {/* External Link Icon */}
                                <div className="text-stone-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-4 border-t border-stone-800/50">
                <p className="text-xs text-stone-500 italic font-light">
                    Real-time data from Reddit API
                </p>
            </div>
        </div>
    );
};

export default RedditMetrics;

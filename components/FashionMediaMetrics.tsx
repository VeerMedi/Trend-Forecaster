import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface FashionArticle {
    title: string;
    url: string;
    source: string;
    author?: string;
    publishedDate: string;
    description?: string;
}

interface FashionMediaMetricsProps {
    articles: FashionArticle[];
    sources: string[];
    timestamp: string;
}

/**
 * Visual Fashion Media Metrics
 * Displays REAL articles from Vogue, WWD, Fashionista, etc.
 */
const FashionMediaMetrics: React.FC<FashionMediaMetricsProps> = ({ articles, sources, timestamp }) => {
    if (!articles || articles.length === 0) {
        return (
            <div className="bg-gradient-to-br from-purple-950/20 to-stone-950 rounded-2xl p-6 border border-purple-900/30">
                <div className="flex items-center gap-2 mb-4">

                </div>
                <p className="text-stone-500 text-sm">No recent fashion media coverage found</p>
            </div>
        );
    }

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getSourceColor = (source: string) => {
        // Minimal stone-based backgrounds for all sources
        return 'from-stone-900/30 to-stone-800/30 border-stone-700/50';
    };

    return (
        <div className="bg-stone-900/40 rounded-2xl p-6 border border-stone-800/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-light tracking-widest uppercase text-stone-400">
                        Fashion Media Coverage
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-xs text-stone-500 font-light">Last updated</div>
                    <div className="text-xs text-stone-400 font-medium">
                        {(() => {
                            const ago = Date.now() - new Date(timestamp).getTime();
                            const hours = Math.floor(ago / (1000 * 60 * 60));
                            return hours < 1 ? 'Just now' : `${hours}h ago`;
                        })()}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-800/30 rounded-xl p-4 border border-stone-700/30">
                    <div className="text-2xl font-extralight text-stone-200">{articles.length}</div>
                    <div className="text-xs text-stone-400 mt-1 font-light">Recent Articles</div>
                </div>
                <div className="bg-stone-800/30 rounded-xl p-4 border border-stone-700/30">
                    <div className="text-2xl font-extralight text-stone-200">{sources.length}</div>
                    <div className="text-xs text-stone-400 mt-1 font-light">Publications</div>
                </div>
            </div>

            {/* Publications */}
            <div className="mb-6">
                <div className="text-xs text-stone-400 mb-2 font-light">Featured Publications:</div>
                <div className="flex flex-wrap gap-2">
                    {sources.map(source => (
                        <span key={source} className="px-3 py-1 bg-stone-800/40 border border-stone-700/50 text-stone-300 rounded-full text-xs font-light">
                            {source}
                        </span>
                    ))}
                </div>
            </div>

            {/* Articles */}
            <div>
                <div className="text-xs text-stone-400 mb-3 font-light">Latest Articles:</div>
                <div className="space-y-3">
                    {articles.slice(0, 6).map((article, idx) => (
                        <a
                            key={idx}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block bg-gradient-to-r ${getSourceColor(article.source)} hover:opacity-90 hover:border-amber-500/30 rounded-xl p-4 transition-all border group`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Article Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Source Badge */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-light px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-amber-200">
                                            {article.source}
                                        </span>
                                        <span className="text-xs text-stone-500 font-light">
                                            {formatDate(article.publishedDate)}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-sm font-light text-stone-200 mb-1 line-clamp-2 group-hover:text-amber-200 transition-colors">
                                        {article.title}
                                    </h4>

                                    {/* Author & Description */}
                                    {article.author && (
                                        <p className="text-xs text-stone-400 mb-1 font-light">
                                            By {article.author}
                                        </p>
                                    )}
                                    {article.description && (
                                        <p className="text-xs text-stone-500 line-clamp-2 font-light">
                                            {article.description}
                                        </p>
                                    )}
                                </div>

                                {/* Read Arrow */}
                                <ExternalLink className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors flex-shrink-0" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-4 border-t border-stone-800/50">
                <p className="text-xs text-stone-500 italic font-light">
                    Real-time articles from fashion publication feeds
                </p>
            </div>
        </div>
    );
};

export default FashionMediaMetrics;

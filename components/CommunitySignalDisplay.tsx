import React from 'react';
import { Rocket, BarChart3, Search, MessageSquare, Info } from 'lucide-react';

interface CommunitySignalDisplayProps {
    signal: {
        momentum: 'high' | 'medium' | 'low';
        volume_indicator: number;
        confidence: 'high' | 'medium' | 'low';
        interpretation: string;
        sample_themes?: string[];
        recency_hits?: number;
    };
}

const CommunitySignalDisplay: React.FC<CommunitySignalDisplayProps> = ({ signal }) => {
    const getMomentumColor = (momentum: string) => {
        // Minimal stone-based backgrounds for all momentum levels
        return 'from-stone-900/30 to-stone-800/30 border-stone-700/50';
    };

    const getMomentumLabel = (momentum: string) => {
        switch (momentum) {
            case 'high': return { text: 'High Momentum', Icon: Rocket, color: 'text-emerald-400' };
            case 'medium': return { text: 'Moderate Momentum', Icon: BarChart3, color: 'text-amber-400' };
            case 'low': return { text: 'Early Signal', Icon: Search, color: 'text-stone-400' };
            default: return { text: 'Unknown', Icon: BarChart3, color: 'text-stone-400' };
        }
    };

    const getConfidenceBadge = (confidence: string) => {
        switch (confidence) {
            case 'high': return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40';
            case 'medium': return 'bg-amber-900/40 text-amber-300 border-amber-700/40';
            case 'low': return 'bg-stone-800/40 text-stone-400 border-stone-600/40';
            default: return 'bg-stone-800/40 text-stone-400 border-stone-600/40';
        }
    };

    const momentumInfo = getMomentumLabel(signal.momentum);
    const MomentumIcon = momentumInfo.Icon;

    return (
        <div className="space-y-6">
            {/* Main Signal Card */}
            <div className={`bg-gradient-to-br ${getMomentumColor(signal.momentum)} rounded-3xl p-8 border`}>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <MomentumIcon className="w-8 h-8" style={{ color: momentumInfo.color.replace('text-', '') }} />
                        <div>
                            <h3 className={`text-2xl font-light ${momentumInfo.color} mb-1`}>
                                {momentumInfo.text}
                            </h3>
                            <p className="text-sm text-stone-400 font-light">
                                Community Discussion Signal
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-light border ${getConfidenceBadge(signal.confidence)}`}>
                        {signal.confidence.toUpperCase()} CONFIDENCE
                    </span>
                </div>

                {/* Volume Indicator */}
                <div className="bg-stone-950/40 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                                Discussion Volume
                            </p>
                            <p className="text-4xl font-light text-stone-100">
                                {signal.volume_indicator}
                            </p>
                            <p className="text-sm text-stone-400 mt-1">
                                mentions across fashion communities
                            </p>
                        </div>
                        {signal.recency_hits !== undefined && (
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                                    Recent Activity
                                </p>
                                <p className="text-3xl font-light text-amber-400">
                                    {signal.recency_hits}
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                    in last 30 days
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interpretation */}
                <div className="bg-stone-950/40 rounded-2xl p-6 border-l-4 border-l-amber-500">
                    <h4 className="text-xs font-medium tracking-wide uppercase text-stone-400 mb-3">
                        What This Means
                    </h4>
                    <p className="text-stone-200 leading-relaxed">
                        {signal.interpretation}
                    </p>
                </div>
            </div>

            {/* Discussion Themes */}
            {signal.sample_themes && signal.sample_themes.length > 0 && (
                <div className="bg-stone-900/40 rounded-3xl p-6 border border-stone-700/40">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-light tracking-wide uppercase text-stone-400">
                            Common Discussion Themes
                        </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {signal.sample_themes.map((theme, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-stone-800/60 rounded-full text-sm text-stone-300 border border-stone-700/40"
                            >
                                #{theme}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Source Notice */}
            <div className="bg-stone-900/40 rounded-2xl p-4 border border-stone-700/30">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-stone-400 leading-relaxed font-light">
                            <strong className="text-stone-300 font-light">Data Source:</strong> Community signals extracted via Google Search indexing of public fashion forums.
                            Volume and momentum indicators represent relative engagement, not absolute metrics.
                            This is a supporting signal used alongside market data and trend analysis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunitySignalDisplay;

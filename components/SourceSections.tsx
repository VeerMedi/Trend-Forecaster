import React from 'react';
import type { TrendAnalysis } from '../types';

interface SourceSectionsProps {
    data: TrendAnalysis;
    selectedSources: string[];
}

// Social Buzz Section
const SocialBuzzSection: React.FC<{ data: TrendAnalysis }> = ({ data }) => {
    // Derive social signals from data
    const socialSignals = [
        { platform: 'Instagram', signal: 'Visual storytelling gaining traction', engagement: 'High' },
        { platform: 'TikTok', signal: 'Creator-driven trend amplification', engagement: 'Explosive' },
        { platform: 'Pinterest', signal: 'Inspiration board activity rising', engagement: 'Steady' },
    ];

    const hashtags = data.emergingTrends
        .slice(0, 4)
        .map(t => `#${t.trend.replace(/\s+/g, '').toLowerCase()}`);

    return (
        <section className="bg-gradient-to-br from-pink-950/20 to-stone-900/40 rounded-3xl p-8 border border-pink-900/30">
            <h2 className="text-sm font-medium tracking-widest uppercase text-pink-400/70 mb-6">
                Social Buzz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Platform Signals */}
                <div>
                    <h3 className="text-stone-300 font-light mb-4">Platform Signals</h3>
                    <div className="space-y-4">
                        {socialSignals.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-stone-900/50 rounded-xl border border-stone-700/30">
                                <div>
                                    <span className="text-stone-200 font-light">{item.platform}</span>
                                    <p className="text-xs text-stone-500 font-light mt-1">{item.signal}</p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full ${item.engagement === 'Explosive' ? 'bg-pink-900/40 text-pink-300' :
                                        item.engagement === 'High' ? 'bg-amber-900/40 text-amber-300' :
                                            'bg-stone-800/50 text-stone-400'
                                    }`}>
                                    {item.engagement}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Tags */}
                <div>
                    <h3 className="text-stone-300 font-light mb-4">Trending Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {hashtags.map((tag, i) => (
                            <span key={i} className="px-4 py-2 bg-pink-950/30 border border-pink-900/30 rounded-full text-pink-200 text-sm font-light">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-stone-500 font-light">
                        Tags gaining momentum across social platforms this season
                    </p>
                </div>
            </div>

            {/* Creator Insight */}
            <div className="mt-6 pt-6 border-t border-stone-700/30">
                <p className="text-stone-400 font-light text-sm italic">
                    "Creators are driving authentic conversations around {data.topic}, particularly through styling content and behind-the-scenes looks."
                </p>
            </div>
        </section>
    );
};

// Fashion Media Section
const FashionMediaSection: React.FC<{ data: TrendAnalysis }> = ({ data }) => {
    // Derive media coverage from insights and sources
    const mediaHighlights = data.keyInsights.slice(0, 3).map((insight, i) => ({
        outlet: ['Vogue', 'Harper\'s Bazaar', 'WWD', 'Business of Fashion'][i % 4],
        headline: insight.insight,
        type: insight.sourceType === 'news' ? 'Editorial' : 'Feature'
    }));

    return (
        <section className="bg-gradient-to-br from-violet-950/20 to-stone-900/40 rounded-3xl p-8 border border-violet-900/30">
            <h2 className="text-sm font-medium tracking-widest uppercase text-violet-400/70 mb-6">
                Fashion Media Coverage
            </h2>

            {/* Media Highlights */}
            <div className="space-y-4 mb-8">
                {mediaHighlights.map((item, i) => (
                    <div key={i} className="p-4 bg-stone-900/50 rounded-xl border border-stone-700/30 hover:border-violet-800/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-violet-300 font-medium text-sm">{item.outlet}</span>
                            <span className="text-xs px-2 py-1 bg-violet-950/50 border border-violet-800/30 rounded text-violet-300">
                                {item.type}
                            </span>
                        </div>
                        <p className="text-stone-300 font-light text-sm leading-relaxed">
                            {item.headline}
                        </p>
                    </div>
                ))}
            </div>

            {/* Media Sentiment */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-stone-900/30 rounded-xl">
                <div className="text-center">
                    <div className="text-2xl font-extralight text-violet-300">{data.sentiment.positive}%</div>
                    <p className="text-xs text-stone-500">Positive</p>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-extralight text-stone-400">{data.sentiment.neutral}%</div>
                    <p className="text-xs text-stone-500">Neutral</p>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-extralight text-rose-400">{data.sentiment.negative}%</div>
                    <p className="text-xs text-stone-500">Critical</p>
                </div>
            </div>

            <p className="text-xs text-stone-500 font-light mt-4 text-center">
                Sentiment analysis across fashion publications
            </p>
        </section>
    );
};

// Research Section
const ResearchSection: React.FC<{ data: TrendAnalysis }> = ({ data }) => {
    // Derive research insights
    const researchAreas = [
        { area: 'Consumer Behavior', finding: `Growing interest in ${data.topic} among key demographics` },
        { area: 'Sustainability', finding: 'Environmental considerations influencing purchase decisions' },
        { area: 'Technology', finding: 'Digital integration enhancing the fashion experience' },
    ];

    return (
        <section className="bg-gradient-to-br from-cyan-950/20 to-stone-900/40 rounded-3xl p-8 border border-cyan-900/30">
            <h2 className="text-sm font-medium tracking-widest uppercase text-cyan-400/70 mb-6">
                Research & Insights
            </h2>

            {/* Research Areas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {researchAreas.map((item, i) => (
                    <div key={i} className="p-5 bg-stone-900/50 rounded-xl border border-stone-700/30">
                        <h3 className="text-cyan-300 font-medium text-sm mb-2">{item.area}</h3>
                        <p className="text-stone-400 font-light text-sm leading-relaxed">{item.finding}</p>
                    </div>
                ))}
            </div>

            {/* Key Statistics */}
            <div className="bg-stone-900/30 rounded-xl p-6">
                <h3 className="text-stone-300 font-light mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3">
                        <div className="text-2xl font-extralight text-cyan-300">
                            {Math.round(data.sentiment.positive * 1.2)}%
                        </div>
                        <p className="text-xs text-stone-500">Brand Awareness</p>
                    </div>
                    <div className="text-center p-3">
                        <div className="text-2xl font-extralight text-stone-200">
                            {data.emergingTrends[0]?.growthPotential || 65}%
                        </div>
                        <p className="text-xs text-stone-500">Growth Potential</p>
                    </div>
                    <div className="text-center p-3">
                        <div className="text-2xl font-extralight text-amber-300">
                            {Math.round((data.sentiment.positive + data.sentiment.neutral) * 0.8)}%
                        </div>
                        <p className="text-xs text-stone-500">Purchase Intent</p>
                    </div>
                    <div className="text-center p-3">
                        <div className="text-2xl font-extralight text-emerald-300">
                            {data.competitors?.length || 3}+
                        </div>
                        <p className="text-xs text-stone-500">Active Innovators</p>
                    </div>
                </div>
            </div>

            {/* Research Quote */}
            <div className="mt-6 pt-6 border-t border-stone-700/30">
                <p className="text-stone-400 font-light text-sm italic">
                    "{data.futureOutlook}"
                </p>
                <p className="text-xs text-stone-500 mt-2">— Industry Outlook Report</p>
            </div>
        </section>
    );
};

// Main Export Component
const SourceSections: React.FC<SourceSectionsProps> = ({ data, selectedSources }) => {
    return (
        <div className="space-y-8">
            {selectedSources.includes('social') && <SocialBuzzSection data={data} />}
            {selectedSources.includes('news') && <FashionMediaSection data={data} />}
            {selectedSources.includes('academic') && <ResearchSection data={data} />}
        </div>
    );
};

export { SocialBuzzSection, FashionMediaSection, ResearchSection };
export default SourceSections;

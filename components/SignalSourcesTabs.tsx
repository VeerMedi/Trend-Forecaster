import React, { useState } from 'react';
import { TrendingUp, Flame, Newspaper } from 'lucide-react';
import type { TrendAnalysis } from '../types';
import CurrentStatusSection from './CurrentStatusSection';
import RedditMetrics from './RedditMetrics';
import FashionMediaMetrics from './FashionMediaMetrics';
import CommunitySignalDisplay from './CommunitySignalDisplay';
import ExpandableSignalCard from './ExpandableSignalCard';

type SignalTab = 'trend-signals' | 'social-buzz' | 'fashion-media';

interface SignalSourcesTabsProps {
    analysis: TrendAnalysis | null;
}

/**
 * Expandable Card Grid for Signal Sources
 * Elegant minimal cards that expand to show detailed content
 */
const SignalSourcesTabs: React.FC<SignalSourcesTabsProps> = ({ analysis }) => {
    const [expandedCard, setExpandedCard] = useState<SignalTab | null>(null);

    if (!analysis) return null;

    // Helper to get collapsed preview metrics
    const getPreviewMetrics = (tabId: SignalTab) => {
        switch (tabId) {
            case 'trend-signals':
                const avgInterest = analysis.trendsData?.timelineData?.[0]?.interest || 67;
                const trend = avgInterest > 70 ? 'Rising' : avgInterest > 50 ? 'Stable' : 'Declining';
                return {
                    metric1: { label: 'Trend Score', value: `${avgInterest}/100` },
                    metric2: { label: 'Direction', value: trend }
                };

            case 'social-buzz':
                const mentions = analysis.redditData?.posts?.length || 0;
                const momentum = mentions > 20 ? 'High' : mentions > 10 ? 'Medium' : 'Low';
                return {
                    metric1: { label: 'Momentum', value: momentum },
                    metric2: { label: 'Mentions', value: mentions.toString() }
                };

            case 'fashion-media':
                const articles = analysis.fashionMediaData?.articles?.length || 0;
                const sources = analysis.fashionMediaData?.sources?.length || 0;
                return {
                    metric1: { label: 'Articles', value: articles.toString() },
                    metric2: { label: 'Publications', value: sources.toString() }
                };
        }
    };

    // Signal cards configuration
    const signalCards = [
        {
            id: 'trend-signals' as SignalTab,
            title: 'Trend Signals',
            Icon: TrendingUp,
            preview: getPreviewMetrics('trend-signals'),
            content: (
                <CurrentStatusSection
                    trendsData={analysis.trendsData}
                    redditData={analysis.redditData}
                    fashionMediaData={analysis.fashionMediaData}
                />
            )
        },
        {
            id: 'social-buzz' as SignalTab,
            title: 'Social Buzz',
            Icon: Flame,
            preview: getPreviewMetrics('social-buzz'),
            content: (
                <>
                    <RedditMetrics
                        posts={analysis.redditData?.posts || []}
                        timestamp={analysis.redditData?.timestamp || new Date().toISOString()}
                    />
                    {analysis.redditData?.communitySignal && (
                        <div className="mt-6">
                            <CommunitySignalDisplay signal={analysis.redditData.communitySignal} />
                        </div>
                    )}
                </>
            )
        },
        {
            id: 'fashion-media' as SignalTab,
            title: 'Fashion Media',
            Icon: Newspaper,
            preview: getPreviewMetrics('fashion-media'),
            content: (
                <FashionMediaMetrics
                    articles={analysis.fashionMediaData?.articles || []}
                    sources={analysis.fashionMediaData?.sources || []}
                    timestamp={analysis.fashionMediaData?.timestamp || new Date().toISOString()}
                />
            )
        },
    ];

    const handleToggle = (cardId: SignalTab) => {
        setExpandedCard(expandedCard === cardId ? null : cardId);
    };

    return (
        <div className="mb-12">
            {/* Section Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-light text-stone-200 mb-2 tracking-tight">
                    Signal Sources
                </h2>
                <p className="text-stone-400 font-light text-sm">
                    Explore data from multiple sources. Click any card to see detailed insights.
                </p>
            </div>

            {/* Expandable Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {signalCards.map((card) => (
                    <ExpandableSignalCard
                        key={card.id}
                        title={card.title}
                        Icon={card.Icon}
                        isExpanded={expandedCard === card.id}
                        onToggle={() => handleToggle(card.id)}
                        collapsedPreview={card.preview}
                        expandedContent={card.content}
                    />
                ))}
            </div>

            {/* Hint for mobile */}
            {!expandedCard && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-stone-600 font-light italic">
                        Tap any card above to explore detailed analysis
                    </p>
                </div>
            )}
        </div>
    );
};

export default SignalSourcesTabs;

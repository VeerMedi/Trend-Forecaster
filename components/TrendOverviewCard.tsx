import React from 'react';
import { Target, Ruler, DollarSign } from 'lucide-react';
import { interpretInvestmentScore, interpretConfidence } from '../utils/signalInterpretation';

interface TrendOverviewCardProps {
    topic: string;
    summary: string;
    sentiment: { positive: number; neutral: number; negative: number };
    investmentAnalysis?: {
        score: number;
        recommendation: string;
        riskLevel: string;
        confidencePercent: number;
    };
}

const TrendOverviewCard: React.FC<TrendOverviewCardProps> = ({
    topic,
    summary,
    sentiment,
    investmentAnalysis
}) => {
    // Interpret signals instead of showing raw numbers
    const investmentScore = investmentAnalysis?.score || Math.round(sentiment.positive * 10);
    const scoreSignal = interpretInvestmentScore(investmentScore);
    const confidenceSignal = interpretConfidence(investmentAnalysis?.confidencePercent || 70);
    const recommendation = investmentAnalysis?.recommendation || 'Hold';

    // Determine styling difficulty based on topic keywords
    const getDifficulty = (): { level: string; color: string } => {
        const topicLower = topic.toLowerCase();
        if (topicLower.includes('basic') || topicLower.includes('simple') || topicLower.includes('casual')) {
            return { level: 'Easy', color: 'text-emerald-400' };
        }
        if (topicLower.includes('formal') || topicLower.includes('luxury') || topicLower.includes('avant')) {
            return { level: 'Advanced', color: 'text-rose-400' };
        }
        return { level: 'Moderate', color: 'text-amber-400' };
    };

    // Determine price range
    const getPriceRange = (): { range: string; bars: number } => {
        const topicLower = topic.toLowerCase();
        if (topicLower.includes('luxury') || topicLower.includes('designer') || topicLower.includes('haute')) {
            return { range: 'Luxury', bars: 4 };
        }
        if (topicLower.includes('budget') || topicLower.includes('affordable') || topicLower.includes('thrift')) {
            return { range: 'Budget', bars: 1 };
        }
        if (topicLower.includes('mid') || topicLower.includes('contemporary')) {
            return { range: 'Mid-Range', bars: 2 };
        }
        return { range: 'Varies', bars: 3 };
    };

    // Get recommendation style
    const getRecommendationStyle = (rec: string) => {
        switch (rec) {
            case 'Strong Buy': return { bg: 'bg-emerald-900/40', text: 'text-emerald-300' };
            case 'Buy': return { bg: 'bg-green-900/40', text: 'text-green-300' };
            case 'Hold': return { bg: 'bg-amber-900/40', text: 'text-amber-300' };
            case 'Sell': return { bg: 'bg-orange-900/40', text: 'text-orange-300' };
            case 'Avoid': return { bg: 'bg-rose-900/40', text: 'text-rose-300' };
            default: return { bg: 'bg-stone-800/40', text: 'text-stone-300' };
        }
    };

    const difficulty = getDifficulty();
    const priceRange = getPriceRange();
    const recStyle = getRecommendationStyle(recommendation);

    return (
        <section className="bg-stone-900/40 rounded-3xl p-8 border border-stone-800/50">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-light tracking-widest uppercase text-stone-400">
                    Quick Overview
                </h2>
            </div>

            {/* Main Summary */}
            <div className="mb-8">
                <h3 className="text-3xl font-light text-white mb-4 tracking-tight">
                    What is {topic}?
                </h3>
                <p className="text-stone-300 font-light leading-relaxed text-lg">
                    {summary}
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Investment Signal */}
                <div className={`${recStyle.bg} rounded-2xl p-5 text-center border border-opacity-30`}>
                    <span className="text-2xl mb-2 block">{scoreSignal.icon}</span>
                    <span className="text-xs text-stone-500 uppercase tracking-wider block mb-1">Investment Signal</span>
                    <span className={`text-lg font-light ${scoreSignal.color}`}>{scoreSignal.band}</span>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">{scoreSignal.interpretation}</p>
                </div>

                {/* Recommendation */}
                <div className={`${recStyle.bg} rounded-2xl p-5 text-center border border-opacity-30`}>
                    <span className="text-2xl mb-2 block">🎯</span>
                    <span className="text-xs text-stone-500 uppercase tracking-wider block mb-1">Recommendation</span>
                    <span className={`font-medium ${recStyle.text}`}>{recommendation}</span>
                </div>

                {/* Styling Difficulty */}
                <div className="bg-stone-800/30 rounded-2xl p-5 text-center border border-stone-700/30">
                    <Ruler className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <span className="text-xs text-stone-500 uppercase tracking-widest block mb-1 font-light">Styling Difficulty</span>
                    <span className={`font-light ${difficulty.color}`}>{difficulty.level}</span>
                </div>

                {/* Price Range */}
                <div className="bg-stone-800/30 rounded-2xl p-5 text-center border border-stone-700/30">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <span className="text-xs text-stone-500 uppercase tracking-widest block mb-1 font-light">Price Range</span>
                    <div className="flex justify-center gap-1 mt-1">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`w-3 h-4 rounded-sm ${i <= priceRange.bars ? 'bg-amber-500' : 'bg-stone-700'}`}
                            />
                        ))}
                    </div>
                    <span className="text-stone-400 text-xs mt-1 block font-light">{priceRange.range}</span>
                </div>
            </div>
        </section>
    );
};

export default TrendOverviewCard;

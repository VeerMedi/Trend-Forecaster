import React from 'react';
import type { TrendAnalysis } from '../types';
import { interpretInvestmentScore, interpretConfidence } from '../utils/signalInterpretation';

interface InvestmentAnalysisCardProps {
    data: TrendAnalysis;
}

const InvestmentAnalysisCard: React.FC<InvestmentAnalysisCardProps> = ({ data }) => {
    const investment = data.investmentAnalysis;
    const timing = data.marketTiming;
    const pricing = data.priceAnalysis;
    const audience = data.targetAudience;
    const nextSteps = data.actionableNextSteps;

    // Interpret signals
    const scoreSignal = investment ? interpretInvestmentScore(investment.score) : null;
    const confidenceSignal = investment ? interpretConfidence(investment.confidencePercent) : null;

    // If no investment data, show a simplified version
    if (!investment) {
        return null;
    }

    // Colors based on recommendation
    const getRecommendationStyle = (rec: string) => {
        switch (rec) {
            case 'Strong Buy': return { bg: 'bg-emerald-900/40', text: 'text-emerald-300', border: 'border-emerald-600/50' };
            case 'Buy': return { bg: 'bg-green-900/40', text: 'text-green-300', border: 'border-green-600/50' };
            case 'Hold': return { bg: 'bg-amber-900/40', text: 'text-amber-300', border: 'border-amber-600/50' };
            case 'Sell': return { bg: 'bg-orange-900/40', text: 'text-orange-300', border: 'border-orange-600/50' };
            case 'Avoid': return { bg: 'bg-rose-900/40', text: 'text-rose-300', border: 'border-rose-600/50' };
            default: return { bg: 'bg-stone-800/40', text: 'text-stone-300', border: 'border-stone-600/50' };
        }
    };

    const getPhaseStyle = (phase: string) => {
        switch (phase) {
            case 'Emerging': return { color: 'text-violet-400', icon: '🌱', progress: 15 };
            case 'Growing': return { color: 'text-emerald-400', icon: '📈', progress: 40 };
            case 'Mainstream': return { color: 'text-blue-400', icon: '🎯', progress: 70 };
            case 'Mature': return { color: 'text-amber-400', icon: '⭐', progress: 90 };
            case 'Declining': return { color: 'text-rose-400', icon: '📉', progress: 100 };
            default: return { color: 'text-stone-400', icon: '❓', progress: 50 };
        }
    };

    const recStyle = getRecommendationStyle(investment.recommendation);
    const phaseStyle = timing ? getPhaseStyle(timing.currentPhase) : getPhaseStyle('');

    return (
        <section className="space-y-6">
            {/* Main Investment Score Card */}
            <div className={`${recStyle.bg} rounded-3xl p-8 border ${recStyle.border}`}>
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">💼</span>
                    <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-stone-400">
                        Investment Analysis
                    </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Score Signal */}
                    <div className="text-center">
                        <span className="text-4xl mb-3 block">{scoreSignal?.icon}</span>
                        <div className={`text-xl font-light ${scoreSignal?.color} mb-1`}>
                            {scoreSignal?.band}
                        </div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Signal Strength</span>
                        <p className="text-xs text-stone-400 leading-relaxed">{scoreSignal?.interpretation}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="text-center flex flex-col justify-center">
                        <div className={`text-2xl font-light ${recStyle.text} mb-2`}>
                            {investment.recommendation}
                        </div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider">Recommendation</span>
                    </div>

                    {/* Risk Level */}
                    <div className="text-center flex flex-col justify-center">
                        <div className={`text-2xl font-light mb-2 ${investment.riskLevel === 'Low' ? 'text-emerald-300' :
                            investment.riskLevel === 'Medium' ? 'text-amber-300' : 'text-rose-300'
                            }`}>
                            {investment.riskLevel}
                        </div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider">Risk Level</span>
                    </div>

                    {/* Confidence Signal */}
                    <div className="text-center flex flex-col justify-center">
                        <div className="text-2xl mb-2">{confidenceSignal?.icon}</div>
                        <div className={`text-lg font-light ${confidenceSignal?.color} mb-2`}>
                            {confidenceSignal?.band}
                        </div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Confidence</span>
                        <p className="text-xs text-stone-400 leading-relaxed">{confidenceSignal?.interpretation}</p>
                    </div>
                </div>

                {/* Reasoning */}
                <div className="mt-6 p-4 bg-stone-900/50 rounded-xl">
                    <p className="text-stone-300 font-light leading-relaxed">
                        <span className="text-stone-500 mr-2">💡</span>
                        {investment.reasoning}
                    </p>
                </div>
            </div>

            {/* Market Timing + Price Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Market Timing */}
                {timing && (
                    <div className="bg-stone-900/40 rounded-3xl p-6 border border-stone-800/50">
                        <h3 className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-2">
                            ⏱️ Market Timing
                        </h3>

                        {/* Phase Indicator */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-lg font-light ${phaseStyle.color}`}>
                                    {phaseStyle.icon} {timing.currentPhase}
                                </span>
                            </div>
                            <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 via-emerald-500 to-rose-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${phaseStyle.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-stone-500 mt-1">
                                <span>Emerging</span>
                                <span>Mainstream</span>
                                <span>Declining</span>
                            </div>
                        </div>

                        <p className="text-stone-400 text-sm font-light mb-3">{timing.phaseDescription}</p>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-stone-500">Peak Prediction</span>
                                <span className="text-white">{timing.peakPrediction}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Entry Window</span>
                                <span className="text-emerald-300">{timing.entryWindow}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Analysis */}
                {pricing && (
                    <div className="bg-stone-900/40 rounded-3xl p-6 border border-stone-800/50">
                        <h3 className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-2">
                            💰 Price Analysis
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-stone-800/30 rounded-xl">
                                <span className="text-stone-400 text-sm">Budget</span>
                                <span className="text-stone-200 text-sm font-light">{pricing.budgetRange}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-stone-800/30 rounded-xl">
                                <span className="text-stone-400 text-sm">Mid-Range</span>
                                <span className="text-stone-200 text-sm font-light">{pricing.midRange}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-stone-800/30 rounded-xl">
                                <span className="text-stone-400 text-sm">Luxury</span>
                                <span className="text-stone-200 text-sm font-light">{pricing.luxuryRange}</span>
                            </div>
                        </div>

                        {pricing.bestValuePick && (
                            <div className="mt-4 p-3 bg-emerald-900/20 rounded-xl border border-emerald-800/30">
                                <span className="text-emerald-400 text-xs font-medium">🏆 Best Value</span>
                                <p className="text-stone-300 text-sm font-light mt-1">{pricing.bestValuePick}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Target Audience */}
            {audience && (
                <div className="bg-stone-900/40 rounded-3xl p-6 border border-stone-800/50">
                    <h3 className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-2">
                        👥 Who Is This For?
                    </h3>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-stone-800/30 rounded-xl p-4">
                            <span className="text-xs text-stone-500 uppercase">Primary Audience</span>
                            <p className="text-stone-200 font-light mt-1">{audience.primaryDemo}</p>
                        </div>
                        <div className="bg-stone-800/30 rounded-xl p-4">
                            <span className="text-xs text-stone-500 uppercase">Also Appeals To</span>
                            <p className="text-stone-200 font-light mt-1">{audience.secondaryDemo}</p>
                        </div>
                        <div className="bg-rose-900/20 rounded-xl p-4 border border-rose-800/30">
                            <span className="text-xs text-rose-400 uppercase">Not Recommended For</span>
                            <p className="text-stone-300 font-light mt-1">{audience.notRecommendedFor}</p>
                        </div>
                        <div className="bg-stone-800/30 rounded-xl p-4">
                            <span className="text-xs text-stone-500 uppercase">Adoption Level</span>
                            <p className="text-violet-300 font-light mt-1">{audience.adoptionLevel}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actionable Next Steps */}
            {nextSteps && nextSteps.length > 0 && (
                <div className="bg-gradient-to-br from-blue-950/30 to-stone-950 rounded-3xl p-6 border border-blue-900/30">
                    <h3 className="text-sm font-medium tracking-widest uppercase text-blue-400/80 mb-4 flex items-center gap-2">
                        ✅ What To Do Next
                    </h3>

                    <div className="space-y-3">
                        {nextSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-stone-800/30 rounded-xl">
                                <span className="w-6 h-6 rounded-full bg-blue-900/50 text-blue-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <p className="text-stone-300 font-light text-sm">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default InvestmentAnalysisCard;

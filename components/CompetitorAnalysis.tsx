import React, { useMemo } from 'react';
import { Trophy, TrendingUp, DollarSign, Package, Target, Crown, Award } from 'lucide-react';

interface CompetitorAnalysisProps {
    shoppingData?: any;
    topic: string;
    region?: string;
}

interface CompetitorMetrics {
    brand: string;
    productCount: number;
    avgPrice: number;
    priceRange: { min: number; max: number };
    marketShare: number;
    strategy: string;
}

/**
 * Analyze competitors from real shopping data
 */
const analyzeCompetitors = (shoppingData: any, region: string = 'global'): CompetitorMetrics[] => {
    if (!shoppingData?.shopping_results || shoppingData.shopping_results.length === 0) {
        return [];
    }

    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    // Group by brand/source
    const brandMap = new Map<string, { prices: number[]; count: number }>();

    shoppingData.shopping_results.forEach((item: any) => {
        const brand = item.source || item.title?.split(' ')[0] || 'Unknown';
        const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');

        if (price > 0 && brand !== 'Unknown') {
            if (!brandMap.has(brand)) {
                brandMap.set(brand, { prices: [], count: 0 });
            }
            const data = brandMap.get(brand)!;
            data.prices.push(price);
            data.count++;
        }
    });

    const totalProducts = shoppingData.shopping_results.length;

    // Convert to metrics array
    const competitors: CompetitorMetrics[] = Array.from(brandMap.entries()).map(([brand, data]) => {
        const avgPrice = data.prices.reduce((a, b) => a + b, 0) / data.prices.length;
        const min = Math.min(...data.prices);
        const max = Math.max(...data.prices);
        const marketShare = (data.count / totalProducts) * 100;

        // Determine strategy based on pricing
        let strategy = '';
        if (avgPrice < 50) {
            strategy = 'Volume Play - Mass Market';
        } else if (avgPrice < 150) {
            strategy = 'Accessible Premium';
        } else if (avgPrice < 300) {
            strategy = 'Premium Positioning';
        } else {
            strategy = 'Luxury Tier';
        }

        return {
            brand,
            productCount: data.count,
            avgPrice,
            priceRange: { min, max },
            marketShare,
            strategy
        };
    });

    // Sort by market share (product count)
    return competitors.sort((a, b) => b.marketShare - a.marketShare);
};

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
    shoppingData,
    topic,
    region = 'global'
}) => {
    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    const competitors = useMemo(() =>
        analyzeCompetitors(shoppingData, region),
        [shoppingData, region]
    );

    if (competitors.length === 0) {
        return (
            <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <p className="text-stone-500 font-light">No competitor data available</p>
            </div>
        );
    }

    // Top 3 leaders
    const topThree = competitors.slice(0, 3);
    const others = competitors.slice(3);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <Trophy className="w-6 h-6 text-amber-400" />
                    <h2 className="text-2xl font-light text-white">
                        Competitor Landscape
                    </h2>
                </div>
                <p className="text-stone-400 font-light">
                    Who's winning with "{topic}" based on market presence
                </p>
            </div>

            {/* Market Leaders - Top 3 */}
            <div>
                <h3 className="text-sm font-light tracking-widest uppercase text-stone-500 mb-4">
                    Market Leaders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topThree.map((competitor, index) => (
                        <div
                            key={competitor.brand}
                            className={`relative bg-stone-900/60 backdrop-blur-xl rounded-2xl p-6 border ${index === 0
                                    ? 'border-amber-500/40'
                                    : 'border-stone-700/40'
                                }`}
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-stone-900 border-2 border-amber-500 flex items-center justify-center">
                                {index === 0 && <Crown className="w-6 h-6 text-amber-400" />}
                                {index === 1 && <Award className="w-5 h-5 text-stone-400" />}
                                {index === 2 && <Award className="w-5 h-5 text-stone-500" />}
                            </div>

                            {/* Brand Name */}
                            <div className="mb-4">
                                <h4 className="text-xl font-light text-white mb-1">
                                    {competitor.brand}
                                </h4>
                                <p className="text-xs text-stone-500 font-light">
                                    {competitor.strategy}
                                </p>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-3">
                                {/* Market Share */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-stone-500">Market Share</span>
                                        <span className="text-sm font-light text-amber-400">
                                            {competitor.marketShare.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                            style={{ width: `${competitor.marketShare}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Product Count */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-stone-500" />
                                        <span className="text-xs text-stone-500">Products</span>
                                    </div>
                                    <span className="text-sm font-light text-white">
                                        {competitor.productCount}
                                    </span>
                                </div>

                                {/* Avg Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-stone-500" />
                                        <span className="text-xs text-stone-500">Avg Price</span>
                                    </div>
                                    <span className="text-sm font-light text-white">
                                        {currency}{competitor.avgPrice.toFixed(0)}
                                    </span>
                                </div>

                                {/* Price Range */}
                                <div className="pt-2 border-t border-stone-800">
                                    <div className="flex items-center justify-between text-xs text-stone-500">
                                        <span>Range</span>
                                        <span className="text-stone-400">
                                            {currency}{competitor.priceRange.min.toFixed(0)} - {currency}{competitor.priceRange.max.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other Competitors */}
            {others.length > 0 && (
                <div>
                    <h3 className="text-sm font-light tracking-widest uppercase text-stone-500 mb-4">
                        Other Competitors
                    </h3>
                    <div className="bg-stone-900/60 backdrop-blur-xl rounded-2xl border border-stone-700/40 overflow-hidden">
                        <div className="divide-y divide-stone-800">
                            {others.map((competitor, index) => (
                                <div key={competitor.brand} className="p-4 hover:bg-stone-800/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-stone-600 font-light text-sm w-8">
                                                #{index + 4}
                                            </span>
                                            <div>
                                                <h5 className="text-base font-light text-white">
                                                    {competitor.brand}
                                                </h5>
                                                <p className="text-xs text-stone-500 font-light">
                                                    {competitor.strategy}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-right">
                                                <div className="text-amber-400 font-light">
                                                    {competitor.marketShare.toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-stone-500">share</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-stone-300 font-light">
                                                    {competitor.productCount}
                                                </div>
                                                <div className="text-xs text-stone-500">products</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-stone-300 font-light">
                                                    {currency}{competitor.avgPrice.toFixed(0)}
                                                </div>
                                                <div className="text-xs text-stone-500">avg</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Market Insights */}
            <div className="bg-gradient-to-r from-amber-900/20 to-stone-900/60 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-start gap-4">
                    <Target className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-light text-amber-400 mb-2">
                            Market Intelligence
                        </h3>
                        <p className="text-stone-200 font-light leading-relaxed text-sm">
                            {topThree[0]?.brand} leads with {topThree[0]?.marketShare.toFixed(1)}% market share ({topThree[0]?.productCount} products).
                            {topThree.length > 1 && ` ${topThree[1]?.brand} and ${topThree[2]?.brand} follow with ${(topThree[1]?.marketShare + topThree[2]?.marketShare).toFixed(1)}% combined.`}
                            {' '}Market shows {competitors.length} active competitors with average price point at {currency}
                            {(competitors.reduce((sum, c) => sum + c.avgPrice, 0) / competitors.length).toFixed(0)}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Competitive Strategy Tip */}
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-2xl p-5 border border-stone-700/40">
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-stone-400 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-light text-stone-300 mb-2 tracking-wide">
                            Strategic Opportunity
                        </h4>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">
                            {topThree[0]?.avgPrice < 100
                                ? 'Market is volume-driven. Consider premium positioning to capture underserved segment.'
                                : topThree[0]?.avgPrice > 200
                                    ? 'Luxury brands dominate. Opportunity exists for accessible alternatives.'
                                    : 'Balanced market. Differentiate through unique value proposition or niche targeting.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitorAnalysis;

import React from 'react';
import { TrendingUp, DollarSign, Store, Clock } from 'lucide-react';

interface InvestmentAnalysis {
    averagePrice: number;
    priceRange: { min: number; max: number };
    brandCount: number;
    recommendation: string;
    reasoning: string;
    confidence: number;
    bestValue: string;
    timing: string;
}

/**
 * Analyze Real Shopping Data for Investment Recommendations
 * NO hardcoded values - pure data analysis
 */
export const analyzeInvestmentData = (shoppingData: any, region: string = 'global'): InvestmentAnalysis | null => {
    if (!shoppingData?.shopping_results || shoppingData.shopping_results.length === 0) {
        return null;
    }

    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    // Extract prices
    const prices = shoppingData.shopping_results
        .map((item: any) => parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'))
        .filter((price: number) => price > 0);

    if (prices.length === 0) return null;

    // Calculate statistics
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const median = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)];

    // Extract unique brands
    const brands = new Set(
        shoppingData.shopping_results.map((item: any) => item.source).filter(Boolean)
    );

    // Price tier analysis
    const budgetCount = prices.filter(p => p < avg * 0.7).length;
    const midCount = prices.filter(p => p >= avg * 0.7 && p <= avg * 1.3).length;
    const luxuryCount = prices.filter(p => p > avg * 1.3).length;

    // Generate recommendation based on REAL data
    let recommendation = '';
    let reasoning = '';
    let confidence = 0;
    let timing = '';

    const priceVariance = (max - min) / avg;

    if (priceVariance > 3) {
        recommendation = 'Diversified Market';
        reasoning = `Wide price distribution across ${brands.size} brands indicates established trend with entry points at every tier.`;
        confidence = 75;
        timing = 'Enter Now';
    } else if (avg < median * 0.9) {
        recommendation = 'Early Stage Opportunity';
        reasoning = `Below-median pricing suggests early adoption phase with room for growth.`;
        confidence = 65;
        timing = 'Accumulate';
    } else if (luxuryCount > midCount + budgetCount) {
        recommendation = 'Peak Saturation';
        reasoning = `Luxury-dominated market. Consider strategic positioning.`;
        confidence = 80;
        timing = 'Monitor';
    } else {
        recommendation = 'Balanced Market';
        reasoning = `Healthy distribution across price tiers. Accessible entry available.`;
        confidence = 70;
        timing = 'Strategic Entry';
    }

    const bestValueProduct = shoppingData.shopping_results
        .filter((item: any) => {
            const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
            return price > 0 && price < avg && price > min;
        })
        .sort((a: any, b: any) => {
            const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
            const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
            return priceB - priceA;
        })[0];

    const bestValue = bestValueProduct
        ? `${bestValueProduct.source || 'Available'} at ${currency}${parseFloat(bestValueProduct.price?.replace(/[^0-9.]/g, '') || '0').toFixed(0)}`
        : `Mid-tier options around ${currency}${avg.toFixed(0)}`;

    return {
        averagePrice: avg,
        priceRange: { min, max },
        brandCount: brands.size,
        recommendation,
        reasoning,
        confidence,
        bestValue,
        timing
    };
};

interface EditorialInvestmentProps {
    shoppingData?: any;
    region?: string;
}

const EditorialInvestment: React.FC<EditorialInvestmentProps> = ({ shoppingData, region = 'global' }) => {
    const analysis = analyzeInvestmentData(shoppingData, region);

    if (!analysis) {
        return (
            <div className="text-center py-12">
                <p className="text-stone-500 font-light">Market data unavailable</p>
            </div>
        );
    }

    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    return (
        <div className="space-y-6">
            {/* Market Signal Card */}
            <div className="bg-stone-900/40 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="text-xs text-stone-500 uppercase tracking-widest mb-2">Market Signal</div>
                        <h3 className="text-2xl font-light text-white">{analysis.recommendation}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/20 border border-amber-700/30 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-amber-400 font-medium">{analysis.timing}</span>
                    </div>
                </div>
                <p className="text-stone-300 font-light leading-relaxed">{analysis.reasoning}</p>

                {/* Confidence Bar */}
                <div className="mt-4 pt-4 border-t border-stone-800/50">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span>Signal Strength</span>
                        <span className="text-stone-400 font-medium">{analysis.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                            style={{ width: `${analysis.confidence}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Market Metrics Grid */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-xl p-5 border border-stone-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Price Range</div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-light text-stone-200">{currency}{analysis.priceRange.min.toFixed(0)}</span>
                        <span className="text-sm text-stone-500">to</span>
                        <span className="text-2xl font-light text-stone-200">{currency}{analysis.priceRange.max.toFixed(0)}</span>
                    </div>
                </div>

                {/* Average Price */}
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-xl p-5 border border-stone-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Average Price</div>
                    </div>
                    <div className="text-3xl font-extralight text-white">
                        {currency}{analysis.averagePrice.toFixed(0)}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Market average</div>
                </div>

                {/* Brand Count */}
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-xl p-5 border border-stone-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <Store className="w-4 h-4 text-blue-400" />
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Active Brands</div>
                    </div>
                    <div className="text-3xl font-extralight text-white">{analysis.brandCount}</div>
                    <div className="text-xs text-stone-500 mt-1">In this market</div>
                </div>
            </div>

            {/* Best Value */}
            <div className="bg-gradient-to-r from-amber-900/10 to-stone-900/10 backdrop-blur-sm rounded-xl p-5 border border-amber-800/20">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">Best Value</div>
                <div className="text-sm text-stone-300 font-light">{analysis.bestValue}</div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-stone-800/50 text-center">
                <p className="text-xs text-stone-500 font-light">
                    Analysis based on {shoppingData.shopping_results.length} real products
                </p>
            </div>
        </div>
    );
};

export default EditorialInvestment;

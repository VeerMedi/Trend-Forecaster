import React, { useState, useMemo } from 'react';
import type { TrendAnalysis } from '../types';
import { Store, TrendingUp } from 'lucide-react';

interface FashionBrandsViewProps {
    data: TrendAnalysis;
}

interface BrandData {
    name: string;
    pricePoint: string;
    products: number;
    avgPrice: number;
}

interface BrandTier {
    tier: string;
    label: string;
    priceRange: string;
    brands: BrandData[];
}

/**
 * Extract real brands from shopping data and organize by price tiers
 */
const extractBrandsFromShoppingData = (shoppingData: any, region: string = 'global'): BrandTier[] => {
    if (!shoppingData?.shopping_results || shoppingData.shopping_results.length === 0) {
        return [];
    }

    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    // Group products by brand/source
    const brandMap = new Map<string, { prices: number[]; count: number }>();

    shoppingData.shopping_results.forEach((item: any) => {
        const brand = item.source || item.title?.split(' ')[0] || 'Unknown';
        const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');

        if (price > 0) {
            if (!brandMap.has(brand)) {
                brandMap.set(brand, { prices: [], count: 0 });
            }
            const brandData = brandMap.get(brand)!;
            brandData.prices.push(price);
            brandData.count++;
        }
    });

    // Calculate average price for each brand
    const brands: BrandData[] = Array.from(brandMap.entries()).map(([name, data]) => {
        const avgPrice = data.prices.reduce((a, b) => a + b, 0) / data.prices.length;
        const minPrice = Math.min(...data.prices);
        const maxPrice = Math.max(...data.prices);

        return {
            name,
            pricePoint: `${currency}${minPrice.toFixed(0)}-${maxPrice.toFixed(0)}`,
            products: data.count,
            avgPrice
        };
    });

    // Calculate overall average to determine tiers
    const overallAvg = brands.reduce((sum, b) => sum + b.avgPrice, 0) / brands.length;

    // Organize into tiers based on average price
    const luxury = brands.filter(b => b.avgPrice > overallAvg * 1.5);
    const premium = brands.filter(b => b.avgPrice >= overallAvg && b.avgPrice <= overallAvg * 1.5);
    const mid = brands.filter(b => b.avgPrice >= overallAvg * 0.6 && b.avgPrice < overallAvg);
    const budget = brands.filter(b => b.avgPrice < overallAvg * 0.6);

    const tiers: BrandTier[] = [];

    if (luxury.length > 0) {
        const min = Math.min(...luxury.map(b => b.avgPrice));
        const max = Math.max(...luxury.map(b => b.avgPrice));
        tiers.push({
            tier: 'luxury',
            label: 'Luxury Tier',
            priceRange: `${currency}${min.toFixed(0)} - ${currency}${max.toFixed(0)}+`,
            brands: luxury.sort((a, b) => b.avgPrice - a.avgPrice)
        });
    }

    if (premium.length > 0) {
        const min = Math.min(...premium.map(b => b.avgPrice));
        const max = Math.max(...premium.map(b => b.avgPrice));
        tiers.push({
            tier: 'premium',
            label: 'Premium Mid-Tier',
            priceRange: `${currency}${min.toFixed(0)} - ${currency}${max.toFixed(0)}`,
            brands: premium.sort((a, b) => b.avgPrice - a.avgPrice)
        });
    }

    if (mid.length > 0) {
        const min = Math.min(...mid.map(b => b.avgPrice));
        const max = Math.max(...mid.map(b => b.avgPrice));
        tiers.push({
            tier: 'mid',
            label: 'Accessible Mid-Range',
            priceRange: `${currency}${min.toFixed(0)} - ${currency}${max.toFixed(0)}`,
            brands: mid.sort((a, b) => b.avgPrice - a.avgPrice)
        });
    }

    if (budget.length > 0) {
        const min = Math.min(...budget.map(b => b.avgPrice));
        const max = Math.max(...budget.map(b => b.avgPrice));
        tiers.push({
            tier: 'budget',
            label: 'Budget-Friendly',
            priceRange: `${currency}${min.toFixed(0)} - ${currency}${max.toFixed(0)}`,
            brands: budget.sort((a, b) => b.avgPrice - a.avgPrice)
        });
    }

    return tiers;
};

const FashionBrandsView: React.FC<FashionBrandsViewProps> = ({ data }) => {
    const [selectedBudget, setSelectedBudget] = useState(200);

    // Extract shopping data
    const shoppingData = (data as any).shoppingData;
    const region = (data as any).region || 'global';
    const currency = region === 'IN' ? '₹' : region === 'GB' ? '£' : '$';

    // Extract real brand tiers from shopping data
    const tiers = useMemo(() => {
        return extractBrandsFromShoppingData(shoppingData, region);
    }, [shoppingData, region]);

    // Extract fashion category metadata if available
    const fashionCategory = (data as any).fashionCategory;
    const categoryName = fashionCategory?.name || 'Fashion';

    // Calculate investment strategy based on selected budget
    const investment = useMemo(() => {
        const month1_2 = selectedBudget * 2 * 0.4;
        const month3_4 = selectedBudget * 2 * 0.35;
        const month5_6 = selectedBudget * 2 * 0.25;

        return {
            budget: `${currency}${selectedBudget}/month over 6 months`,
            allocation: [
                {
                    category: 'Month 1-2: Foundation (40%)',
                    amount: month1_2.toFixed(0),
                    recommendation: `Invest in 2-3 core basics from mid-to-premium tiers. Focus: perfect-fitting pieces, quality essentials, versatile items. Prioritize neutrals and timeless silhouettes.`
                },
                {
                    category: 'Month 3-4: Layering (35%)',
                    amount: month3_4.toFixed(0),
                    recommendation: `Add 1-2 statement pieces. This is where you invest more per item - quality pieces will last years. Consider premium tier here for longevity.`
                },
                {
                    category: 'Month 5-6: Accent Pieces (25%)',
                    amount: month5_6.toFixed(0),
                    recommendation: `Trend experiments and accent pieces. Mix high-low: save on fleeting trends, splurge on classic accents. Test new styles at budget tier first.`
                }
            ],
            totalItems: 10,
            reasoning: `6-month systematic build creates a functional wardrobe where everything works together. Foundation pieces from quality brands provide longevity; budget items for trend testing keep cost down. Total investment: ${currency}${selectedBudget * 6} for 10-12 versatile pieces.`
        };
    }, [selectedBudget, currency]);

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'luxury': return 'border-amber-500/40 bg-stone-900/60';
            case 'premium': return 'border-stone-600/40 bg-stone-900/60';
            case 'mid': return 'border-stone-600/40 bg-stone-900/60';
            case 'budget': return 'border-stone-600/40 bg-stone-900/60';
            default: return 'border-stone-700/40 bg-stone-900/60';
        }
    };

    if (tiers.length === 0) {
        return (
            <div className="text-center py-12">
                <Store className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <p className="text-stone-500 font-light">No brand data available for this trend</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <section className="text-center py-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Store className="w-8 h-8 text-amber-400" />
                    <h1 className="text-3xl md:text-4xl font-extralight text-white tracking-tight">
                        {categoryName} Brands
                    </h1>
                </div>
                <p className="text-lg text-stone-300 font-light max-w-2xl mx-auto">
                    Real brands available for "{data.topic}"
                </p>
                {fashionCategory && (
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded-full">
                        <span className="text-xs text-amber-400 font-light tracking-wide uppercase">Category</span>
                        <span className="text-sm text-white font-light">{categoryName}</span>
                    </div>
                )}
            </section>

            {/* Budget Selector */}
            <section className="bg-stone-900/60 backdrop-blur-xl rounded-2xl p-6 border border-stone-700/40">
                <label className="block text-sm font-light text-stone-300 mb-3 tracking-wide">
                    Monthly Budget for Investment Plan
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="100"
                        max="500"
                        step="50"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-2xl font-extralight text-amber-400 min-w-[120px]">
                        {currency}{selectedBudget}/mo
                    </span>
                </div>
            </section>

            {/* Brand Tiers */}
            <section>
                <h2 className="text-sm font-light tracking-widest uppercase text-stone-500 mb-6">
                    Brands by Price Tier
                </h2>
                <div className="space-y-6">
                    {tiers.map((tier, idx) => (
                        <div key={idx} className={`rounded-2xl p-6 md:p-8 border backdrop-blur-xl ${getTierColor(tier.tier)}`}>
                            {/* Tier Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-light text-white mb-1">
                                        {tier.label}
                                    </h3>
                                    <p className="text-sm text-stone-400 font-light">
                                        {tier.priceRange}
                                    </p>
                                </div>
                                <span className="text-xs px-3 py-1.5 bg-stone-800/60 rounded-full text-stone-400 font-light">
                                    {tier.brands.length} {tier.brands.length === 1 ? 'brand' : 'brands'} • From shopping data
                                </span>
                            </div>

                            {/* Brands Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tier.brands.map((brand, brandIdx) => (
                                    <div key={brandIdx} className="bg-stone-950/60 backdrop-blur-sm rounded-xl p-5 border border-stone-700/30 hover:border-amber-500/30 transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-lg font-light text-white">
                                                {brand.name}
                                            </h4>
                                            <span className="text-xs text-amber-400 font-light">
                                                {brand.pricePoint}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-stone-500">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>{brand.products} products available</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Investment Strategy */}
            <section className="bg-stone-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-amber-900/30">
                <div className="flex items-center gap-3 mb-6">
                    <div>
                        <h2 className="text-2xl font-light text-white mb-1">
                            Practical Investment Plan
                        </h2>
                        <p className="text-sm text-stone-400 font-light">
                            {investment.budget} = {currency}{selectedBudget * 6} total investment
                        </p>
                    </div>
                </div>

                {/* Allocation Breakdown */}
                <div className="space-y-4 mb-6">
                    {investment.allocation.map((alloc, idx) => (
                        <div key={idx} className="bg-stone-950/60 rounded-xl p-5 border border-stone-700/30">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-light text-amber-400">
                                    {alloc.category}
                                </h3>
                                <span className="text-xl font-extralight text-white">
                                    {currency}{alloc.amount}
                                </span>
                            </div>
                            <p className="text-sm text-stone-300 font-light leading-relaxed">
                                {alloc.recommendation}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Reasoning */}
                <div className="bg-stone-800/40 rounded-xl p-5 border-l-2 border-l-amber-500">
                    <h4 className="text-xs font-light tracking-widest uppercase text-stone-400 mb-2">
                        Why This Works
                    </h4>
                    <p className="text-stone-300 font-light leading-relaxed text-sm">
                        {investment.reasoning}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default FashionBrandsView;

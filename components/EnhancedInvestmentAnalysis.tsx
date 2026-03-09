import React from 'react';
import type { TrendAnalysis } from '../types';
import ExpandableMetricCard from './ExpandableMetricCard';

interface EnhancedInvestmentAnalysisProps {
    data: TrendAnalysis;
    redditData?: any;
    fashionMediaData?: any;
    shoppingData?: any;
    region?: string; // NEW: Region for currency/brand filtering
}

/**
 * Enhanced Investment Analysis with Region-Specific Brands & Pricing
 * Shows REAL brands and prices from Google Shopping for selected region
 */
const EnhancedInvestmentAnalysis: React.FC<EnhancedInvestmentAnalysisProps> = ({
    data,
    redditData,
    fashionMediaData,
    shoppingData,
    region = 'global'
}) => {
    const investment = data.investmentAnalysis;
    const timing = data.marketTiming;
    const pricing = data.priceAnalysis;

    if (!investment) return null;

    // Currency symbols by region
    const getCurrency = () => {
        const currencies: Record<string, string> = {
            'US': '$',
            'IN': '₹',
            'GB': '£',
            'global': '$'
        };
        return currencies[region] || '$';
    };

    const currency = getCurrency();

    // Extract REAL brands from shopping data
    const extractBrands = () => {
        if (!shoppingData?.shopping_results) return [];

        const brandMap: Record<string, { count: number; minPrice: number; maxPrice: number; source: string }> = {};

        shoppingData.shopping_results.forEach((product: any) => {
            // Try to extract brand from source or title
            const brand = product.source || extractBrandFromTitle(product.title);
            const price = parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0');

            if (brand && price > 0) {
                if (!brandMap[brand]) {
                    brandMap[brand] = {
                        count: 0,
                        minPrice: price,
                        maxPrice: price,
                        source: product.source || brand
                    };
                }
                brandMap[brand].count++;
                brandMap[brand].minPrice = Math.min(brandMap[brand].minPrice, price);
                brandMap[brand].maxPrice = Math.max(brandMap[brand].maxPrice, price);
            }
        });

        return Object.entries(brandMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 brands
    };

    const extractBrandFromTitle = (title: string): string => {
        // Common brand patterns in titles
        const parts = title.split(/[-|]/);
        return parts[0]?.trim() || 'Unknown';
    };

    const brands = extractBrands();

    // Calculate actual price range from shopping data with currency
    const getPriceRange = () => {
        if (!shoppingData?.shopping_results) {
            return { min: null, max: null, tiers: null };
        }

        const prices = shoppingData.shopping_results
            .map((item: any) => {
                const priceNum = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
                return { price: priceNum, source: item.source, title: item.title, link: item.link };
            })
            .filter((item: any) => item.price > 0);

        if (prices.length === 0) {
            return { min: null, max: null, tiers: null };
        }

        const priceValues = prices.map((p: any) => p.price);
        const min = Math.min(...priceValues);
        const max = Math.max(...priceValues);
        const range = max - min;

        const budget = prices.filter((p: any) => p.price < (min + range / 3));
        const mid = prices.filter((p: any) => p.price >= (min + range / 3) && p.price < (min + (2 * range) / 3));
        const luxury = prices.filter((p: any) => p.price >= (min + (2 * range) / 3));

        return {
            min: Math.floor(min),
            max: Math.ceil(max),
            tiers: { budget, mid, luxury }
        };
    };

    const priceData = getPriceRange();

    // Build detailed explanations
    const signalDetails = (
        <div className="space-y-3 text-sm">
            <div className="font-medium text-stone-300 mb-2">Why "{investment.score >= 7 ? 'High' : investment.score >= 4 ? 'Medium' : 'Low'} Signal"?</div>

            <div className="space-y-2">
                {redditData?.topPosts && redditData.topPosts.length > 0 && (
                    <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-stone-400">
                            Reddit: {redditData.totalPosts} posts, {redditData.topPosts[0]?.upvotes} upvotes
                        </span>
                    </div>
                )}

                {fashionMediaData?.articles && fashionMediaData.articles.length > 0 && (
                    <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-stone-400">
                            Fashion Media: {fashionMediaData.articles.length} articles ({fashionMediaData.sources.join(', ')})
                        </span>
                    </div>
                )}

                {timing && (
                    <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-stone-400">
                            Market Phase: {timing.currentPhase}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-700/50">
                <div className="text-xs text-stone-500">
                    Data sources: {[
                        redditData?.topPosts?.length > 0 ? 'Reddit API' : null,
                        fashionMediaData?.articles?.length > 0 ? 'Fashion Media RSS' : null,
                        'Google Trends'
                    ].filter(Boolean).join(', ')}
                </div>
            </div>
        </div>
    );

    const recommendationDetails = (
        <div className="space-y-3 text-sm">
            <div className="font-medium text-stone-300 mb-2">Why "{investment.recommendation}"?</div>

            <div className="space-y-2 text-stone-400">
                <p>{investment.reasoning}</p>

                {timing && (
                    <>
                        <div className="flex items-start gap-2 mt-3">
                            <span>📊</span>
                            <div>
                                <div className="font-medium text-stone-300">Market Timing</div>
                                <div>{timing.phaseDescription}</div>
                                <div className="text-xs text-stone-500 mt-1">{timing.peakPrediction}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <span>⏰</span>
                            <div>
                                <div className="font-medium text-stone-300">Entry Window</div>
                                <div>{timing.entryWindow}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    // NEW: Brands available in region
    const brandsDetails = brands.length > 0 ? (
        <div className="space-y-3 text-sm">
            <div className="font-medium text-stone-300 mb-3">Brands Available in {region === 'IN' ? 'India' : region === 'US' ? 'USA' : region === 'GB' ? 'UK' : 'Global'}</div>

            <div className="space-y-2">
                {brands.slice(0, 6).map((brand, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-stone-900/40 rounded-lg">
                        <div>
                            <div className="text-stone-300 font-medium">{brand.name}</div>
                            <div className="text-xs text-stone-500">{brand.count} product{brand.count > 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-stone-300">{currency}{brand.minPrice.toFixed(0)}-{brand.maxPrice.toFixed(0)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-700/50">
                <div className="text-xs text-stone-500">
                    Source: Google Shopping API • {shoppingData.shopping_results.length} products analyzed
                </div>
            </div>
        </div>
    ) : (
        <div className="text-sm text-stone-400">
            No brand data available for this region yet.
        </div>
    );

    const priceRangeDetails = priceData.min && priceData.max ? (
        <div className="space-y-3 text-sm">
            <div className="font-medium text-stone-300 mb-3">Actual Market Prices ({region === 'IN' ? 'India' : region === 'US' ? 'USA' : region === 'GB' ? 'UK' : 'Global'})</div>

            {priceData.tiers && (
                <div className="space-y-3">
                    {/* Budget Tier */}
                    {priceData.tiers.budget.length > 0 && (
                        <div>
                            <div className="text-xs text-stone-500 uppercase tracking-wider mb-1.5">Budget</div>
                            <div className="space-y-1">
                                {priceData.tiers.budget.slice(0, 3).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-stone-400 p-2 bg-stone-900/30 rounded">
                                        <span className="truncate mr-2 flex-1">{item.source || item.title.slice(0, 40)}...</span>
                                        <span className="text-green-400 font-medium">{currency}{item.price.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mid-Range Tier */}
                    {priceData.tiers.mid.length > 0 && (
                        <div>
                            <div className="text-xs text-stone-500 uppercase tracking-wider mb-1.5">Mid-Range</div>
                            <div className="space-y-1">
                                {priceData.tiers.mid.slice(0, 3).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-stone-400 p-2 bg-stone-900/30 rounded">
                                        <span className="truncate mr-2 flex-1">{item.source || item.title.slice(0, 40)}...</span>
                                        <span className="text-blue-400 font-medium">{currency}{item.price.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Luxury Tier */}
                    {priceData.tiers.luxury.length > 0 && (
                        <div>
                            <div className="text-xs text-stone-500 uppercase tracking-wider mb-1.5">Luxury</div>
                            <div className="space-y-1">
                                {priceData.tiers.luxury.slice(0, 3).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-stone-400 p-2 bg-stone-900/30 rounded">
                                        <span className="truncate mr-2 flex-1">{item.source || item.title.slice(0, 40)}...</span>
                                        <span className="text-purple-400 font-medium">{currency}{item.price.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-3 pt-3 border-t border-stone-700/50">
                <div className="text-xs text-stone-500">
                    Source: Google Shopping API • {shoppingData?.shopping_results?.length || 0} products analyzed
                </div>
            </div>
        </div>
    ) : (
        <div className="text-sm text-stone-400">
            {pricing?.budgetRange && (
                <div className="space-y-2">
                    <div>Budget: {pricing.budgetRange}</div>
                    <div>Mid-Range: {pricing.midRange}</div>
                    <div>Luxury: {pricing.luxuryRange}</div>
                    {pricing.bestValuePick && (
                        <div className="mt-3 pt-3 border-t border-stone-700/50">
                            <div className="text-xs text-stone-500">Best Value: {pricing.bestValuePick}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const riskDetails = (
        <div className="space-y-2 text-sm text-stone-400">
            <div className="font-medium text-stone-300 mb-2">Risk Assessment</div>
            <p>Risk level based on market volatility, competition saturation, and price point accessibility.</p>

            {timing?.exitSignals && timing.exitSignals.length > 0 && (
                <div className="mt-3">
                    <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">Exit Signals to Watch</div>
                    <div className="space-y-1">
                        {timing.exitSignals.map((signal, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <span className="text-amber-400">⚠</span>
                                <span>{signal}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <section className="space-y-4">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💼</span>
                    <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-stone-400">
                        Investment Analysis
                    </h2>
                    <span className="ml-auto text-xs text-stone-500">
                        {region === 'IN' ? '🇮🇳 India' : region === 'US' ? '🇺🇸 USA' : region === 'GB' ? '🇬🇧 UK' : '🌍 Global'}
                    </span>
                </div>
                <p className="text-stone-500 text-sm">Real brands & prices from {region === 'IN' ? 'Indian' : region === 'US' ? 'US' : region === 'GB' ? 'UK' : 'global'} market • Click any metric for details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Investment Signal */}
                <ExpandableMetricCard
                    icon="🚀"
                    title="Investment Signal"
                    value={investment.score >= 7 ? 'High Signal' : investment.score >= 4 ? 'Medium Signal' : 'Low Signal'}
                    subtitle={`Score: ${investment.score}/10`}
                    details={signalDetails}
                    color="green"
                />

                {/* Recommendation */}
                <ExpandableMetricCard
                    icon="✅"
                    title="Recommendation"
                    value={investment.recommendation}
                    subtitle={timing?.currentPhase || undefined}
                    details={recommendationDetails}
                    color={investment.recommendation.includes('Buy') ? 'green' : 'amber'}
                />

                {/* NEW: Brands in Region */}
                <ExpandableMetricCard
                    icon="🏷️"
                    title="Brands Available"
                    value={brands.length > 0 ? `${brands.length} brands` : 'Limited data'}
                    subtitle={brands.length > 0 ? `Top: ${brands[0].name}` : undefined}
                    details={brandsDetails}
                    color="purple"
                />

                {/* Price Range */}
                <ExpandableMetricCard
                    icon="💰"
                    title="Price Range"
                    value={priceData.min && priceData.max ? `${currency}${priceData.min} - ${currency}${priceData.max}` : (pricing?.midRange || 'Varies')}
                    subtitle={priceData.min ? `${shoppingData.shopping_results.length} products` : undefined}
                    details={priceRangeDetails}
                    color="blue"
                />

                {/* Risk Level */}
                <ExpandableMetricCard
                    icon={investment.riskLevel === 'Low' ? '🛡️' : investment.riskLevel === 'Medium' ? '⚖️' : '⚠️'}
                    title="Risk Level"
                    value={investment.riskLevel}
                    subtitle={`${investment.confidencePercent}% confidence`}
                    details={riskDetails}
                    color={investment.riskLevel === 'Low' ? 'green' : investment.riskLevel === 'Medium' ? 'amber' : 'purple'}
                />
            </div>
        </section>
    );
};

export default EnhancedInvestmentAnalysis;

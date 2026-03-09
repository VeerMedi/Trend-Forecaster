/**
 * Brand Recommendations Service
 * Provides tiered brand recommendations and investment strategies
 */

interface BrandTier {
    tier: 'luxury' | 'premium' | 'mid' | 'affordable' | 'budget';
    label: string;
    priceRange: string;
    brands: Array<{
        name: string;
        pricePoint: string;
        why: string;
        availability: string;
    }>;
}

interface InvestmentStrategy {
    budget: string;
    allocation: Array<{
        category: string;
        amount: string;
        recommendation: string;
    }>;
    totalItems: number;
    reasoning: string;
}

class BrandRecommendationService {
    /**
     * Get brand recommendations by tier for a fashion category
     */
    getBrandsByTier(query: string, region: string = 'global'): BrandTier[] {
        const queryLower = query.toLowerCase();
        const tiers: BrandTier[] = [];

        // Determine category
        const isFootwear = queryLower.includes('shoe') || queryLower.includes('sneaker') || queryLower.includes('boot');
        const isDenim = queryLower.includes('jeans') || queryLower.includes('denim');
        const isShirt = queryLower.includes('shirt') || queryLower.includes('top') || queryLower.includes('tee');
        const isOuterwear = queryLower.includes('jacket') || queryLower.includes('coat') || queryLower.includes('hoodie');

        if (isFootwear) {
            return this.getFootwearBrands(region);
        } else if (isDenim) {
            return this.getDenimBrands(region);
        } else if (isShirt) {
            return this.getShirtBrands(region);
        } else if (isOuterwear) {
            return this.getOuterwearBrands(region);
        } else {
            return this.getGenericFashionBrands(region);
        }
    }

    private getFootwearBrands(region: string): BrandTier[] {
        const brands: BrandTier[] = [
            {
                tier: 'luxury',
                label: 'Luxury Tier',
                priceRange: '$400 - $2,000+',
                brands: [
                    { name: 'Common Projects', pricePoint: '$400-550', why: 'Minimalist Italian craftsmanship, timeless design', availability: 'Global luxury retailers' },
                    { name: 'Maison Margiela', pricePoint: '$500-800', why: 'Avant-garde designs, iconic Tabis', availability: 'High-end boutiques' },
                    { name: 'Golden Goose', pricePoint: '$450-600', why: 'Distressed luxury aesthetic, handmade in Italy', availability: 'Luxury department stores' }
                ]
            },
            {
                tier: 'premium',
                label: 'Premium Tier',
                priceRange: '$120 - $400',
                brands: [
                    { name: 'New Balance 990 series', pricePoint: '$185-220', why: 'Made in USA/UK, superior comfort, heritage', availability: 'Specialty sneaker stores' },
                    { name: 'Veja', pricePoint: '$120-180', why: 'Sustainable materials, French design', availability: 'Eco-conscious retailers' },
                    { name: 'Axel Arigato', pricePoint: '$200-350', why: 'Scandinavian minimalism, quality leather', availability: 'Contemporary fashion stores' }
                ]
            },
            {
                tier: 'mid',
                label: 'Mid-Range',
                priceRange: '$60 - $120',
                brands: [
                    { name: 'Adidas Originals', pricePoint: '$80-130', why: 'Iconic silhouettes, reliable quality', availability: 'Widely available globally' },
                    { name: 'Converse Chuck 70', pricePoint: '$85-95', why: 'Upgraded version of classics, better materials', availability: 'Most shoe retailers' },
                    { name: 'Vans', pricePoint: '$60-85', why: 'Skate culture heritage, durable', availability: region === 'IN' ? 'Major Indian cities' : 'Global' }
                ]
            },
            {
                tier: 'budget',
                label: 'Budget-Friendly',
                priceRange: 'Under $60',
                brands: [
                    { name: 'Bata', pricePoint: '$20-50', why: 'Value for money, widely accessible in India', availability: region === 'IN' ? 'Pan-India' : 'Asia markets' },
                    { name: 'Decathlon Kalenji', pricePoint: '$30-50', why: 'Performance basics, good build quality', availability: 'Decathlon stores' }
                ]
            }
        ];

        return brands;
    }

    private getDenimBrands(region: string): BrandTier[] {
        return [
            {
                tier: 'luxury',
                label: 'Luxury Denim',
                priceRange: '$250 - $500+',
                brands: [
                    { name: 'Acne Studios', pricePoint: '$280-350', why: 'Swedish minimalist cuts, perfect fits', availability: 'Luxury retailers' },
                    { name: 'A.P.C.', pricePoint: '$220-280', why: 'French quality, ages beautifully', availability: 'High-end fashion stores' },
                    { name: 'Saint Laurent', pricePoint: '$600+', why: 'Designer status, impeccable tailoring', availability: 'Luxury department stores' }
                ]
            },
            {
                tier: 'premium',
                label: 'Premium Denim',
                priceRange: '$100 - $250',
                brands: [
                    { name: 'Nudie Jeans', pricePoint: '$150-180', why: 'Organic denim, free repairs for life', availability: 'Contemporary fashion retailers' },
                    { name: 'Rag & Bone', pricePoint: '$190-250', why: 'American quality, modern fits', availability: 'Designer boutiques' },
                    { name: 'Levi's Made & Crafted', pricePoint: '$130 - 170', why: 'Premium line of iconic brand', availability: 'Select Levi\'s stores' }
        ]
    },
            {
    tier: 'mid',
        label: 'Mid-Range',
            priceRange: '$50 - $100',
                brands: [
                    { name: 'Levi's 501/511', pricePoint: '$60-90', why: 'Gold standard, proven fits', availability: 'Widely available' },
                    { name: 'Uniqlo Selvedge', pricePoint: '$50-70', why: 'Japanese quality at accessible prices', availability: region === 'IN' ? 'Major cities' : 'Global' },
                    { name: 'Madewell', pricePoint: '$80-120', why: 'Comfortable, well-made basics', availability: 'US and online' }
                ]
},
{
    tier: 'budget',
        label: 'Budget Options',
            priceRange: 'Under $50',
                brands: [
                    { name: 'H&M Denim', pricePoint: '$20-40', why: 'Fast fashion basics, trendy fits', availability: 'Global' },
                    { name: 'Wrangler', pricePoint: '$30-50', why: 'American workwear, durable', availability: region === 'IN' ? 'Pan-India' : 'Global' }
                ]
}
        ];
    }

    private getShirtBrands(region: string): BrandTier[] {
    return [
        {
            tier: 'luxury',
            label: 'Luxury Shirts',
            priceRange: '$150 - $500+',
            brands: [
                { name: 'Thom Browne', pricePoint: '$350-600', why: 'Iconic American prep, unique details', availability: 'High-end boutiques' },
                { name: 'Comme des Garçons', pricePoint: '$200-400', why: 'Japanese avant-garde, statement pieces', availability: 'Designer stores' }
            ]
        },
        {
            tier: 'premium',
            label: 'Premium Shirts',
            priceRange: '$80 - $150',
            brands: [
                { name: 'Norse Projects', pricePoint: '$100-150', why: 'Scandinavian quality, clean aesthetic', availability: 'Contemporary retailers' },
                { name: 'A.P.C.', pricePoint: '$120-160', why: 'French minimalism, superior fabrics', availability: 'Fashion boutiques' },
                { name: 'Our Legacy', pricePoint: '$100-180', why: 'Swedish design, unique cuts', availability: 'Select stores' }
            ]
        },
        {
            tier: 'mid',
            label: 'Mid-Range',
            priceRange: '$30 - $80',
            brands: [
                { name: 'Uniqlo U', pricePoint: '$30-50', why: 'Designer collab line, great value', availability: region === 'IN' ? 'Major cities' : 'Global' },
                { name: 'COS', pricePoint: '$60-90', why: 'Minimalist European design', availability: 'H&M Group stores' },
                { name: 'Everlane', pricePoint: '$40-70', why: 'Transparent pricing, quality basics', availability: 'Online mainly' }
            ]
        },
        {
            tier: 'budget',
            label: 'Budget-Friendly',
            priceRange: 'Under $30',
            brands: [
                { name: 'Uniqlo', pricePoint: '$15-30', why: 'Reliable basics, good fit', availability: 'Global' },
                { name: 'H&M Essentials', pricePoint: '$10-25', why: 'Trend-friendly basics', availability: 'Worldwide' }
            ]
        }
    ];
}

    private getOuterwearBrands(region: string): BrandTier[] {
    return [
        {
            tier: 'luxury',
            label: 'Luxury Outerwear',
            priceRange: '$500 - $2,000+',
            brands: [
                { name: 'Arc'teryx Veilance', pricePoint: '$800 - 1, 500', why: 'Technical excellence meets minimalist design', availability: 'Specialty outdoor/ fashion stores' },
                    { name: 'Canada Goose', pricePoint: '$900-1,700', why: 'Extreme weather protection, status symbol', availability: 'Luxury retailers' }
            ]
        },
        {
            tier: 'premium',
            label: 'Premium Outerwear',
            priceRange: '$200 - $500',
            brands: [
                { name: 'Patagonia', pricePoint: '$200-400', why: 'Sustainability leader, lifetime quality', availability: 'Outdoor retailers' },
                { name: 'Carhartt WIP', pricePoint: '$150-300', why: 'Workwear heritage, streetwear cache', availability: 'Contemporary stores' },
                { name: 'The North Face Purple Label', pricePoint: '$300-500', why: 'Japanese quality, refined outdoors', availability: 'Select boutiques' }
            ]
        },
        {
            tier: 'mid',
            label: 'Mid-Range',
            priceRange: '$80 - $200',
            brands: [
                { name: 'Uniqlo Ultra Light Down', pricePoint: '$80-120', why: 'Packable, warm, affordable', availability: 'Uniqlo stores' },
                { name: 'Alpha Industries', pricePoint: '$100-180', why: 'Military heritage, bomber jackets', availability: 'Military surplus/fashion stores' }
            ]
        },
        {
            tier: 'budget',
            label: 'Budget Options',
            priceRange: 'Under $80',
            brands: [
                { name: 'Decathlon Quechua', pricePoint: '$40-70', why: 'Functional, good warmth-to-price ratio', availability: 'Decathlon stores' },
                { name: 'H&M Divided', pricePoint: '$30-60', why: 'Trend-focused, accessible', availability: 'Global' }
            ]
        }
    ];
}

    private getGenericFashionBrands(region: string): BrandTier[] {
    return [
        {
            tier: 'luxury',
            label: 'Luxury Fashion',
            priceRange: '$300 - $1,000+',
            brands: [
                { name: 'Prada', pricePoint: '$500-2,000', why: 'Italian heritage, timeless designs', availability: 'Luxury boutiques' },
                { name: 'Saint Laurent', pricePoint: '$600-1,500', why: 'Rock \'n\' roll elegance', availability: 'High-end stores' }
            ]
        },
        {
            tier: 'premium',
            label: 'Contemporary Fashion',
            priceRange'$150 - $300',
            brands: [
                { name: 'A.P.C.', pricePoint: '$150-300', why: 'French minimalism, quality materials', availability: 'Fashion retailers' },
                { name: 'COS', pricePoint: '$80-200', why: 'Scandinavian design, accessible luxury', availability: 'H&M Group stores' }
            ]
        },
        {
            tier: 'mid',
            label: 'Mid-Range Brands',
            priceRange: '$50 - $150',
            brands: [
                { name: 'Zara', pricePoint: '$40-120', why: 'Fast fashion trends, decent quality', availability: 'Global' },
                { name: 'Uniqlo', pricePoint: '$20-80', why: 'Japanese quality basics', availability: region === 'IN' ? 'Major cities' : 'Global' }
            ]
        },
        {
            tier: 'budget',
            label: 'Budget Fashion',
            priceRange: 'Under $50',
            brands: [
                { name: 'H&M', pricePoint: '$10-50', why: 'Trendy, accessible', availability: 'Worldwide' },
                { name: 'Forever 21', pricePoint: '$10-40', why: 'Ultra-fast fashion', availability: region === 'IN' ? 'Major cities' : 'Global' }
            ]
        }
    ];
}

/**
 * Generate realistic investment strategy
 */
getInvestmentStrategy(query: string, monthlyBudget: number = 200): InvestmentStrategy {
    const queryLower = query.toLowerCase();

    // Determine if this is a capsule wardrobe build or specific item
    const isSpecificItem = queryLower.includes('shoe') || queryLower.includes('jeans') || queryLower.includes('jacket');

    if (isSpecificItem) {
        return this.get SpecificItemStrategy(query, monthlyBudget);
    } else {
        return this.getCapsuleWardrobeStrategy(monthlyBudget);
    }
}

    private getSpecificItemStrategy(item: string, budget: number): InvestmentStrategy {
    return {
        budget: `$${budget}/month`,
        allocation: [
            {
                category: '1x Premium Quality',
                amount: `$${Math.round(budget * 0.6)}`,
                recommendation: `Invest in ONE well-made piece that will last 5+ years. Go for mid-to-premium tier.`
            },
            {
                category: '1-2x Rotating Basics',
                amount: `$${Math.round(budget * 0.4)}`,
                recommendation: `Budget-friendly options for variety and trend experiments.`
            }
        ],
        totalItems: 2,
        reasoning: `Quality over quantity. ${Math.round(budget * 0.6)}% on one investment piece that won't need replacing, ${Math.round(budget * 0.4)}% on affordable rotation items.`
    };
}

    private getCapsuleWardrobeStrategy(budget: number): InvestmentStrategy {
    return {
        budget: `$${budget}/month over 6 months`,
        allocation: [
            {
                category: 'Month 1-2: Foundation (Basics)',
                amount: `$${budget * 2}`,
                recommendation: `2-3 quality basics: white tee, dark jeans, versatile shoes. Prioritize fit and neutrals.`
            },
            {
                category: 'Month 3-4: Layering & Outerwear',
                amount: `$${budget * 2}`,
                recommendation: `1 good jacket/coat + 1-2 layering pieces. This is where you invest more per item.`
            },
            {
                category: 'Month 5-6: Accent & Trend Pieces',
                amount: `$${budget * 2}`,
                recommendation: `Statement pieces and trend experiments. Mix high-low here - save on trends, splurge on timeless accents.`
            }
        ],
        totalItems: 12,
        reasoning: `Build systematically: foundations first (40%), then layering (35%), finally style pieces (25%). This creates a functional wardrobe where everything works together.`
    };
}
}

export default new BrandRecommendationService();

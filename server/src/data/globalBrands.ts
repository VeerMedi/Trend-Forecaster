/**
 * Global Fashion Brand Database
 * Major international brands by category for keyword matching
 */

export interface GlobalBrand {
    name: string;
    category: string[];  // Match against search keywords
    tier: 'Luxury' | 'Premium' | 'Mass Market' | 'Budget';
    priceRange: { usd: string; inr: string };
    regions: string[];  // Where they operate
    keywords: string[]; // Search terms that should include this brand
}

export const GLOBAL_BRANDS: GlobalBrand[] = [
    // Athletic/Sportswear - Gym & Activewear
    {
        name: 'Nike',
        category: ['Athletic', 'Sportswear', 'Activewear', 'Sneakers'],
        tier: 'Premium',
        priceRange: { usd: '$50-200', inr: '₹4,000-18,000' },
        regions: ['Global', 'US', 'IN', 'UK', 'DE'],
        keywords: ['gym', 'workout', 'athletic', 'sports', 'running', 'sneakers', 'athleisure', 'fitness', 'activewear']
    },
    {
        name: 'Adidas',
        category: ['Athletic', 'Sportswear', 'Streetwear', 'Sneakers'],
        tier: 'Premium',
        priceRange: { usd: '$40-180', inr: '₹3,500-16,000' },
        regions: ['Global', 'US', 'IN', 'UK', 'DE'],
        keywords: ['gym', 'workout', 'sports', 'running', 'sneakers', 'athleisure', 'streetwear', 'activewear']
    },
    {
        name: 'Puma',
        category: ['Athletic', 'Sportswear', 'Casual'],
        tier: 'Mass Market',
        priceRange: { usd: '$35-120', inr: '₹2,500-10,000' },
        regions: ['Global', 'US', 'IN', 'UK', 'DE'],
        keywords: ['gym', 'sports', 'running', 'casual', 'athleisure', 'activewear']
    },
    {
        name: 'Reebok',
        category: ['Athletic', 'Fitness', 'CrossFit'],
        tier: 'Mass Market',
        priceRange: { usd: '$40-130', inr: '₹3,000-11,000' },
        regions: ['Global', 'US', 'IN', 'UK'],
        keywords: ['gym', 'workout', 'crossfit', 'fitness', 'training', 'activewear']
    },
    {
        name: 'Under Armour',
        category: ['Athletic', 'Performance', 'Training'],
        tier: 'Premium',
        priceRange: { usd: '$45-150', inr: '₹4,000-13,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['gym', 'training', 'performance', 'athletic', 'workout', 'compression']
    },
    {
        name: 'Gymshark',
        category: ['Gymwear', 'Fitness', 'Athleisure'],
        tier: 'Mass Market',
        priceRange: { usd: '$30-80', inr: '₹2,500-7,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['gym', 'workout', 'fitness', 'bodybuilding', 'athleisure', 'activewear']
    },
    {
        name: 'Lululemon',
        category: ['Athleisure', 'Yoga', 'Premium Activewear'],
        tier: 'Premium',
        priceRange: { usd: '$60-150', inr: '₹6,000-15,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['yoga', 'athleisure', 'leggings', 'workout', 'premium', 'activewear']
    },

    // Fast Fashion
    {
        name: 'Zara',
        category: ['Fast Fashion', 'Contemporary', 'Trendy'],
        tier: 'Mass Market',
        priceRange: { usd: '$30-150', inr: '₹2,000-12,000' },
        regions: ['Global', 'US', 'IN', 'UK', 'DE'],
        keywords: ['fashion', 'trendy', 'contemporary', 'casual', 'formal', 'dress']
    },
    {
        name: 'H&M',
        category: ['Fast Fashion', 'Basics', 'Affordable'],
        tier: 'Budget',
        priceRange: { usd: '$15-80', inr: '₹800-6,000' },
        regions: ['Global', 'US', 'IN', 'UK', 'DE'],
        keywords: ['fashion', 'basics', 'casual', 'affordable', 'trendy']
    },
    {
        name: 'Uniqlo',
        category: ['Basics', 'Minimalist', 'Quality Basics'],
        tier: 'Mass Market',
        priceRange: { usd: '$20-100', inr: '₹1,500-8,000' },
        regions: ['Global', 'US', 'UK', 'JP'],
        keywords: ['basics', 'minimalist', 'quality', 'casual', 'essentials', 'quiet luxury']
    },
    {
        name: 'ASOS',
        category: ['Fast Fashion', 'Youth', 'Online'],
        tier: 'Budget',
        priceRange: { usd: '$20-100', inr: '₹1,500-8,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['fashion', 'trendy', 'online', 'youth', 'casual']
    },

    // Denim & Casual
    {
        name: "Levi's",
        category: ['Denim', 'Jeans', 'Casual'],
        tier: 'Mass Market',
        priceRange: { usd: '$50-120', inr: '₹3,500-10,000' },
        regions: ['Global', 'US', 'IN', 'UK'],
        keywords: ['jeans', 'denim', 'casual', 'workwear', 'americana']
    },
    {
        name: 'Gap',
        category: ['Basics', 'Casual', 'American Classic'],
        tier: 'Mass Market',
        priceRange: { usd: '$25-80', inr: '₹2,000-6,500' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['basics', 'casual', 'classic', 'denim', 'american']
    },

    // Luxury/Designer
    {
        name: 'Gucci',
        category: ['Luxury', 'Designer', 'High Fashion'],
        tier: 'Luxury',
        priceRange: { usd: '$500-5000+', inr: '₹50,000-5,00,000+' },
        regions: ['Global', 'US', 'UK', 'IT'],
        keywords: ['luxury', 'designer', 'high fashion', 'quiet luxury', 'investment pieces']
    },
    {
        name: 'Louis Vuitton',
        category: ['Luxury', 'Designer', 'Accessories'],
        tier: 'Luxury',
        priceRange: { usd: '$1000-10000+', inr: '₹80,000-8,00,000+' },
        regions: ['Global', 'US', 'UK', 'FR'],
        keywords: ['luxury', 'designer', 'bags', 'accessories', 'investment']
    },
    {
        name: 'Prada',
        category: ['Luxury', 'Designer', 'Italian Fashion'],
        tier: 'Luxury',
        priceRange: { usd: '$400-4000+', inr: '₹40,000-4,00,000+' },
        regions: ['Global', 'US', 'UK', 'IT'],
        keywords: ['luxury', 'designer', 'quiet luxury', 'minimalist', 'italian']
    },
    {
        name: 'Balenciaga',
        category: ['Luxury', 'Streetwear', 'Avant-garde'],
        tier: 'Luxury',
        priceRange: { usd: '$400-3000+', inr: '₹35,000-3,00,000+' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['luxury', 'streetwear', 'designer', 'sneakers', 'oversized']
    },

    // Premium Contemporary
    {
        name: 'COS',
        category: ['Minimalist', 'Contemporary', 'Premium Basics'],
        tier: 'Premium',
        priceRange: { usd: '$60-200', inr: '₹5,000-18,000' },
        regions: ['Global', 'US', 'UK', 'DE'],
        keywords: ['minimalist', 'quiet luxury', 'contemporary', 'scandinavian', 'basics']
    },
    {
        name: '& Other Stories',
        category: ['Contemporary', 'Premium', 'Feminine'],
        tier: 'Premium',
        priceRange: { usd: '$50-180', inr: '₹4,000-15,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['contemporary', 'feminine', 'premium', 'european', 'trendy']
    },
    {
        name: 'Arket',
        category: ['Sustainable', 'Minimalist', 'Premium'],
        tier: 'Premium',
        priceRange: { usd: '$50-200', inr: '₹4,500-18,000' },
        regions: ['Global', 'UK', 'DE'],
        keywords: ['sustainable', 'minimalist', 'quality', 'capsule wardrobe', 'basics']
    },

    // Indian Athletic Brands
    {
        name: 'HRX by Hrithik Roshan',
        category: ['Athletic', 'Athleisure', 'Indian'],
        tier: 'Mass Market',
        priceRange: { usd: '$10-50', inr: '₹800-4,000' },
        regions: ['IN'],
        keywords: ['gym', 'workout', 'athleisure', 'fitness', 'activewear', 'indian']
    },
    {
        name: 'Alcis Sports',
        category: ['Athletic', 'Sportswear', 'Indian'],
        tier: 'Mass Market',
        priceRange: { usd: '$12-60', inr: '₹1,000-5,000' },
        regions: ['IN'],
        keywords: ['sports', 'activewear', 'gym', 'indian', 'affordable']
    },
    {
        name: 'Decathlon',
        category: ['Sports', 'Affordable', 'Multi-sport'],
        tier: 'Budget',
        priceRange: { usd: '$10-80', inr: '₹500-6,000' },
        regions: ['Global', 'IN', 'UK', 'FR'],
        keywords: ['sports', 'affordable', 'gym', 'outdoor', 'beginner', 'activewear']
    },

    // Streetwear
    {
        name: 'Stüssy',
        category: ['Streetwear', 'Surf', 'Skate'],
        tier: 'Premium',
        priceRange: { usd: '$50-200', inr: '₹4,500-18,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['streetwear', 'surf', 'skate', 'casual', 'vintage']
    },
    {
        name: 'Supreme',
        category: ['Streetwear', 'Hype', 'Limited Edition'],
        tier: 'Premium',
        priceRange: { usd: '$50-500+', inr: '₹5,000-50,000+' },
        regions: ['Global', 'US', 'UK', 'JP'],
        keywords: ['streetwear', 'hype', 'limited', 'skate', 'drops']
    },

    // Outdoor/Workwear
    {
        name: 'The North Face',
        category: ['Outdoor', 'Technical', 'Streetwear'],
        tier: 'Premium',
        priceRange: { usd: '$60-400', inr: '₹5,000-35,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['outdoor', 'hiking', 'jacket', 'gorpcore', 'technical']
    },
    {
        name: 'Patagonia',
        category: ['Outdoor', 'Sustainable', 'Premium'],
        tier: 'Premium',
        priceRange: { usd: '$80-500', inr: '₹7,000-45,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['outdoor', 'sustainable', 'hiking', 'eco', 'fleece']
    },
    {
        name: 'Carhartt',
        category: ['Workwear', 'Streetwear', 'Durable'],
        tier: 'Mass Market',
        priceRange: { usd: '$40-150', inr: '₹3,500-13,000' },
        regions: ['Global', 'US', 'UK'],
        keywords: ['workwear', 'durable', 'streetwear', 'utility', 'jacket']
    }
];

/**
 * Get relevant global brands based on search keywords and region
 */
export function getRelevantGlobalBrands(
    searchTerm: string,
    region: string = 'global',
    limit: number = 8
): GlobalBrand[] {
    const searchLower = searchTerm.toLowerCase();
    const regionUpper = region.toUpperCase();

    const scored = GLOBAL_BRANDS.map(brand => {
        let score = 0;

        // Check if brand operates in this region
        const regionMatch = brand.regions.includes('Global') ||
            brand.regions.includes(regionUpper) ||
            (regionUpper === 'GLOBAL');

        if (!regionMatch) {
            return { brand, score: -1 }; // Exclude if not in region
        }

        // Keyword matching (highest priority)
        brand.keywords.forEach(keyword => {
            if (searchLower.includes(keyword)) {
                score += 5; // Strong match
            }
        });

        // Category matching
        brand.category.forEach(cat => {
            if (searchLower.includes(cat.toLowerCase())) {
                score += 3;
            }
        });

        // Brand name mentioned directly
        if (searchLower.includes(brand.name.toLowerCase())) {
            score += 10; // Direct mention
        }

        // Boost popular brands slightly for better coverage
        if (['Nike', 'Adidas', 'Zara', 'H&M'].includes(brand.name)) {
            score += 1;
        }

        // Indian brands boost for India region
        if (regionUpper === 'IN' && brand.regions.includes('IN') && !brand.regions.includes('Global')) {
            score += 3;
        }

        return { brand, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.brand);
}

/**
 * Get brand price info for a specific region
 */
export function getBrandPriceForRegion(brand: GlobalBrand, region: string): string {
    return region.toUpperCase() === 'IN' ? brand.priceRange.inr : brand.priceRange.usd;
}

export default { GLOBAL_BRANDS, getRelevantGlobalBrands, getBrandPriceForRegion };

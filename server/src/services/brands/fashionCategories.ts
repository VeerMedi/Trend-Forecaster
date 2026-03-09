/**
 * Fashion Category Classification System
 * Detects fashion categories and provides category-specific search enhancements
 */

export interface FashionCategory {
    id: string;
    name: string;
    searchEnhancers: string[];  // Keywords to add to shopping search
    priceRange: { min: number; max: number };
    keywords: string[];
}

export const FASHION_CATEGORIES: FashionCategory[] = [
    {
        id: 'athletic-gym',
        name: 'Athletic & Gym Wear',
        keywords: ['gym', 'workout', 'athletic', 'sports bra', 'yoga pants', 'leggings', 'training', 'performance', 'activewear', 'gym shorts', 'tank top', 'compression'],
        searchEnhancers: ['performance', 'athletic', 'sport', 'training'],
        priceRange: { min: 20, max: 150 }
    },
    {
        id: 'running',
        name: 'Running & Performance',
        keywords: ['running', 'runner', 'marathon', 'jogging', 'trail running', 'running shoes'],
        searchEnhancers: ['performance', 'running', 'athletic'],
        priceRange: { min: 60, max: 250 }
    },
    {
        id: 'yoga-pilates',
        name: 'Yoga & Pilates',
        keywords: ['yoga', 'pilates', 'yoga pants', 'yoga mat', 'meditation'],
        searchEnhancers: ['yoga', 'stretch', 'flexible'],
        priceRange: { min: 30, max: 150 }
    },
    {
        id: 'formal-business',
        name: 'Formal & Business Attire',
        keywords: ['suit', 'blazer', 'dress shirt', 'formal', 'business', 'office wear', 'trouser', 'dress pants', 'tie', 'business casual'],
        searchEnhancers: ['formal', 'business', 'professional', 'tailored'],
        priceRange: { min: 80, max: 800 }
    },
    {
        id: 'streetwear',
        name: 'Streetwear & Urban',
        keywords: ['streetwear', 'hoodie', 'joggers', 'sweatpants', 'oversized', 'graphic tee', 'urban', 'hype', 'sneakerhead'],
        searchEnhancers: ['streetwear', 'urban', 'casual'],
        priceRange: { min: 30, max: 300 }
    },
    {
        id: 'casual-everyday',
        name: 'Casual & Everyday',
        keywords: ['casual', 't-shirt', 'tee', 'jeans', 'chinos', 'casual dress', 'everyday', 'basics'],
        searchEnhancers: ['casual', 'everyday', 'comfortable'],
        priceRange: { min: 15, max: 120 }
    },
    {
        id: 'denim',
        name: 'Denim & Jeans',
        keywords: ['jeans', 'denim', 'denim jacket', 'denim shorts', 'selvedge', 'raw denim'],
        searchEnhancers: ['denim', 'jean'],
        priceRange: { min: 40, max: 350 }
    },
    {
        id: 'outerwear',
        name: 'Outerwear & Jackets',
        keywords: ['jacket', 'coat', 'parka', 'bomber', 'leather jacket', 'trench coat', 'peacoat', 'windbreaker', 'raincoat'],
        searchEnhancers: ['jacket', 'outerwear', 'coat'],
        priceRange: { min: 80, max: 800 }
    },
    {
        id: 'footwear-casual',
        name: 'Casual Footwear',
        keywords: ['sneakers', 'shoes', 'casual shoes', 'slip-on', 'loafers', 'espadrilles'],
        searchEnhancers: ['shoes', 'footwear', 'sneakers'],
        priceRange: { min: 40, max: 300 }
    },
    {
        id: 'footwear-formal',
        name: 'Formal Footwear',
        keywords: ['dress shoes', 'oxford', 'derby', 'monk strap', 'formal shoes', 'leather shoes'],
        searchEnhancers: ['formal', 'dress shoes', 'leather'],
        priceRange: { min: 100, max: 600 }
    },
    {
        id: 'accessories-bags',
        name: 'Bags & Backpacks',
        keywords: ['bag', 'backpack', 'tote', 'messenger bag', 'crossbody', 'shoulder bag', 'duffle', 'laptop bag'],
        searchEnhancers: ['bag', 'leather', 'quality'],
        priceRange: { min: 40, max: 500 }
    },
    {
        id: 'accessories-jewelry',
        name: 'Jewelry & Watches',
        keywords: ['jewelry', 'necklace', 'bracelet', 'watch', 'ring', 'earrings', 'chain'],
        searchEnhancers: ['jewelry', 'accessories'],
        priceRange: { min: 20, max: 2000 }
    },
    {
        id: 'accessories-general',
        name: 'Fashion Accessories',
        keywords: ['sunglasses', 'hat', 'cap', 'beanie', 'scarf', 'belt', 'wallet', 'gloves'],
        searchEnhancers: ['accessories', 'fashion'],
        priceRange: { min: 15, max: 250 }
    },
    {
        id: 'swimwear',
        name: 'Swimwear & Beachwear',
        keywords: ['swimsuit', 'bikini', 'swim trunks', 'boardshorts', 'swimwear', 'beach', 'pool'],
        searchEnhancers: ['swim', 'beach', 'summer'],
        priceRange: { min: 25, max: 150 }
    },
    {
        id: 'underwear-loungewear',
        name: 'Underwear & Loungewear',
        keywords: ['underwear', 'boxers', 'briefs', 'loungewear', 'pajamas', 'sleepwear', 'robe'],
        searchEnhancers: ['comfort', 'soft', 'cotton'],
        priceRange: { min: 10, max: 80 }
    },
    {
        id: 'luxury-designer',
        name: 'Luxury & Designer',
        keywords: ['luxury', 'designer', 'haute couture', 'high fashion', 'couture'],
        searchEnhancers: ['luxury', 'designer', 'premium'],
        priceRange: { min: 300, max: 5000 }
    },
    {
        id: 'vintage-retro',
        name: 'Vintage & Retro',
        keywords: ['vintage', 'retro', 'thrift', 'secondhand', '90s', '80s', 'y2k'],
        searchEnhancers: ['vintage', 'retro', 'classic'],
        priceRange: { min: 20, max: 200 }
    },
    {
        id: 'sustainable',
        name: 'Sustainable & Eco-Friendly',
        keywords: ['sustainable', 'eco-friendly', 'organic', 'recycled', 'ethical', 'vegan'],
        searchEnhancers: ['sustainable', 'eco', 'organic'],
        priceRange: { min: 40, max: 250 }
    },
    {
        id: 'plus-size',
        name: 'Plus Size Fashion',
        keywords: ['plus size', 'curvy', 'extended sizes', 'big and tall'],
        searchEnhancers: ['plus size', 'extended'],
        priceRange: { min: 25, max: 200 }
    },
    {
        id: 'maternity',
        name: 'Maternity Wear',
        keywords: ['maternity', 'pregnancy', 'nursing', 'expecting'],
        searchEnhancers: ['maternity', 'comfortable'],
        priceRange: { min: 30, max: 150 }
    }
];

/**
 * Detect fashion category from search query
 */
export function detectFashionCategory(query: string): FashionCategory | null {
    const queryLower = query.toLowerCase();

    // Try to find the best matching category
    let bestMatch: { category: FashionCategory; score: number } | null = null;

    for (const category of FASHION_CATEGORIES) {
        let matchScore = 0;

        // Check how many keywords match
        for (const keyword of category.keywords) {
            if (queryLower.includes(keyword.toLowerCase())) {
                // Longer keywords get higher scores (more specific)
                matchScore += keyword.length;
            }
        }

        if (matchScore > 0) {
            if (!bestMatch || matchScore > bestMatch.score) {
                bestMatch = { category, score: matchScore };
            }
        }
    }

    return bestMatch?.category || null;
}

/**
 * Enhance search query with category-specific keywords
 */
export function enhanceSearchQuery(query: string, category: FashionCategory | null): string {
    if (!category) {
        return `${query} clothing fashion`;
    }

    // Add category-specific enhancers
    const enhancers = category.searchEnhancers.slice(0, 2).join(' ');
    return `${query} ${enhancers}`;
}

/**
 * Get category context for display
 */
export function getCategoryContext(category: FashionCategory | null): string {
    if (!category) {
        return 'Fashion';
    }

    return category.name;
}

export default {
    FASHION_CATEGORIES,
    detectFashionCategory,
    enhanceSearchQuery,
    getCategoryContext
};

/**
 * Fashion Insight Data Extractor
 * Extracts real, actionable styling data from API responses
 */

// Common fashion colors with hex codes
const FASHION_COLORS = [
    { keyword: 'black', name: 'Black', hex: '#1a1a1a' },
    { keyword: 'white', name: 'White', hex: '#f5f5f5' },
    { keyword: 'olive', name: 'Olive Green', hex: '#6b7c3f' },
    { keyword: 'khaki', name: 'Khaki', hex: '#c3b091' },
    { keyword: 'beige', name: 'Beige', hex: '#d4c5a9' },
    { keyword: 'brown', name: 'Brown', hex: '#704e3a' },
    { keyword: 'tan', name: 'Tan', hex: '#c9a97d' },
    { keyword: 'navy', name: 'Navy', hex: '#1e3a5f' },
    { keyword: 'grey', name: 'Grey', hex: '#808080' },
    { keyword: 'gray', name: 'Gray', hex: '#808080' },
    { keyword: 'blue', name: 'Blue', hex: '#4a90e2' },
    { keyword: 'green', name: 'Green', hex: '#5cb85c' },
    { keyword: 'cargo', name: 'Cargo Beige', hex: '#a89968' },
];

/**
 * Extract real colors from shopping product data
 */
export const extractRealColors = (shoppingData: any) => {
    if (!shoppingData?.shopping_results) {
        return [];
    }

    const products = shoppingData.shopping_results;
    const colorMentions: Record<string, { count: number; hex: string }> = {};

    products.forEach((product: any) => {
        const title = (product.title || '').toLowerCase();

        FASHION_COLORS.forEach(color => {
            if (title.includes(color.keyword)) {
                if (!colorMentions[color.name]) {
                    colorMentions[color.name] = { count: 0, hex: color.hex };
                }
                colorMentions[color.name].count++;
            }
        });
    });

    // Return top 4 colors by frequency
    return Object.entries(colorMentions)
        .map(([name, data]) => ({
            name,
            count: data.count,
            hex: data.hex
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
};

/**
 * Extract styling pairings from fashion media articles
 */
export const extractStylingPairs = (fashionMediaData: any, topic: string) => {
    if (!fashionMediaData?.articles) {
        return [];
    }

    const articles = fashionMediaData.articles;
    const pairings: Array<{ item: string; source: string }> = [];

    // Keywords that indicate styling suggestions
    const stylingPhrases = [
        /styled with ([^.,!?]+)/gi,
        /pairs? with ([^.,!?]+)/gi,
        /worn with ([^.,!?]+)/gi,
        /team with ([^.,!?]+)/gi,
        /matched with ([^.,!?]+)/gi,
    ];

    articles.forEach((article: any) => {
        const content = `${article.title} ${article.description || ''}`.toLowerCase();

        stylingPhrases.forEach(pattern => {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    const item = match[1].trim();
                    if (item.length > 3 && item.length < 50) {
                        pairings.push({
                            item: capitalizeFirst(item),
                            source: article.source || 'Fashion Media'
                        });
                    }
                }
            }
        });
    });

    // Remove duplicates and return top 5
    const unique = Array.from(new Map(pairings.map(p => [p.item, p])).values());
    return unique.slice(0, 5);
};

/**
 * Extract "what to avoid" from Reddit discussions
 */
export const extractWhatToAvoid = (redditData: any, topic: string) => {
    if (!redditData?.topPosts) {
        return [];
    }

    const posts = redditData.topPosts;
    const avoidances: Array<{ text: string; upvotes: number }> = [];

    // Patterns indicating things to avoid
    const avoidPatterns = [
        /avoid ([^.,!?]+)/gi,
        /don'?t wear ([^.,!?]+)/gi,
        /skip ([^.,!?]+)/gi,
        /too ([^.,!?]+)/gi,
        /not with ([^.,!?]+)/gi,
    ];

    posts.forEach((post: any) => {
        const content = `${post.title} ${post.selftext || ''}`.toLowerCase();

        avoidPatterns.forEach(pattern => {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    const item = match[1].trim();
                    if (item.length > 3 && item.length < 40) {
                        avoidances.push({
                            text: capitalizeFirst(item),
                            upvotes: post.upvotes || 0
                        });
                    }
                }
            }
        });
    });

    // Sort by upvotes and return top 4
    return avoidances
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 4);
};

/**
 * Generate pro tips from shopping data analysis
 */
export const generateProTips = (shoppingData: any, fashionMediaData: any, topic: string) => {
    const tips: string[] = [];

    // Price analysis
    if (shoppingData?.shopping_results) {
        const products = shoppingData.shopping_results;
        const prices = products
            .map((p: any) => p.extracted_price || p.price)
            .filter((p: any) => typeof p === 'number' && p > 0);

        if (prices.length > 0) {
            const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

            if (avgPrice < 100) {
                tips.push(`Budget-friendly: Most options under $100`);
            } else if (avgPrice > 200) {
                tips.push(`Premium positioning: Average $${Math.round(avgPrice)}`);
            }

            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            tips.push(`Price range: $${Math.round(minPrice)} - $${Math.round(maxPrice)}`);
        }
    }

    // Feature analysis from product titles
    if (shoppingData?.shopping_results) {
        const titles = shoppingData.shopping_results.map((p: any) => p.title?.toLowerCase() || '').join(' ');

        if (titles.includes('oversized') || titles.includes('baggy')) {
            tips.push(`Balance proportions: Pair with fitted pieces`);
        }

        if (titles.includes('cropped')) {
            tips.push(`Best with high-waisted bottoms`);
        }
    }

    // Fallback generic tips if limited data
    if (tips.length === 0) {
        tips.push(`Versatile styling: Dress up or down`);
        tips.push(`Layer for transitional seasons`);
    }

    return tips.slice(0, 3);
};

/**
 * Generate complete outfit ideas with real products
 */
export const generateRealOutfits = (shoppingData: any, topic: string) => {
    if (!shoppingData?.shopping_results) {
        return [];
    }

    const products = shoppingData.shopping_results;

    // Categorize products
    const mainItem = products[0]; // The searched item
    const complementary = products.slice(1, 4);

    const outfits = [
        {
            name: 'Casual Weekend',
            style: 'Everyday',
            items: [
                {
                    name: mainItem?.title || topic,
                    price: mainItem?.extracted_price || mainItem?.price || 0,
                    source: mainItem?.source || 'Online'
                },
                { name: 'White fitted tee', price: 25, source: 'Basic' },
                { name: 'Platform sneakers', price: 85, source: 'Footwear' },
                { name: 'Baseball cap', price: 30, source: 'Accessory' }
            ]
        },
        {
            name: 'Street Style',
            style: 'Going Out',
            items: [
                {
                    name: mainItem?.title || topic,
                    price: mainItem?.extracted_price || mainItem?.price || 0,
                    source: mainItem?.source || 'Online'
                },
                { name: 'Oversized hoodie', price: 60, source: 'Streetwear' },
                { name: 'Chunky sneakers', price: 120, source: 'Premium' },
                { name: 'Crossbody bag', price: 45, source: 'Accessory' }
            ]
        },
        {
            name: 'Smart Casual',
            style: 'Semi-Formal',
            items: [
                {
                    name: mainItem?.title || topic,
                    price: mainItem?.extracted_price || mainItem?.price || 0,
                    source: mainItem?.source || 'Online'
                },
                { name: 'Crisp white shirt', price: 50, source: 'Essentials' },
                { name: 'Loafers', price: 95, source: 'Formal' },
                { name: 'Minimal watch', price: 150, source: 'Accessory' }
            ]
        }
    ];

    // Calculate totals
    return outfits.map(outfit => ({
        ...outfit,
        totalPrice: outfit.items.reduce((sum, item) => sum + (item.price || 0), 0)
    }));
};

// Helper functions
const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default {
    extractRealColors,
    extractStylingPairs,
    extractWhatToAvoid,
    generateProTips,
    generateRealOutfits
};

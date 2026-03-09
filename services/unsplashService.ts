// Unsplash Image Service for Fashion Trend Images
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';

interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string | null;
    description: string | null;
    user: {
        name: string;
    };
}

interface UnsplashResponse {
    results: UnsplashImage[];
    total: number;
}

// Cache to avoid repeated API calls
const imageCache: Map<string, string> = new Map();

// Fashion-specific search queries mapping
const fashionSearchQueries: Record<string, string[]> = {
    sustainable: ['sustainable fashion', 'eco fashion clothing', 'organic fabric fashion'],
    luxury: ['luxury fashion runway', 'haute couture', 'designer fashion'],
    minimalist: ['minimalist fashion', 'clean aesthetic clothing', 'simple elegant fashion'],
    streetwear: ['streetwear fashion', 'urban fashion style', 'street style outfit'],
    vintage: ['vintage fashion', 'retro clothing style', 'classic fashion'],
    bohemian: ['bohemian fashion', 'boho style clothing', 'free spirit fashion'],
    athletic: ['athleisure fashion', 'sporty chic outfit', 'athletic wear fashion'],
    default: ['fashion editorial', 'fashion model runway', 'designer clothing'],
};

// Generate optimized search query for fashion trends
export const generateFashionQuery = (trend: string): string => {
    const trendLower = trend.toLowerCase();

    // Check for specific fashion categories
    for (const [key, queries] of Object.entries(fashionSearchQueries)) {
        if (key !== 'default' && trendLower.includes(key)) {
            return queries[Math.floor(Math.random() * queries.length)];
        }
    }

    // Build custom query from trend
    const cleanTrend = trend
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .slice(0, 3)
        .join(' ');

    return `${cleanTrend} fashion clothing`;
};

// Fetch image from Unsplash API
export const fetchUnsplashImage = async (query: string): Promise<string | null> => {
    // Check cache first
    if (imageCache.has(query)) {
        return imageCache.get(query) || null;
    }

    if (!UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash API key not configured');
        return null;
    }

    try {
        const searchQuery = encodeURIComponent(query);
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=5&orientation=portrait`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (!response.ok) {
            console.error('Unsplash API error:', response.status);
            return null;
        }

        const data: UnsplashResponse = await response.json();

        if (data.results && data.results.length > 0) {
            // Get random image from results for variety
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 3));
            const imageUrl = data.results[randomIndex].urls.regular;

            // Cache the result
            imageCache.set(query, imageUrl);

            return imageUrl;
        }

        return null;
    } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        return null;
    }
};

// Get fashion image for a trend with index for variety
export const getFashionImage = async (trend: string, index: number = 0): Promise<string> => {
    const baseQuery = generateFashionQuery(trend);

    // Add index to cache key to get different results
    const cacheKey = `${baseQuery}_${index}`;

    // Check cache first
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey) || '';
    }

    // Add variety terms based on index
    const varietyTerms = ['editorial', 'runway', 'street style', 'closeup', 'texture', 'detail'];
    const varietyTerm = varietyTerms[index % varietyTerms.length];
    const query = `${baseQuery} ${varietyTerm}`;

    if (!UNSPLASH_ACCESS_KEY) {
        const seed = (trend.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 123) % 1000;
        return `https://picsum.photos/seed/${seed}/800/1000`;
    }

    try {
        const searchQuery = encodeURIComponent(query);
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=10&orientation=portrait`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (response.ok) {
            const data: UnsplashResponse = await response.json();

            if (data.results && data.results.length > 0) {
                // Use index to select different image from results
                const imageIndex = index % Math.min(data.results.length, 5);
                const imageUrl = data.results[imageIndex].urls.regular;

                // Cache with unique key
                imageCache.set(cacheKey, imageUrl);

                return imageUrl;
            }
        }
    } catch (error) {
        console.error('Error fetching Unsplash image:', error);
    }

    // Fallback to Lorem Picsum with different seeds based on index
    const seed = (trend.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 123) % 1000;
    return `https://picsum.photos/seed/${seed}/800/1000`;
};

// Get hero image for topic
export const getHeroImage = async (topic: string): Promise<string> => {
    const query = `${topic} fashion runway editorial`;
    const imageUrl = await fetchUnsplashImage(query);

    if (imageUrl) {
        return imageUrl;
    }

    // Fallback
    const seed = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
    return `https://picsum.photos/seed/${seed + 500}/1600/900`;
};

export default {
    generateFashionQuery,
    fetchUnsplashImage,
    getFashionImage,
    getHeroImage,
};

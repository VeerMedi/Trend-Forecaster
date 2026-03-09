// Pinterest Visual Intelligence Service (via Backend API)
// Provides photos and videos for Visual Intelligence tab

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface VisualPhoto {
    id: string;
    url: string;
    photographer: string;
    photographerUrl: string;
    alt: string;
}

export interface VisualVideo {
    id: string;
    videoUrl: string;
    thumbnail: string;
    photographer: string;
    photographerUrl: string;
}

export interface VisualContent {
    photos: VisualPhoto[];
    videos: VisualVideo[];
    totalPhotos: number;
    totalVideos: number;
}

// Visual content cache to prevent duplicate API calls
const visualCache: Map<string, { data: VisualContent; timestamp: number }> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get visual content (photos and videos) from Pinterest via backend API
 */
export const getVisualContent = async (topic: string): Promise<VisualContent> => {
    const cacheKey = topic.toLowerCase().trim();
    const cached = visualCache.get(cacheKey);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('📦 Visual content cache HIT for:', topic);
        return cached.data;
    }

    console.log('🔍 Visual content cache MISS - fetching for:', topic);

    try {
        const response = await fetch(`${API_URL}/visual/${encodeURIComponent(topic)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch visual content: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch visual content');
        }

        // Cache the result
        visualCache.set(cacheKey, { data: result.data, timestamp: now });

        return result.data;
    } catch (error) {
        console.error('Error fetching Pinterest visual content:', error);
        // Return empty arrays instead of throwing to prevent UI breaks
        return { photos: [], videos: [], totalPhotos: 0, totalVideos: 0 };
    }
};

// Clear old cache entries periodically
if (typeof window !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of visualCache.entries()) {
            if (now - value.timestamp > CACHE_DURATION) {
                visualCache.delete(key);
            }
        }
    }, 60 * 1000); // Clean up every minute
}

export default {
    getVisualContent
};

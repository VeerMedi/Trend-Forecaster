import axios from 'axios';

interface PexelsPhoto {
    id: number;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
    alt: string;
    photographer: string;
}

interface PexelsVideo {
    id: number;
    image: string;
    duration: number;
    video_files: Array<{
        id: number;
        quality: string;
        file_type: string;
        width: number;
        height: number;
        link: string;
    }>;
    video_pictures: Array<{
        id: number;
        picture: string;
        nr: number;
    }>;
    user: {
        name: string;
    };
}

interface PexelsPhotoResponse {
    photos: PexelsPhoto[];
    total_results: number;
    page: number;
    per_page: number;
}

interface PexelsVideoResponse {
    videos: PexelsVideo[];
    total_results: number;
    page: number;
    per_page: number;
}

/**
 * Pexels API Service for Visual Intelligence
 * Provides photos and videos for fashion trend visualization
 */
class PexelsService {
    private apiKey: string;
    private baseUrl = 'https://api.pexels.com/v1';
    private videoUrl = 'https://api.pexels.com/videos';

    constructor() {
        this.apiKey = process.env.PEXELS_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  PEXELS_API_KEY not set. Visual content will use fallback.');
        }
    }

    /**
     * Search for fashion photos
     */
    async searchPhotos(query: string, perPage: number = 15): Promise<PexelsPhoto[]> {
        if (!this.apiKey) {
            console.log('📷 No Pexels API key - using fallback');
            return this.getFallbackPhotos(query, perPage);
        }

        try {
            console.log(`🔍 Fetching Pexels photos for: ${query}`);

            const response = await axios.get<PexelsPhotoResponse>(`${this.baseUrl}/search`, {
                params: {
                    query: `${query} fashion clothing style`,
                    per_page: perPage,
                    orientation: 'portrait',
                },
                headers: {
                    Authorization: this.apiKey,
                },
                timeout: 10000,
            });

            if (response.data.photos && response.data.photos.length > 0) {
                console.log(`✅ Found ${response.data.photos.length} Pexels photos`);
                return response.data.photos;
            }

            return this.getFallbackPhotos(query, perPage);
        } catch (error: any) {
            console.error('❌ Pexels photo error:', error.message);
            return this.getFallbackPhotos(query, perPage);
        }
    }

    /**
     * Search for fashion videos
     */
    async searchVideos(query: string, perPage: number = 6): Promise<PexelsVideo[]> {
        if (!this.apiKey) {
            console.log('🎥 No Pexels API key - using fallback');
            return [];
        }

        try {
            console.log(`🔍 Fetching Pexels videos for: ${query}`);

            const response = await axios.get<PexelsVideoResponse>(`${this.videoUrl}/search`, {
                params: {
                    query: `${query} fashion style`,
                    per_page: perPage,
                    orientation: 'portrait',
                },
                headers: {
                    Authorization: this.apiKey,
                },
                timeout: 10000,
            });

            if (response.data.videos && response.data.videos.length > 0) {
                console.log(`✅ Found ${response.data.videos.length} Pexels videos`);
                return response.data.videos;
            }

            return [];
        } catch (error: any) {
            console.error('❌ Pexels video error:', error.message);
            return [];
        }
    }

    /**
     * Get visual intelligence data: photos + videos
     */
    async getVisualContent(query: string) {
        const [photos, videos] = await Promise.all([
            this.searchPhotos(query, 12),
            this.searchVideos(query, 6),
        ]);

        return {
            photos: photos.map(photo => ({
                id: photo.id,
                url: photo.src.large,
                thumbnail: photo.src.medium,
                alt: photo.alt || `${query} fashion`,
                photographer: photo.photographer,
                source: 'pexels',
            })),
            videos: videos.map(video => ({
                id: video.id,
                thumbnail: video.image,
                duration: video.duration,
                videoUrl: video.video_files.find(f => f.quality === 'hd')?.link ||
                    video.video_files[0]?.link,
                creator: video.user.name,
                source: 'pexels',
            })),
            totalPhotos: photos.length,
            totalVideos: videos.length,
        };
    }

    /**
     * Fallback photos using Lorem Picsum
     */
    private getFallbackPhotos(query: string, count: number): PexelsPhoto[] {
        const photos: PexelsPhoto[] = [];
        const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        for (let i = 0; i < count; i++) {
            const id = seed + i * 137;
            photos.push({
                id: id,
                src: {
                    original: `https://picsum.photos/seed/${id}/1200/1600`,
                    large2x: `https://picsum.photos/seed/${id}/1200/1600`,
                    large: `https://picsum.photos/seed/${id}/800/1000`,
                    medium: `https://picsum.photos/seed/${id}/600/800`,
                    small: `https://picsum.photos/seed/${id}/400/600`,
                    portrait: `https://picsum.photos/seed/${id}/800/1000`,
                    landscape: `https://picsum.photos/seed/${id}/1000/600`,
                    tiny: `https://picsum.photos/seed/${id}/200/300`,
                },
                alt: `${query} fashion inspiration`,
                photographer: 'Curated Collection',
            });
        }

        return photos;
    }
}

export default new PexelsService();
export { PexelsService };
export type { PexelsPhoto, PexelsVideo };

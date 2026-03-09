import axios from 'axios';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

interface PixabayImage {
    id: number;
    pageURL: string;
    largeImageURL: string;
    webformatURL: string;
    user: string;
    userImageURL: string;
    tags: string;
}

interface PixabayResponse {
    total: number;
    totalHits: number;
    hits: PixabayImage[];
}

/**
 * Pixabay Service for fetching fashion trend images
 */
class PixabayService {
    private apiKey: string;

    constructor() {
        this.apiKey = PIXABAY_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  PIXABAY_API_KEY not set. Image fetching will not be available.');
        }
    }

    /**
     * Search Pixabay for images related to a fashion topic
     * @param query - Search query
     * @param limit - Number of images to fetch (max 200)
     */
    async searchImages(query: string, limit: number = 20): Promise<PixabayImage[]> {
        if (!this.apiKey) {
            console.warn('Pixabay API key not configured, returning empty results');
            return [];
        }

        try {
            console.log(`📸 Fetching Pixabay images for: ${query}`);

            const response = await axios.get<PixabayResponse>(PIXABAY_BASE_URL, {
                params: {
                    key: this.apiKey,
                    q: query,
                    image_type: 'photo',
                    per_page: Math.min(limit, 200),
                    safesearch: 'true',
                    orientation: 'all',
                    category: 'fashion'
                }
            });

            console.log(`✅ Pixabay: Found ${response.data.hits.length} images`);
            return response.data.hits || [];

        } catch (error: any) {
            console.error('❌ Pixabay API error:', error.response?.data || error.message);
            return [];
        }
    }

    /**
     * Get formatted image data for visual board
     */
    async getImages(topic: string, limit: number = 15): Promise<Array<{
        id: string;
        url: string;
        photographer: string;
        photographerUrl: string;
        alt: string;
    }>> {
        try {
            const images = await this.searchImages(`${topic} fashion style`, limit);

            return images.map(img => ({
                id: img.id.toString(),
                url: img.largeImageURL,
                photographer: img.user,
                photographerUrl: img.pageURL,
                alt: img.tags || topic
            }));

        } catch (error: any) {
            console.error('Error fetching images from Pixabay:', error);
            return [];
        }
    }
}

export default new PixabayService();

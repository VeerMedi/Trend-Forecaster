import express, { Request, Response } from 'express';
import pexelsService from '../services/sources/pexelsService';
import pixabayService from '../services/sources/pixabayService';

const router = express.Router();

/**
 * GET /api/visual/:topic
 * Get visual content (images from Pixabay + videos from Pexels) for a trend topic
 */
router.get('/:topic', async (req: Request, res: Response) => {
    try {
        const { topic } = req.params;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic parameter is required'
            });
        }

        const topicStr = Array.isArray(topic) ? topic[0] : topic;
        console.log('[Visual API] Fetching visual content for:', topicStr);

        // Enhanced search terms for better fashion relevance
        const enhancedSearchTerms = `${topicStr} fashion outfit style clothing apparel`;

        // Fetch images and videos in parallel
        const [pixabayPhotos, pexelsData] = await Promise.all([
            pixabayService.getImages(enhancedSearchTerms),
            pexelsService.getVisualContent(topicStr)
        ]);

        // Combine photos from both sources
        const allPhotos = [
            ...pixabayPhotos,
            ...(pexelsData.photos || [])
        ];

        // Fashion-related keywords for relevance scoring
        const fashionKeywords = [
            topicStr.toLowerCase(),
            'fashion', 'style', 'clothing', 'wear', 'outfit', 'apparel',
            'dress', 'shirt', 'pants', 'shoes', 'accessories', 'trend'
        ];

        // Score and filter photos by relevance
        const scoredPhotos = allPhotos.map(photo => {
            const altText = (photo.alt || photo.photographer || '').toLowerCase();

            // Calculate relevance score
            let score = 0;
            fashionKeywords.forEach(keyword => {
                if (altText.includes(keyword)) {
                    score += keyword === topicStr.toLowerCase() ? 3 : 1;
                }
            });

            return { ...photo, relevanceScore: score };
        });

        // Sort by relevance and take top 12
        const relevantPhotos = scoredPhotos
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 12)
            .map(({ relevanceScore, ...photo }) => photo);

        console.log(`✅ Visual content ready: ${relevantPhotos.length} photos, ${pexelsData.videos?.length || 0} videos`);

        return res.json({
            success: true,
            data: {
                photos: relevantPhotos,
                videos: pexelsData.videos || [],
                totalPhotos: relevantPhotos.length,
                totalVideos: pexelsData.videos?.length || 0
            }
        });
    } catch (error: any) {
        console.error('[Visual API] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch visual content',
            error: error.message
        });
    }
});

export default router;

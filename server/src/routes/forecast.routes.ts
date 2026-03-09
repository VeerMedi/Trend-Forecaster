import express, { Request, Response } from 'express';
import { GoogleTrendsService } from '../services/sources/googleTrendsService';
import { RedditService } from '../services/sources/redditService';
import { SerpApiService } from '../services/sources/serpApiService';
import { FashionMediaService } from '../services/sources/fashionMediaService';
import { generateTrendForecast } from '../services/forecasting';

const router = express.Router();

// In-memory cache for forecasts (5-minute TTL)
const forecastCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * POST /api/forecast
 * Generate statistical forecast for a trend topic
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { topic, region = 'global' } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic parameter is required'
            });
        }

        console.log(`\n============================================================`);
        console.log(`🔮 FORECAST REQUEST: "${topic}"`);
        console.log(`🌍 Region: ${region}`);
        console.log(`⏰ Started at: ${new Date().toLocaleTimeString()}`);
        console.log(`============================================================\n`);

        // Check cache
        const cacheKey = `${topic}-${region}`.toLowerCase();
        const cached = forecastCache.get(cacheKey);
        const now = Date.now();

        if (cached && (now - cached.timestamp) < CACHE_TTL) {
            console.log(`📦 Cache HIT - Serving cached forecast`);
            return res.json({
                success: true,
                cached: true,
                data: cached.data
            });
        }

        console.log(`🔍 Cache MISS - Generating new forecast`);

        console.log(`📊 Fetching data from 4 sources...`);

        // Instantiate services
        const googleTrends = new GoogleTrendsService();
        const redditService = new RedditService();
        const serpApi = new SerpApiService();
        const fashionMedia = new FashionMediaService();

        const [trendsData, redditData, shoppingData, mediaData] = await Promise.all([
            googleTrends.getTrendData(topic, region as string).catch((err: any) => {
                console.error('Google Trends error:', err.message);
                return null;
            }),
            redditService.searchFashionPosts(topic).catch((err: any) => {
                console.error('Reddit error:', err.message);
                return null;
            }),
            serpApi.getShoppingData(topic, region as string).catch((err: any) => {
                console.error('Shopping error:', err.message);
                return null;
            }),
            fashionMedia.searchArticles(topic).catch((err: any) => {
                console.error('Media error:', err.message);
                return null;
            })
        ]);

        // Generate forecast
        const forecast = await generateTrendForecast(topic, {
            trendsData,
            redditData,
            shoppingData,
            mediaData
        });

        // Cache the result
        forecastCache.set(cacheKey, {
            data: forecast,
            timestamp: now
        });

        console.log(`\n✅ Forecast generated successfully!`);
        console.log(`============================================================\n`);

        return res.json({
            success: true,
            cached: false,
            data: forecast
        });

    } catch (error: any) {
        console.error('❌ Forecast error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate forecast',
            error: error.message
        });
    }
});

/**
 * GET /api/forecast/:topic
 * For MVP, just use POST endpoint
 */
router.get('/:topic', (req: Request, res: Response) => {
    res.status(405).json({
        success: false,
        message: 'Use POST /api/forecast with body: {"topic": "your-topic"}'
    });
});

/**
 * DELETE /api/forecast/cache/:topic
 * Clear cache for specific topic (dev/testing)
 */
router.delete('/cache/:topic', (req: Request, res: Response) => {
    const { topic } = req.params;
    const { region = 'global' } = req.query;

    const cacheKey = `${topic}-${region}`.toLowerCase();
    const existed = forecastCache.delete(cacheKey);

    res.json({
        success: true,
        message: existed ? 'Cache cleared' : 'No cache entry found',
        topic,
        region
    });
});

/**
 * GET /api/forecast/cache/stats
 * Get cache statistics (dev/testing)
 */
router.get('/cache/stats', (_req: Request, res: Response) => {
    res.json({
        success: true,
        stats: {
            entries: forecastCache.size,
            ttl: `${CACHE_TTL / 1000}s`,
            keys: Array.from(forecastCache.keys())
        }
    });
});

export default router;

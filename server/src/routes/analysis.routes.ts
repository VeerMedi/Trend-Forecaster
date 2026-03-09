import express, { Request, Response } from 'express';
import { TrendAnalysisService } from '../services/ai/trendAnalysisService';
import { ForecastingService } from '../services/ai/forecastingService';
import { GoogleTrendsService } from '../services/sources/googleTrendsService';
import { NewsService } from '../services/sources/newsService';
import { SerpApiService } from '../services/sources/serpApiService';
import { RedditService } from '../services/sources/redditService';
import redditSignalService from '../services/sources/redditSignalService';
import { FashionMediaService } from '../services/sources/fashionMediaService';
import metricsCalculator from '../services/ai/metricsCalculator';
import { detectFashionCategory, getCategoryContext } from '../services/brands/fashionCategories';
import { Analysis } from '../models/Analysis';
import { cacheService } from '../services/cache.service';

const router = express.Router();

/**
 * POST /api/analysis
 * Create a new trend analysis with real market data
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { topic, sources, region = 'global' } = req.body;

        // Validate input
        if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        if (!sources || !Array.isArray(sources) || sources.length === 0) {
            return res.status(400).json({ error: 'At least one source must be selected' });
        }

        // 🎯 Start performance tracking
        const requestStart = Date.now();
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🚀 NEW REQUEST: "${topic}"`);
        console.log(`🌍 Region: ${region}`);
        console.log(`⏰ Started at: ${new Date().toLocaleTimeString()}`);
        console.log(`${'='.repeat(60)}\n`);

        // Initialize services
        const trendAnalysisService = new TrendAnalysisService();
        const googleTrendsService = new GoogleTrendsService();
        const newsService = new NewsService();
        const serpApiService = new SerpApiService();
        const redditService = new RedditService();
        const fashionMediaService = new FashionMediaService();

        // 🏷️ Detect fashion category
        const fashionCategory = detectFashionCategory(topic);
        const categoryContext = getCategoryContext(fashionCategory);
        console.log(`🏷️ Fashion Category: ${categoryContext}`);
        if (fashionCategory) {
            console.log(`   Search enhancers: ${fashionCategory.searchEnhancers.join(', ')}`);
        }

        // Check cache first
        console.log('📦 Checking cache...');
        const cacheKey = `analysis:${topic}:${sources.sort().join(',')}`;
        const cachedResult = cacheService.get(cacheKey);

        if (cachedResult) {
            console.log('✅ Cache HIT - Serving instantly');
            console.log(`${'='.repeat(60)}\n`);
            return res.json({
                success: true,
                data: cachedResult,
                cached: true,
                metadata: {
                    timestamp: new Date().toISOString(),
                    sources_used: sources,
                    model: process.env.OPENROUTER_MODEL,
                },
            });
        }
        console.log('❌ Cache MISS - Fetching fresh data...');
        const dataFetchStart = Date.now();

        // ⚡ Fetch ALL data sources in parallel
        const dataPromises: Promise<any>[] = [];

        // Google Trends
        if (sources.includes('web')) {
            console.log('  ⏳ Starting: Google Trends API');
            const trendsStart = Date.now();
            dataPromises.push(
                googleTrendsService.getTrendData(topic)
                    .then(data => {
                        console.log(`  ✓ Google Trends API completed (${Date.now() - trendsStart}ms)`);
                        return { trendsData: data };
                    })
                    .catch(err => {
                        console.log(`  ✗ Google Trends API failed (${Date.now() - trendsStart}ms): ${err.message}`);
                        return { trendsData: null };
                    })
            );
        }

        // News API
        if (sources.includes('news')) {
            console.log('  ⏳ Starting: News API');
            const newsStart = Date.now();
            dataPromises.push(
                newsService.searchNews(topic, { pageSize: 10 })
                    .then(data => {
                        console.log(`  ✓ News API completed (${Date.now() - newsStart}ms)`);
                        return { newsData: data };
                    })
                    .catch(err => {
                        console.log(`  ✗ News API failed (${Date.now() - newsStart}ms): ${err.message}`);
                        return { newsData: null };
                    })
            );
        }

        // Google Shopping (for real price data) - ALWAYS fetch for market intelligence
        console.log('  ⏳ Starting: Shopping API');
        const shoppingStart = Date.now();
        dataPromises.push(
            (async () => {
                try {
                    console.log('📦 Fetching shopping data...');
                    const rawData = await serpApiService.getShoppingData(topic, region, fashionCategory);

                    console.log(`✅ Shopping data: ${rawData?.products?.length || 0} products found`);

                    // Normalize: backend returns 'products', frontend expects 'shopping_results'
                    return {
                        shoppingData: {
                            shopping_results: rawData?.products || [],
                            ...rawData
                        }
                    };
                } catch (error: any) {
                    console.error('❌ Shopping data error:', error.message);
                    return { shoppingData: { shopping_results: [] } };
                }
            })()
        );


        // Community Discussion Signals (via Google Search - Legal & Stable)
        console.log('  ⏳ Starting: Community Signal Extraction');
        const redditStart = Date.now();
        dataPromises.push(
            redditSignalService.fetchCommunitySignal(topic, region)
                .then(signal => {
                    const formatted = redditSignalService.formatForFrontend(signal);
                    console.log(` ✓ Community signals extracted (${Date.now() - redditStart}ms) - ${signal.momentum} momentum (${signal.volume_indicator} indicators)`);
                    return { redditData: formatted };
                })
                .catch(err => {
                    console.log(`  ✗ Community signal extraction failed (${Date.now() - redditStart}ms): ${err.message}`);
                    return { redditData: null };
                })
        );

        // Fashion Media (Real articles from Vogue, WWD, etc.)
        console.log('  ⏳ Starting: Fashion Media RSS');
        const mediaStart = Date.now();
        dataPromises.push(
            fashionMediaService.searchArticles(topic, 8, region)
                .then(data => {
                    console.log(`  ✓ Fashion Media completed (${Date.now() - mediaStart}ms) - ${data.articles.length} articles`);
                    return { fashionMediaData: data };
                })
                .catch(err => {
                    console.log(`  ✗ Fashion Media failed (${Date.now() - mediaStart}ms): ${err.message}`);
                    return { fashionMediaData: null };
                })
        );

        // Wait for all data sources
        const dataResults = await Promise.all(dataPromises);
        const contextData = Object.assign({}, ...dataResults);
        const dataFetchTime = Date.now() - dataFetchStart;
        console.log(`✓ All data sources completed (${Date.now() - dataFetchStart}ms)`);

        // 📊 Calculate REAL metrics from collected data
        console.log('🧮 Calculating real metrics from API data...');
        const calculatedMetrics = metricsCalculator.calculateAllMetrics(
            contextData.trendsData,
            contextData.shoppingData,
            contextData.newsData
        );
        console.log(`✓ Calculated metrics:`, {
            investmentScore: `${calculatedMetrics.investmentScore}/10`,
            confidence: `${calculatedMetrics.confidencePercent}%`,
            growthPotential: `${calculatedMetrics.growthPotential}%`,
            riskLevel: calculatedMetrics.riskLevel,
            maturity: calculatedMetrics.marketMaturity
        });

        // 🤖 Generate AI analysis (with real metrics injected)
        console.log('⏳ Starting: AI Analysis');
        const aiStart = Date.now();

        // Pass trend analysis
        let trendAnalysis = await trendAnalysisService.analyzeTrend(topic, sources, {
            trendsData: contextData.trendsData,
            newsData: contextData.newsData,
            shoppingData: contextData.shoppingData,
        });

        // OVERRIDE AI-generated scores with calculated ones
        trendAnalysis.investmentAnalysis = {
            ...trendAnalysis.investmentAnalysis,
            score: calculatedMetrics.investmentScore,
            confidencePercent: calculatedMetrics.confidencePercent,
            riskLevel: calculatedMetrics.riskLevel,
            recommendation: trendAnalysis.investmentAnalysis?.recommendation || (
                calculatedMetrics.investmentScore >= 8 ? 'Strong Buy' :
                    calculatedMetrics.investmentScore >= 6 ? 'Buy' :
                        calculatedMetrics.investmentScore >= 4 ? 'Hold' : 'Sell'
            ) as 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Avoid',
            reasoning: `[Calculated from ${contextData.shoppingData?.shopping_results?.length || 0} products] ${trendAnalysis.investmentAnalysis?.reasoning || 'Based on market signals'}`
        };

        trendAnalysis.marketTiming = {
            ...trendAnalysis.marketTiming,
            currentPhase: calculatedMetrics.marketMaturity,
            phaseDescription: trendAnalysis.marketTiming?.phaseDescription || `Currently in ${calculatedMetrics.marketMaturity} phase`,
            peakPrediction: trendAnalysis.marketTiming?.peakPrediction || 'Mid 2025',
            entryWindow: trendAnalysis.marketTiming?.entryWindow || 'Next 3-6 months',
            exitSignals: trendAnalysis.marketTiming?.exitSignals || ['Market saturation', 'Declining search interest']
        };

        console.log(`✓ AI Analysis completed (${Date.now() - aiStart}ms)`);
        const aiTime = Date.now() - aiStart;
        const analysisData = trendAnalysis;

        // 🔮 Generate 12-month forecast based on historical trends
        console.log('🔮 Generating forecast...');
        const forecastStart = Date.now();
        const forecastingService = new ForecastingService();

        let forecast = null;
        if (contextData.trendsData?.interest_over_time && contextData.trendsData.interest_over_time.length >= 3) {
            try {
                forecast = await forecastingService.generateForecast(
                    topic,
                    contextData.trendsData.interest_over_time,
                    analysisData.marketTiming?.currentPhase
                );
                console.log(`✅ Forecast complete (${Date.now() - forecastStart}ms)`);
            } catch (error) {
                console.error('❌ Forecast generation failed:', error);
            }
        } else {
            console.log('⚠️  Insufficient historical data for forecasting');
        }

        // Merge forecast into analysis data
        if (forecast) {
            analysisData.forecast = forecast;
        }

        // Cache the result for 1 hour
        cacheService.set(cacheKey, analysisData, 3600000);

        // Save analysis to database (don't wait for it)
        setImmediate(async () => {
            try {
                const analysis = new Analysis({
                    user_id: null,
                    topic,
                    selected_sources: sources,
                    analysis_data: analysisData,
                    ai_model_used: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-nano-30b-a3b:free',
                    confidence_score: 0.85,
                });
                await analysis.save();
                console.log('💾 Analysis saved to database');
            } catch (dbError) {
                console.warn('⚠️  Database save failed:', (dbError as Error).message);
            }
        });

        // Summary
        const totalTime = Date.now() - requestStart;
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🏁 REQUEST COMPLETE (${totalTime}ms total)`);
        console.log(`   Data Fetch: ${dataFetchTime}ms | AI: ${aiTime}ms`);
        console.log(`${'='.repeat(60)}\n`);

        res.json({
            success: true,
            data: {
                ...analysisData,
                // Include raw API data for frontend
                trendsData: contextData.trendsData,
                redditData: contextData.redditData,
                fashionMediaData: contextData.fashionMediaData,
                shoppingData: contextData.shoppingData,
                // Fashion category metadata
                fashionCategory: fashionCategory ? {
                    id: fashionCategory.id,
                    name: fashionCategory.name,
                    priceRange: fashionCategory.priceRange
                } : null,
                region
            },
            cached: false,
            metadata: {
                timestamp: new Date().toISOString(),
                sources_used: sources,
                model: process.env.OPENROUTER_MODEL,
                performance: {
                    data_fetch_ms: dataFetchTime,
                    ai_analysis_ms: aiTime,
                    total_ms: totalTime,
                },
            },
        });
    } catch (error: any) {
        console.log(`\n${'='.repeat(60)}`);
        console.error('❌ REQUEST FAILED:', error.message);
        console.log(`${'='.repeat(60)}\n`);
        res.status(500).json({
            error: 'Failed to create analysis',
            message: error.message,
        });
    }
});

/**
 * GET /api/analysis/history
 * Get analysis history (all recent analyses for now)
 */
router.get('/history', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const analyses = await Analysis.find()
            .sort({ created_at: -1 })
            .limit(limit)
            .select('topic selected_sources created_at confidence_score ai_model_used');

        res.json({
            success: true,
            data: analyses,
            count: analyses.length,
        });
    } catch (error: any) {
        console.error('❌ History fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch analysis history',
            message: error.message,
        });
    }
});

/**
 * GET /api/analysis/:id
 * Get specific analysis by ID (requires auth)
 */
router.get('/:id', async (req: Request, res: Response) => {
    // TODO: Add auth middleware
    res.status(501).json({
        message: 'Analysis retrieval will be available after authentication is implemented',
    });
});

/**
 * DELETE /api/analysis/:id
 * Delete analysis (requires auth)
 */
router.delete('/:id', async (req: Request, res: Response) => {
    // TODO: Add auth middleware
    res.status(501).json({
        message: 'Analysis deletion will be available after authentication is implemented',
    });
});

export default router;

import axios from 'axios';
import type { TrendAnalysis } from '../../types';
import { getRelevantIndianBrands } from '../../data/indianBrands';

/**
 * Enhanced AI Trend Analysis Service
 * Generates actionable insights with investment scores and image search terms
 */
class TrendAnalysisService {
    private apiKey: string;
    private model: string;
    private baseUrl: string = 'https://openrouter.ai/api/v1';

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.model = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-nano-30b-a3b:free';

        if (!this.apiKey) {
            throw new Error('OPENROUTER_API_KEY not set in environment variables');
        }
    }

    /**
     * Generate comprehensive trend analysis with actionable insights
     */
    async analyzeTrend(
        topic: string,
        sources: string[],
        contextData?: {
            trendsData?: any;
            newsData?: any;
            shoppingData?: any;
        }
    ): Promise<TrendAnalysis> {
        try {
            console.log(`🤖 Analyzing trend for: ${topic}`);

            // Build context from real data sources (SUMMARIZED for performance)
            let context = '';
            if (contextData?.trendsData) {
                const summary = this.summarizeTrendsData(contextData.trendsData);
                context += `\nGoogle Trends: ${summary}`;
            }
            if (contextData?.newsData) {
                const summary = this.summarizeNewsData(contextData.newsData);
                context += `\nRecent News: ${summary}`;
            }
            if (contextData?.shoppingData) {
                const summary = this.summarizeShoppingData(contextData.shoppingData);
                context += `\nShopping Data: ${summary}`;
            }

            // Add Indian brand context
            const relevantIndianBrands = getRelevantIndianBrands(topic, 5);
            if (relevantIndianBrands.length > 0) {
                context += `\n\nRelevant Indian Brands for "${topic}":`;
                relevantIndianBrands.forEach(brand => {
                    context += `\n- ${brand.name} (${brand.category}): ${brand.notableFor}. Price: ${brand.priceRange}`;
                });
            }

            // Create enhanced prompt
            const prompt = this.buildEnhancedPrompt(topic, sources, context);

            // Call OpenRouter API
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.5,
                    max_tokens: 2500,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://trend-ai.local',
                        'X-Title': 'Trend Forecaster AI',
                    },
                }
            );

            const content = response.data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No content received from AI model');
            }

            // Parse JSON response
            const analysisData = this.parseAIResponse(content);

            // Add real sources if available
            if (contextData?.newsData?.articles) {
                analysisData.sources = contextData.newsData.articles.slice(0, 5).map((article: any) => ({
                    web: {
                        uri: article.url,
                        title: article.title,
                    },
                }));
            }

            return analysisData;
        } catch (error: any) {
            console.error('❌ AI Analysis error:', error.message);
            return this.getFallbackAnalysis(topic);
        }
    }

    /**
     * Enhanced prompt for actionable, data-driven insights
     */
    private buildEnhancedPrompt(topic: string, sources: string[], context: string): string {
        return `You are an expert fashion industry analyst and trend forecaster. Your job is to provide ACTIONABLE, SPECIFIC insights that help someone decide whether to invest time/money in this trend.

Topic to analyze: "${topic}"
Data Sources: ${sources.join(', ')}
${context ? `\nReal-Time Data:\n${context}` : ''}

CRITICAL REQUIREMENTS:
1. Be SPECIFIC - use real brand names, price ranges, demographics
2. Be ACTIONABLE - give clear investment recommendation
3. Be DATA-DRIVEN - cite specific numbers, percentages, timeframes
4. Generate SPECIFIC image search terms for visual representation

Respond ONLY with valid JSON in this EXACT format:

{
  "topic": "${topic}",
  "summary": "2-3 sentences explaining what this trend is in simple terms a non-fashion person would understand",
  
  "editorialNarrative": "1-2 calm, authoritative paragraphs (100-150 words total) written in a senior fashion editor voice. Explain: What is culturally changing in this trend space? Why is this shift happening NOW? How is this moment different from past cycles? NO metrics, NO hype language, NO predictions. Focus on cultural context, industry signals, and timing. Use phrases like 're-entering conversations', 'being driven by', 'counterpoint to', etc.",
  
  "investmentAnalysis": {
    "score": 8,
    "recommendation": "Strong Buy",
    "riskLevel": "Low",
    "confidencePercent": 85,
    "reasoning": "Why this score - be specific about market signals"
  },
  
  "marketTiming": {
    "currentPhase": "Growing",
    "phaseDescription": "What this phase means in plain English",
    "peakPrediction": "Q2 2025",
    "entryWindow": "Best time to enter: next 6-12 months",
    "exitSignals": ["Signs that trend is declining"]
  },
  
  "priceAnalysis": {
    "budgetRange": "$30-50 (H&M, Zara, Uniqlo)",
    "midRange": "$80-150 (COS, Arket, & Other Stories)",
    "luxuryRange": "$300-800 (Acne Studios, AMI Paris)",
    "bestValuePick": "Specific brand/product recommendation"
  },
  
  "targetAudience": {
    "primaryDemo": "Age 18-35, urban professionals",
    "secondaryDemo": "Fashion-forward millennials",
    "notRecommendedFor": "Who should avoid this trend and why",
    "adoptionLevel": "Early Adopter / Mainstream / Late Majority"
  },
  
  "keyPlayers": [
    {
      "brand": "Brand Name",
      "role": "Pioneer / Fast Follower / Luxury Adapter",
      "pricePoint": "$XX-XX",
      "notableProduct": "Specific product driving trend"
    }
  ],
  
  "imageSearchTerms": [
    "specific visual search term 1 for Unsplash/Google - be very specific about style, color, context",
    "specific visual search term 2 - include year, setting, demographic",
    "specific visual search term 3 - product close-up or outfit context"
  ],
  
  "keyInsights": [
    {
      "insight": "Specific, data-backed insight with numbers",
      "impact": "High",
      "sourceType": "market research",
      "evidence": "How we know this - specific data point"
    }
  ],
  
  "emergingTrends": [
    {
      "trend": "Specific sub-trend or variation",
      "impact": "High",
      "growthPotential": 85,
      "description": "What this variation looks like and why it matters"
    }
  ],
  
  "sentiment": {
    "positive": 70,
    "neutral": 20,
    "negative": 10
  },
  
  "competitors": [
    {
      "name": "Competitor/Brand Name",
      "summary": "Their position in this trend",
      "recentActivity": "What they launched/announced",
      "threatLevel": "How they might affect trend trajectory"
    }
  ],
  
  "futureOutlook": "Clear 2-3 sentence prediction with specific timeline",
  
  "actionableNextSteps": [
    "If buying: specific what to look for",
    "If investing/business: specific market entry advice",
    "If styling: specific how to incorporate"
  ],
  
  "correlationMatrix": {
    "trends": ["Related Trend 1", "Related Trend 2"],
    "matrix": [[1.0, 0.7], [0.7, 1.0]]
  }
}

IMPORTANT GUIDELINES:
- investmentAnalysis.score: 1-10 (10 = must invest now)
- investmentAnalysis.recommendation: "Strong Buy", "Buy", "Hold", "Sell", "Avoid"
- investmentAnalysis.riskLevel: "Low", "Medium", "High"
- marketTiming.currentPhase: "Emerging", "Growing", "Mainstream", "Mature", "Declining"
- All percentages must sum to 100 for sentiment
- Be BRUTALLY HONEST - if trend is overhyped or dying, say so
- imageSearchTerms must be SPECIFIC enough to return relevant fashion images (not generic)`;
    }

    /**
     * Parse AI response handling different formats
     */
    private parseAIResponse(content: string): TrendAnalysis {
        let parsedData: any;

        try {
            parsedData = JSON.parse(content.trim());
        } catch (error) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Could not parse AI response as JSON');
            }
        }

        // Ensure keyInsights has proper structure
        if (parsedData.keyInsights && Array.isArray(parsedData.keyInsights)) {
            parsedData.keyInsights = parsedData.keyInsights.map((item: any) => {
                if (typeof item === 'string') {
                    return { insight: item, sourceType: 'web', impact: 'Medium' };
                }
                return {
                    insight: item.insight || item,
                    sourceType: item.sourceType || 'web',
                    impact: item.impact || 'Medium',
                    evidence: item.evidence || ''
                };
            });
        }

        // Ensure sources array exists
        if (!parsedData.sources) {
            parsedData.sources = [];
        }

        // Ensure imageSearchTerms exists
        if (!parsedData.imageSearchTerms) {
            parsedData.imageSearchTerms = [
                `${parsedData.topic} fashion 2024 street style`,
                `${parsedData.topic} outfit inspiration`,
                `${parsedData.topic} trend clothing`
            ];
        }

        return parsedData as TrendAnalysis;
    }

    /**
     * Fallback analysis with actionable structure
     */
    private getFallbackAnalysis(topic: string): TrendAnalysis {
        console.log('⚠️  Using fallback trend analysis');
        return {
            topic,
            summary: `${topic} represents a current movement in fashion that blends functionality with style. It's gaining traction among younger demographics and is being adopted by both fast-fashion and luxury brands.`,

            investmentAnalysis: {
                score: 6,
                recommendation: 'Hold',
                riskLevel: 'Medium',
                confidencePercent: 60,
                reasoning: 'Insufficient data for strong recommendation. Further research advised.'
            },

            marketTiming: {
                currentPhase: 'Growing',
                phaseDescription: 'Still gaining momentum, not yet mainstream',
                peakPrediction: 'Mid 2025',
                entryWindow: 'Next 3-6 months is optimal',
                exitSignals: ['Major fast-fashion saturation', 'Celebrity backlash']
            },

            priceAnalysis: {
                budgetRange: '$30-60 (Zara, H&M)',
                midRange: '$100-200 (COS, Arket)',
                luxuryRange: '$400-1000 (Designer brands)',
                bestValuePick: 'Check Zara and COS for quality-price balance'
            },

            targetAudience: {
                primaryDemo: 'Ages 18-35',
                secondaryDemo: 'Fashion-conscious professionals',
                notRecommendedFor: 'Conservative dress codes',
                adoptionLevel: 'Early Mainstream'
            },

            keyPlayers: [
                { brand: 'Zara', role: 'Fast Follower', pricePoint: '$40-80', notableProduct: 'Current season collection' }
            ],

            imageSearchTerms: [
                `${topic} fashion street style 2024`,
                `${topic} outfit urban casual`,
                `${topic} clothing trend editorial`
            ],

            keyInsights: [
                { insight: `${topic} is showing growth in social media engagement`, sourceType: 'social', impact: 'Medium', evidence: 'Based on general trend patterns' },
                { insight: `Brands are increasingly featuring ${topic} in collections`, sourceType: 'market', impact: 'High', evidence: 'Observed in recent fashion weeks' },
            ],

            emergingTrends: [
                { trend: `Sustainable ${topic} alternatives`, impact: 'High', growthPotential: 75, description: 'Eco-conscious variations gaining traction' },
                { trend: `${topic} crossover with athleisure`, impact: 'Medium', growthPotential: 65, description: 'Comfort-meets-style interpretations' },
            ],

            sentiment: { positive: 60, neutral: 30, negative: 10 },

            competitors: [
                {
                    name: 'Major Fashion Brands',
                    summary: 'Leading the trend adoption',
                    recentActivity: 'Featuring in current collections',
                    threatLevel: 'Medium - increased competition expected'
                },
            ],

            futureOutlook: `${topic} is expected to continue growing through 2025, with peak mainstream adoption likely in the second half of the year. Early adopters have 6-12 months of differentiation potential.`,

            actionableNextSteps: [
                'Research current offerings at mid-range brands',
                'Test with one statement piece before full commitment',
                'Watch for designer collaborations for investment pieces'
            ],

            correlationMatrix: {
                trends: [`Sustainable ${topic}`, `${topic} athleisure`],
                matrix: [[1.0, 0.6], [0.6, 1.0]],
            },
            sources: [],
        };
    }

    /**
     * Summarize Google Trends data to reduce prompt size
     */
    private summarizeTrendsData(trendsData: any): string {
        if (!trendsData) return 'No data available';

        const parts: string[] = [];

        // Extract interest over time (just recent values)
        if (trendsData.interestOverTime?.length > 0) {
            const recent = trendsData.interestOverTime.slice(-5); // Last 5 data points
            const avgInterest = recent.reduce((sum: number, item: any) => sum + (item.value || 0), 0) / recent.length;
            parts.push(`Recent interest score: ${Math.round(avgInterest)}/100`);

            // Check if trending up or down
            const firstVal = recent[0]?.value || 0;
            const lastVal = recent[recent.length - 1]?.value || 0;
            const trend = lastVal > firstVal ? 'increasing' : lastVal < firstVal ? 'decreasing' : 'stable';
            parts.push(`Trend: ${trend}`);
        }

        // Extract related queries (top 3 only)
        if (trendsData.relatedQueries?.length > 0) {
            const topQueries = trendsData.relatedQueries.slice(0, 3).map((q: any) => q.query || q).join(', ');
            parts.push(`Related searches: ${topQueries}`);
        }

        return parts.join('; ');
    }

    /**
     * Summarize news data to reduce prompt size
     */
    private summarizeNewsData(newsData: any): string {
        if (!newsData?.articles || newsData.articles.length === 0) {
            return 'No recent news available';
        }

        // Extract just titles and sources (top 5 articles)
        const summaries = newsData.articles.slice(0, 5).map((article: any, idx: number) =>
            `${idx + 1}. "${article.title}" (${article.source?.name || 'Unknown'})`
        );

        return summaries.join('; ');
    }

    /**
     * Summarize shopping/market data to reduce prompt size
     */
    private summarizeShoppingData(shoppingData: any): string {
        if (!shoppingData?.products || shoppingData.products.length === 0) {
            return 'No shopping data available';
        }

        const parts: string[] = [];

        // Extract price range
        const prices = shoppingData.products
            .map((p: any) => parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0'))
            .filter((p: number) => p > 0);

        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
            parts.push(`Price range: $${minPrice.toFixed(0)}-$${maxPrice.toFixed(0)} (avg $${avgPrice.toFixed(0)})`);
        }

        // Extract top brands (unique, top 5)
        const brands = [...new Set(
            shoppingData.products
                .map((p: any) => p.brand || p.source)
                .filter((b: any) => b)
                .slice(0, 5)
        )];
        if (brands.length > 0) {
            parts.push(`Top brands: ${brands.join(', ')}`);
        }

        // Count of products
        parts.push(`${shoppingData.products.length} products found`);

        return parts.join('; ');
    }
}

export { TrendAnalysisService };

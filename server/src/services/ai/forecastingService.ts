import axios from 'axios';

interface HistoricalDataPoint {
    date: string;
    value: number;
}

interface ForecastResult {
    predictions: number[];        // 12-month predictions (0-100 scale)
    upperBound: number[];         // Upper confidence interval
    lowerBound: number[];         // Lower confidence interval
    confidence: number;           // Overall forecast confidence (0-1)
    methodology: string;          // How the forecast was made
    assumptions: string[];        // Key assumptions
    designerGuidance?: string;    // Actionable guidance for designers
}

/**
 * AI-Powered Forecasting Service
 * Uses historical trend data + AI analysis to predict future 12 months
 */
class ForecastingService {
    private apiKey: string;
    private apiUrl: string = 'https://openrouter.ai/api/v1/chat/completions';
    private model: string;

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

        if (!this.apiKey) {
            console.warn('⚠️  OPENROUTER_API_KEY not set. Forecasting will use fallback.');
        }
    }

    /**
     * Generate 12-month forecast based on historical data
     */
    async generateForecast(
        keyword: string,
        historicalData: HistoricalDataPoint[],
        currentMomentum?: string
    ): Promise<ForecastResult> {
        try {
            console.log(`🔮 Generating AI forecast for: ${keyword} (${historicalData.length} data points)`);

            // Always generate forecast using intelligent fallback
            // This ensures users always see predictions
            if (!this.apiKey || historicalData.length < 3) {
                console.log('📊 Using mathematical forecast model');
                return this.getFallbackForecast(keyword, historicalData);
            }

            const prompt = this.buildForecastPrompt(keyword, historicalData, currentMomentum);

            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert fashion trend forecaster with deep knowledge of time series analysis, seasonal patterns, and market dynamics.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3, // Lower temperature for more analytical predictions
                    max_tokens: 1500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://trend-forecaster.app',
                        'X-Title': 'Fashion Trend Forecaster'
                    }
                }
            );

            const forecastText = response.data.choices[0]?.message?.content || '';
            return this.parseForecastResponse(forecastText, keyword);

        } catch (error: any) {
            console.error('❌ Forecasting error:', error.message);
            return this.getFallbackForecast(keyword, historicalData);
        }
    }

    /**
     * Build AI prompt with historical data context
     */
    private buildForecastPrompt(
        keyword: string,
        historicalData: HistoricalDataPoint[],
        currentMomentum?: string
    ): string {
        // Extract values and calculate basic stats
        const values = historicalData.map(d => d.value);
        const dates = historicalData.map(d => d.date);

        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const trend = values[values.length - 1] - values[0];
        const volatility = Math.sqrt(
            values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b, 0) / values.length
        );

        return `You are forecasting fashion trend adoption for designers planning SS25 (Spring/Summer 2025) and FW25 (Fall/Winter 2025) collections.

**Trend**: "${keyword}"

**Historical Google Trends Data (${dates[0]} to ${dates[dates.length - 1]}):**
${historicalData.map(d => `${d.date}: ${d.value}/100`).join('\n')}

**Statistical Context:**
- Average interest: ${avg.toFixed(1)}/100
- 12-month trend: ${trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} ${trend > 0 ? '+' : ''}${trend.toFixed(1)} points
- Volatility: ${volatility.toFixed(1)} (${volatility > 15 ? 'High - unpredictable' : volatility > 8 ? 'Medium - some fluctuation' : 'Low - stable'})
${currentMomentum ? `- Current phase: ${currentMomentum}` : ''}

**Your Task**: Forecast next 12 months (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} onwards)

**Critical Considerations**:
1. **Collection Cycles**: Fashion operates in 6-month cycles
   - SS25 (Feb-July 2025): Light fabrics, bright colors, resort wear
   - FW25 (Aug-Jan 2026): Heavy fabrics, layering, darker palettes
   
2. **Regional Markets**: Consider India specifically
   - Festival seasons (Diwali Oct/Nov, Wedding season Nov-Feb) drive consumption
   - Summer heat (March-June) affects fabric choices
   - Monsoon (July-Sept) impacts footwear/outerwear trends

3. **Adoption Curve**: Fashion follows pattern:
   - Months 1-3: Early adopters (influencers, fashion-forward consumers)
   - Months 4-6: Mass market entry (high street brands pick up)
   - Months 7-9: Peak saturation or plateau?
   - Months 10-12: Decline or sustained mainstream?

4. **Competing Trends**: Will this cannibalize other trends or create new space?

5. **Production Reality**: Brands decide collections 6 months ahead
   - If forecasting high growth in Month 6, designers need data NOW

**Return Format (JSON)**:
{
  "predictions": [65, 70, 75, 78, 82, 85, 88, 90, 92, 93, 92, 90],  // 12 monthly values (0-100)
  "upperBound": [70, 76, 82, 86, 90, 94, 96, 98, 99, 100, 98, 95],   // Optimistic scenario
  "lowerBound": [60, 64, 68, 70, 74, 76, 80, 82, 85, 86, 86, 85],   // Conservative scenario
  "confidence": 0.75,  // 0-1 scale (0.7+ = reliable, 0.5-0.7 = moderate, <0.5 = uncertain)
  "methodology": "Time series + seasonal decomposition + regional context",
  "assumptions": [
    "Stable economic conditions in key markets",
    "No disruptive fashion weeks or viral moments",
    "Continued social media engagement"
  ],
  "designerGuidance": "Allocate 20-25% of SS25 to this trend if momentum sustains through Month 3. Reserve final FW25 decisions until Month 6 data confirms trajectory."
}

**Rules**:
- Be realistic: fashion trends rarely grow linearly
- Account for seasonality: interest dips in off-seasons
- Widen confidence bounds over time (uncertainty ↑ with distance)
- If historical data shows decline, don't force optimism
- Month 1 prediction should align closely with latest historical value`;
    }

    /**
     * Parse AI response into structured forecast
     * Enhanced to handle multiple response formats
     */
    private parseForecastResponse(text: string, keyword: string): ForecastResult {
        try {
            // Strategy 1: Try to extract JSON from markdown code blocks
            const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (codeBlockMatch) {
                const parsed = JSON.parse(codeBlockMatch[1]);
                if (this.isValidForecast(parsed)) {
                    return this.normalizeForecast(parsed);
                }
            }

            // Strategy 2: Try to find any JSON object in the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (this.isValidForecast(parsed)) {
                    return this.normalizeForecast(parsed);
                }
            }

            // Strategy 3: Try parsing the entire response as JSON
            const parsed = JSON.parse(text);
            if (this.isValidForecast(parsed)) {
                return this.normalizeForecast(parsed);
            }

            throw new Error('Invalid forecast format');
        } catch (error) {
            console.error('❌ Failed to parse forecast response');
            console.log('📄 Response preview:', text.substring(0, 200));
            return this.getFallbackForecast(keyword, []);
        }
    }

    /**
     * Validate if parsed object has required forecast structure
     */
    private isValidForecast(obj: any): boolean {
        return (
            obj &&
            obj.predictions &&
            Array.isArray(obj.predictions) &&
            obj.predictions.length === 12 &&
            obj.predictions.every((v: any) => typeof v === 'number')
        );
    }

    /**
     * Normalize and validate forecast data
     */
    private normalizeForecast(parsed: any): ForecastResult {
        return {
            predictions: parsed.predictions,
            upperBound: parsed.upperBound || parsed.predictions.map((v: number) => Math.min(100, Math.round(v * 1.15))),
            lowerBound: parsed.lowerBound || parsed.predictions.map((v: number) => Math.max(0, Math.round(v * 0.85))),
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
            methodology: parsed.methodology || 'AI-powered time series analysis',
            assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : ['Stable market conditions', 'No disruptive events'],
            designerGuidance: parsed.designerGuidance || undefined
        };
    }

    /**
     * Fallback forecast when AI fails
     */
    private getFallbackForecast(keyword: string, historicalData: HistoricalDataPoint[]): ForecastResult {
        console.log('⚠️  Using fallback forecast logic');

        // Simple extrapolation based on last value or default
        const baseValue = historicalData.length > 0 ?
            historicalData[historicalData.length - 1].value : 65;

        // Generate modest growth curve
        const predictions = Array.from({ length: 12 }, (_, i) => {
            const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI) * 5; // Seasonal wave
            const growth = i * 1.5; // Modest growth
            return Math.min(100, Math.max(0, baseValue + growth + seasonalFactor));
        });

        return {
            predictions: predictions.map(v => Math.round(v)),
            upperBound: predictions.map(v => Math.round(Math.min(100, v * 1.2))),
            lowerBound: predictions.map(v => Math.round(Math.max(0, v * 0.8))),
            confidence: 0.5,
            methodology: 'Simple trend extrapolation (fallback)',
            assumptions: [
                'Linear growth continuation',
                'Seasonal volatility maintained',
                'No major disruptions'
            ]
        };
    }
}

export { ForecastingService };
export type { ForecastResult, HistoricalDataPoint };

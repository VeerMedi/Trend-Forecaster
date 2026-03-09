/**
 * Main Forecasting Service
 * Orchestrates all forecasting components and provides unified API
 */

import { processRawData, calculateTrendScore, TrendScore } from './trendScoreEngine';
import { calculateVelocityMetrics, VelocityMetrics } from './velocityCalculator';
import { classifyTrendStatus, StatusClassification } from './statusClassifier';
import { generateForecast, ForecastOutput } from './forecastEngine';
import { calculateConfidence, ConfidenceScore } from './confidenceScorer';

export interface ForecastResponse {
    topic: string;
    timestamp: string;
    current: {
        score: number;
        status: string;
        velocity: number;
        acceleration: number;
        direction: string;
        momentum: string;
    };
    forecast: {
        '1m': {
            score: number;
            change: string;
            range: [number, number];
        };
        '3m': {
            score: number;
            change: string;
            range: [number, number];
        };
        '6m': {
            score: number;
            change: string;
            range: [number, number];
        };
    };
    confidence: {
        score: number;
        level: string;
        factors: {
            dataCompleteness: number;
            sourceAgreement: number;
            signalStability: number;
            historicalDepth: number;
        };
        explanation: string;
    };
    drivers: string[];
    methodology: string;
    disclaimer: string;
}

/**
 * Main forecasting function
 * Combines all components to generate complete forecast
 */
export async function generateTrendForecast(
    topic: string,
    apiData: {
        trendsData?: any;
        redditData?: any;
        shoppingData?: any;
        mediaData?: any;
    }
): Promise<ForecastResponse> {

    console.log(`🔮 Generating forecast for: ${topic}`);

    // Step 1: Normalize and score all data sources
    const sourceData = processRawData(apiData);
    const trendScore: TrendScore = calculateTrendScore(sourceData);

    console.log(`📊 Trend Score: ${trendScore.score}/100 (${trendScore.sourcesUsed.length}/4 sources)`);

    // Step 2: Calculate velocity metrics from Google Trends historical data
    const velocity: VelocityMetrics = calculateVelocityMetrics(apiData.trendsData);

    console.log(`📈 Velocity: ${velocity.velocity > 0 ? '+' : ''}${velocity.velocity}% WoW`);

    // Step 3: Classify trend status
    const status: StatusClassification = classifyTrendStatus(trendScore.score, velocity);

    console.log(`🎯 Status: ${status.status} (confidence: ${(status.confidence * 100).toFixed(0)}%)`);

    // Step 4: Generate forecasts for 1M, 3M, 6M
    const forecast: ForecastOutput = generateForecast(
        trendScore.score,
        velocity.velocity,
        velocity.volatility
    );

    console.log(`🔮 1M Forecast: ${forecast.forecast1m.score} (${forecast.forecast1m.changePercent})`);
    console.log(`🔮 3M Forecast: ${forecast.forecast3m.score} (${forecast.forecast3m.changePercent})`);
    console.log(`🔮 6M Forecast: ${forecast.forecast6m.score} (${forecast.forecast6m.changePercent})`);

    // Step 5: Calculate confidence score
    const historicalDataPoints = getHistoricalDataPoints(apiData.trendsData);
    const confidence: ConfidenceScore = calculateConfidence(
        trendScore,
        velocity,
        historicalDataPoints
    );

    console.log(`✅ Confidence: ${confidence.level} (${(confidence.score * 100).toFixed(0)}%)`);

    // Step 6: Identify key drivers
    const drivers = identifyKeyDrivers(sourceData, velocity, trendScore);

    // Step 7: Assemble final response
    return {
        topic,
        timestamp: new Date().toISOString(),
        current: {
            score: trendScore.score,
            status: status.status,
            velocity: velocity.velocity,
            acceleration: velocity.acceleration,
            direction: velocity.direction,
            momentum: velocity.momentum
        },
        forecast: {
            '1m': {
                score: forecast.forecast1m.score,
                change: forecast.forecast1m.changePercent,
                range: [forecast.forecast1m.range.lower, forecast.forecast1m.range.upper]
            },
            '3m': {
                score: forecast.forecast3m.score,
                change: forecast.forecast3m.changePercent,
                range: [forecast.forecast3m.range.lower, forecast.forecast3m.range.upper]
            },
            '6m': {
                score: forecast.forecast6m.score,
                change: forecast.forecast6m.changePercent,
                range: [forecast.forecast6m.range.lower, forecast.forecast6m.range.upper]
            }
        },
        confidence: {
            score: confidence.score,
            level: confidence.level,
            factors: confidence.factors,
            explanation: confidence.explanation
        },
        drivers,
        methodology: 'Statistical forecast using multi-source aggregation, velocity analysis, and linear extrapolation with exponential damping. Not ML-based.',
        disclaimer: 'MVP forecast - accuracy improves with longer observation periods and additional data sources'
    };
}

/**
 * Extract number of historical data points from Google Trends
 */
function getHistoricalDataPoints(trendsData: any): number {
    if (!trendsData?.interest_over_time) return 0;

    try {
        const timelineData = Array.isArray(trendsData.interest_over_time)
            ? trendsData.interest_over_time
            : trendsData.interest_over_time.timeline_data;

        return Array.isArray(timelineData) ? timelineData.length : 0;
    } catch {
        return 0;
    }
}

/**
 * Identify key drivers of the trend
 */
function identifyKeyDrivers(
    sourceData: any,
    velocity: VelocityMetrics,
    trendScore: TrendScore
): string[] {
    const drivers: string[] = [];

    // Check Google Trends
    if (sourceData.googleTrends && sourceData.googleTrends > 70) {
        drivers.push(`Google Trends: High search interest (${sourceData.googleTrends}/100)`);
    } else if (velocity.velocity > 15) {
        drivers.push(`Google Trends: Rapid growth (+${velocity.velocity.toFixed(1)}% WoW)`);
    }

    // Check Reddit
    if (sourceData.redditVelocity && sourceData.redditVelocity > 60) {
        drivers.push(`Reddit: Strong community engagement (${sourceData.redditVelocity}/100)`);
    }

    // Check Shopping
    if (sourceData.shoppingAvailability && sourceData.shoppingAvailability > 70) {
        drivers.push(`Shopping: High product availability (${sourceData.shoppingAvailability}/100)`);
    }

    // Check Media
    if (sourceData.mediaCoverage && sourceData.mediaCoverage > 50) {
        drivers.push(`Media: Increasing editorial coverage (${sourceData.mediaCoverage}/100)`);
    }

    // Check acceleration
    if (velocity.acceleration > 5) {
        drivers.push(`Momentum: Accelerating growth (+${velocity.acceleration.toFixed(1)})`);
    }

    // If no specific drivers, add general ones
    if (drivers.length === 0) {
        if (trendScore.score > 50) {
            drivers.push('Moderate overall interest across sources');
        } else {
            drivers.push('Limited signals - niche or emerging trend');
        }
    }

    // Return top 3 drivers
    return drivers.slice(0, 3);
}

export default {
    generateTrendForecast
};

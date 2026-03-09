/**
 * Confidence Scorer
 * Calculates confidence score based on data quality indicators
 */

import { TrendScore } from './trendScoreEngine';
import { VelocityMetrics } from './velocityCalculator';

export interface ConfidenceScore {
    score: number;              // 0-1 overall confidence
    level: 'High' | 'Medium-High' | 'Medium' | 'Low-Medium' | 'Low';
    factors: {
        dataCompleteness: number;
        sourceAgreement: number;
        signalStability: number;
        historicalDepth: number;
    };
    explanation: string;
}

/**
 * Calculate overall confidence score
 */
export function calculateConfidence(
    trendScore: TrendScore,
    velocity: VelocityMetrics,
    historicalDataPoints: number
): ConfidenceScore {

    // Factor 1: Data Completeness (30%)
    const dataCompleteness = trendScore.dataCompleteness;

    // Factor 2: Source Agreement (25%)
    const sourceAgreement = calculateSourceAgreement(trendScore);

    // Factor 3: Signal Stability (25%)
    const signalStability = calculateSignalStability(velocity.volatility);

    // Factor 4: Historical Depth (20%)
    const historicalDepth = calculateHistoricalDepth(historicalDataPoints);

    // Weighted confidence score
    const overallScore = (
        dataCompleteness * 0.30 +
        sourceAgreement * 0.25 +
        signalStability * 0.25 +
        historicalDepth * 0.20
    );

    const level = getConfidenceLevel(overallScore);
    const explanation = generateExplanation(level, {
        dataCompleteness,
        sourceAgreement,
        signalStability,
        historicalDepth
    });

    return {
        score: Math.round(overallScore * 100) / 100,
        level,
        factors: {
            dataCompleteness,
            sourceAgreement,
            signalStability,
            historicalDepth
        },
        explanation
    };
}

/**
 * Calculate source agreement score
 * Do all data sources point in the same direction?
 */
function calculateSourceAgreement(trendScore: TrendScore): number {
    const { sourcesUsed } = trendScore;

    if (sourcesUsed.length < 2) {
        // Can't measure agreement with only 1 source
        return 0.5;
    }

    // For MVP, assume moderate agreement if multiple sources present
    // In Phase 3, would actually compare direction of each source

    if (sourcesUsed.length === 4) {
        return 0.9; // All sources available = high agreement
    }

    if (sourcesUsed.length === 3) {
        return 0.75; // Most sources available = good agreement
    }

    return 0.6; // Basic agreement
}

/**
 * Calculate signal stability score
 * Lower volatility = higher stability
 */
function calculateSignalStability(volatility: number): number {
    // Volatility of 0 = perfect stability (score 1.0)
    // Volatility of 30+ = very unstable (score 0.0)

    const stability = Math.max(0, 1 - (volatility / 30));

    return Math.round(stability * 100) / 100;
}

/**
 * Calculate historical depth score
 * More data points = higher confidence
 */
function calculateHistoricalDepth(dataPoints: number): number {
    // 30+ data points = full confidence (1.0)
    // 15 data points = half confidence (0.5) 
    // 0 data points = no confidence (0.0)

    const depth = Math.min(dataPoints / 30, 1.0);

    return Math.round(depth * 100) / 100;
}

/**
 * Convert numeric confidence to level
 */
function getConfidenceLevel(score: number): 'High' | 'Medium-High' | 'Medium' | 'Low-Medium' | 'Low' {
    if (score >= 0.80) return 'High';
    if (score >= 0.65) return 'Medium-High';
    if (score >= 0.45) return 'Medium';
    if (score >= 0.25) return 'Low-Medium';
    return 'Low';
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(
    level: string,
    factors: {
        dataCompleteness: number;
        sourceAgreement: number;
        signalStability: number;
        historicalDepth: number;
    }
): string {

    const weakFactors: string[] = [];
    const strongFactors: string[] = [];

    if (factors.dataCompleteness < 0.75) {
        weakFactors.push('limited data sources');
    } else {
        strongFactors.push('comprehensive data coverage');
    }

    if (factors.signalStability < 0.60) {
        weakFactors.push('volatile signals');
    } else if (factors.signalStability > 0.80) {
        strongFactors.push('stable trend pattern');
    }

    if (factors.historicalDepth < 0.50) {
        weakFactors.push('limited historical data');
    } else if (factors.historicalDepth > 0.80) {
        strongFactors.push('extensive historical data');
    }

    if (level === 'High' || level === 'Medium-High') {
        return `${level} confidence based on ${strongFactors.join(' and ')}.`;
    }

    if (weakFactors.length > 0) {
        return `${level} confidence due to ${weakFactors.join(' and ')}.`;
    }

    return `${level} confidence based on available data.`;
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(level: string): string {
    switch (level) {
        case 'High': return '#10b981';
        case 'Medium-High': return '#3b82f6';
        case 'Medium': return '#f59e0b';
        case 'Low-Medium': return '#f97316';
        case 'Low': return '#ef4444';
        default: return '#6b7280';
    }
}

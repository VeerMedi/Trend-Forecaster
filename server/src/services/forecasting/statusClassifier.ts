/**
 * Status Classifier
 * Classifies trends into: Emerging, Growing, Peaking, Declining, or Niche
 */

import { VelocityMetrics } from './velocityCalculator';

export type TrendStatus = 'Emerging' | 'Growing' | 'Peaking' | 'Declining' | 'Niche';

export interface StatusClassification {
    status: TrendStatus;
    confidence: number;         // 0-1
    reasoning: string;
    indicators: string[];
}

/**
 * Classify trend status using decision tree logic
 */
export function classifyTrendStatus(
    score: number,
    velocity: VelocityMetrics
): StatusClassification {

    const { velocity: vel, acceleration: acc, direction, momentum } = velocity;

    // EMERGING: High velocity + positive acceleration + medium score
    if (vel > 15 && acc > 5 && score > 40 && score < 70) {
        return {
            status: 'Emerging',
            confidence: 0.85,
            reasoning: 'Rapid growth with accelerating momentum',
            indicators: [
                `Velocity: +${vel.toFixed(1)}% WoW`,
                `Acceleration: +${acc.toFixed(1)}`,
                'Breakout pattern detected'
            ]
        };
    }

    // GROWING: Positive velocity + high score
    if (vel > 5 && score > 60) {
        const conf = momentum === 'accelerating' ? 0.80 : 0.70;
        return {
            status: 'Growing',
            confidence: conf,
            reasoning: 'Strong momentum with mainstream adoption',
            indicators: [
                `Velocity: +${vel.toFixed(1)}% WoW`,
                `Score: ${score}/100`,
                direction === 'up' ? 'Upward trajectory' : 'Stable growth'
            ]
        };
    }

    // PEAKING: Low velocity + very high score
    if (vel >= -5 && vel <= 5 && score > 70) {
        return {
            status: 'Peaking',
            confidence: 0.75,
            reasoning: 'High interest with stabilizing growth',
            indicators: [
                `Score: ${score}/100 (high)`,
                `Velocity: ${vel > 0 ? '+' : ''}${vel.toFixed(1)}% (stable)`,
                'At or near maximum interest'
            ]
        };
    }

    // DECLINING: Negative velocity
    if (vel < -5) {
        const conf = momentum === 'decelerating' ? 0.80 : 0.70;
        return {
            status: 'Declining',
            confidence: conf,
            reasoning: 'Downward momentum with fading interest',
            indicators: [
                `Velocity: ${vel.toFixed(1)}% WoW`,
                acc < 0 ? 'Accelerating decline' : 'Slowing decline',
                'Interest waning'
            ]
        };
    }

    // PEAKING (alternative): Decelerating from high point
    if (momentum === 'decelerating' && score > 65 && vel > 0) {
        return {
            status: 'Peaking',
            confidence: 0.70,
            reasoning: 'Slowing growth at high interest level',
            indicators: [
                `Score: ${score}/100`,
                'Growth decelerating',
                'Likely approaching peak'
            ]
        };
    }

    // GROWING (low confidence): Moderate score + positive velocity
    if (vel > 2 && score > 40 && score <= 60) {
        return {
            status: 'Growing',
            confidence: 0.60,
            reasoning: 'Moderate growth with building interest',
            indicators: [
                `Velocity: +${vel.toFixed(1)}% WoW`,
                `Score: ${score}/100 (moderate)`,
                'Gaining traction'
            ]
        };
    }

    // NICHE: Low score or very low velocity
    if (score < 40 || (score < 60 && Math.abs(vel) < 2)) {
        return {
            status: 'Niche',
            confidence: 0.65,
            reasoning: 'Limited mainstream interest',
            indicators: [
                `Score: ${score}/100 (low)`,
                velocity.volatility > 15 ? 'Volatile signal' : 'Stable niche',
                'Not trending broadly'
            ]
        };
    }

    // DEFAULT: Growing (low confidence)
    return {
        status: 'Growing',
        confidence: 0.50,
        reasoning: 'Moderate signals - classification uncertain',
        indicators: [
            `Score: ${score}/100`,
            `Velocity: ${vel > 0 ? '+' : ''}${vel.toFixed(1)}%`,
            'Mixed signals'
        ]
    };
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: TrendStatus): string {
    switch (status) {
        case 'Emerging': return '#10b981'; // Green
        case 'Growing': return '#3b82f6';   // Blue
        case 'Peaking': return '#f59e0b';   // Amber
        case 'Declining': return '#ef4444'; // Red
        case 'Niche': return '#6b7280';     // Gray
    }
}

/**
 * Get status emoji for display
 */
export function getStatusEmoji(status: TrendStatus): string {
    switch (status) {
        case 'Emerging': return '🚀';
        case 'Growing': return '📈';
        case 'Peaking': return '⭐';
        case 'Declining': return '📉';
        case 'Niche': return '🔍';
    }
}

/**
 * Get client-friendly status description
 */
export function getStatusDescription(status: TrendStatus): string {
    switch (status) {
        case 'Emerging':
            return 'This trend is breaking out with rapid acceleration. Early-stage opportunity.';
        case 'Growing':
            return 'Strong momentum with mainstream adoption underway. Prime investment window.';
        case 'Peaking':
            return 'High interest level with stabilizing growth. Near maximum saturation.';
        case 'Declining':
            return 'Downward trend with fading interest. Consider alternative trends.';
        case 'Niche':
            return 'Limited broad appeal. May be regional or subcultural phenomenon.';
    }
}

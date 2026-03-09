/**
 * Forecast Engine
 * Produces 1-month, 3-month, and 6-month forecasts for fashion industry
 * Uses linear extrapolation with strong damping (fashion trends plateau over time)
 */

export interface ForecastResult {
    months: number;
    score: number;
    changePercent: string;
    changeAbsolute: number;
    range: {
        lower: number;
        upper: number;
    };
}

export interface ForecastOutput {
    forecast1m: ForecastResult;
    forecast3m: ForecastResult;
    forecast6m: ForecastResult;
    methodology: string;
    assumptions: string[];
}

/**
 * Generate fashion industry forecasts (1M, 3M, 6M)
 */
export function generateForecast(
    currentScore: number,
    velocity: number,          // % per week
    volatility: number          // Standard deviation
): ForecastOutput {

    const forecast1m = forecastForMonths(currentScore, velocity, volatility, 1);
    const forecast3m = forecastForMonths(currentScore, velocity, volatility, 3);
    const forecast6m = forecastForMonths(currentScore, velocity, volatility, 6);

    return {
        forecast1m,
        forecast3m,
        forecast6m,
        methodology: 'Statistical forecast using velocity-based extrapolation with exponential damping calibrated for fashion trend lifecycles',
        assumptions: [
            'Assumes current momentum continues but decays over time',
            'Fashion trends plateau - not linear growth forever',
            'Damping increases with forecast horizon (6M more dampened than 1M)',
            'Seasonal factors may cause variance not captured in model',
            'Black swan events (viral moments) not predictable'
        ]
    };
}

/**
 * Forecast for specific number of months
 * Fashion-appropriate damping: trends don't grow linearly for months
 */
function forecastForMonths(
    currentScore: number,
    velocity: number,        // Weekly velocity %
    volatility: number,
    months: number
): ForecastResult {

    const days = months * 30; // Approximate days
    const weeks = days / 7;

    // Convert velocity from weekly % to total change over period
    // But apply STRONG damping - fashion trends plateau

    // Damping factor - much stronger for longer periods
    // 1 month: ~0.75 (25% decay)
    // 3 months: ~0.50 (50% decay)
    // 6 months: ~0.30 (70% decay)
    const dampingFactor = Math.pow(0.85, months);

    // Calculate raw forecast
    const weeklyChange = (currentScore * velocity) / 100;
    const totalChange = weeklyChange * weeks * dampingFactor;
    const rawForecast = currentScore + totalChange;

    // Ensure forecast stays within 0-100 bounds
    const boundedForecast = Math.max(0, Math.min(100, rawForecast));

    // Confidence range widens with forecast horizon
    // 1 month: ±volatility
    // 3 months: ±(volatility * 1.5)
    // 6 months: ±(volatility * 2)
    const rangeMultiplier = 1 + (months / 6);
    const rangeFactor = Math.min(volatility * rangeMultiplier, 25); // Cap at ±25 points

    const lowerBound = Math.max(0, boundedForecast - rangeFactor);
    const upperBound = Math.min(100, boundedForecast + rangeFactor);

    // Calculate change
    const changeAbsolute = boundedForecast - currentScore;
    const changePercent = currentScore > 0
        ? ((changeAbsolute / currentScore) * 100).toFixed(0)
        : '0';

    return {
        months,
        score: Math.round(boundedForecast),
        changePercent: changePercent.startsWith('-') ? changePercent : `+${changePercent}`,
        changeAbsolute: Math.round(changeAbsolute),
        range: {
            lower: Math.round(lowerBound),
            upper: Math.round(upperBound)
        }
    };
}

/**
 * Apply seasonality adjustment for fashion trends
 * Different categories peak at different times of year
 */
export function applySeasonalityAdjustment(
    forecast: number,
    currentMonth: number,
    targetMonth: number,
    category: string
): number {

    // Seasonal multipliers by category
    const seasonalPatterns: { [key: string]: number[] } = {
        // Index = month (0-11), Value = multiplier (0.8 - 1.2)
        'winter': [1.2, 1.2, 1.1, 0.9, 0.8, 0.8, 0.8, 0.8, 0.9, 1.0, 1.1, 1.2],
        'summer': [0.8, 0.8, 0.9, 1.0, 1.1, 1.2, 1.2, 1.2, 1.1, 1.0, 0.9, 0.8],
        'fall': [0.9, 0.8, 0.8, 0.9, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0],
        'spring': [1.0, 0.9, 1.1, 1.2, 1.2, 1.1, 1.0, 0.9, 0.9, 0.9, 0.9, 1.0]
    };

    // Default: no seasonal adjustment for now (Phase 3)
    // Would detect category and apply appropriate pattern

    return forecast;
}

/**
 * Get forecast confidence level
 */
export function getForecastConfidenceLevel(
    volatility: number,
    dataQuality: number,
    months: number
): 'High' | 'Medium-High' | 'Medium' | 'Low-Medium' | 'Low' {

    // Confidence decreases with forecast horizon
    const horizonPenalty = 1 - (months / 12); // 1M = 0.92, 6M = 0.50
    const score = (1 - Math.min(volatility / 30, 1)) * dataQuality * horizonPenalty;

    if (score > 0.7) return 'High';
    if (score > 0.55) return 'Medium-High';
    if (score > 0.35) return 'Medium';
    if (score > 0.20) return 'Low-Medium';
    return 'Low';
}

/**
 * Interpret forecast direction
 */
export function interpretForecastDirection(changePercent: number, months: number): string {
    const horizon = months === 1 ? '1 month' : `${months} months`;

    if (changePercent > 30) return `Strong upward trajectory over ${horizon}`;
    if (changePercent > 15) return `Moderate growth expected in ${horizon}`;
    if (changePercent > 5) return `Slight increase anticipated over ${horizon}`;
    if (changePercent > -5) return `Stable trend over ${horizon}`;
    if (changePercent > -15) return `Slight decrease expected in ${horizon}`;
    if (changePercent > -30) return `Moderate decline expected over ${horizon}`;
    return `Significant decline expected over ${horizon}`;
}

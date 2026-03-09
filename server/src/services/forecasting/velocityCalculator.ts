/**
 * Velocity Calculator
 * Calculates trend velocity (WoW change) and acceleration (change in velocity)
 */

export interface VelocityMetrics {
    velocity: number;           // Week-over-week % change
    acceleration: number;       // Change in velocity
    volatility: number;         // Standard deviation
    direction: 'up' | 'down' | 'stable';
    momentum: 'accelerating' | 'decelerating' | 'steady';
}

export interface TimeSeriesPoint {
    date: string;
    value: number;
}

/**
 * Calculate week-over-week velocity from time series data
 */
export function calculateVelocity(timeSeriesData: TimeSeriesPoint[]): number {
    if (timeSeriesData.length < 14) {
        // Not enough data for WoW comparison
        return 0;
    }

    // Get last 7 days (current week)
    const currentWeek = timeSeriesData.slice(-7);
    const currentWeekAvg = average(currentWeek.map(p => p.value));

    // Get previous 7 days (last week)
    const previousWeek = timeSeriesData.slice(-14, -7);
    const previousWeekAvg = average(previousWeek.map(p => p.value));

    if (previousWeekAvg === 0) return 0;

    // Calculate % change
    const velocity = ((currentWeekAvg - previousWeekAvg) / previousWeekAvg) * 100;

    return Math.round(velocity * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate acceleration (change in velocity)
 */
export function calculateAcceleration(timeSeriesData: TimeSeriesPoint[]): number {
    if (timeSeriesData.length < 21) {
        // Need 3 weeks for acceleration
        return 0;
    }

    // Current week vs previous week
    const recentVelocity = calculateVelocityBetween(
        timeSeriesData.slice(-14, -7),
        timeSeriesData.slice(-7)
    );

    // Previous week vs week before that
    const olderVelocity = calculateVelocityBetween(
        timeSeriesData.slice(-21, -14),
        timeSeriesData.slice(-14, -7)
    );

    const acceleration = recentVelocity - olderVelocity;

    return Math.round(acceleration * 10) / 10;
}

/**
 * Helper: Calculate velocity between two periods
 */
function calculateVelocityBetween(period1: TimeSeriesPoint[], period2: TimeSeriesPoint[]): number {
    const avg1 = average(period1.map(p => p.value));
    const avg2 = average(period2.map(p => p.value));

    if (avg1 === 0) return 0;

    return ((avg2 - avg1) / avg1) * 100;
}

/**
 * Calculate signal volatility (standard deviation)
 */
export function calculateVolatility(timeSeriesData: TimeSeriesPoint[]): number {
    if (timeSeriesData.length < 7) return 0;

    const recent = timeSeriesData.slice(-30); // Last 30 days
    const values = recent.map(p => p.value);

    return standardDeviation(values);
}

/**
 * Determine trend direction
 */
export function getTrendDirection(velocity: number): 'up' | 'down' | 'stable' {
    if (velocity > 5) return 'up';
    if (velocity < -5) return 'down';
    return 'stable';
}

/**
 * Determine momentum state
 */
export function getMomentum(acceleration: number): 'accelerating' | 'decelerating' | 'steady' {
    if (acceleration > 2) return 'accelerating';
    if (acceleration < -2) return 'decelerating';
    return 'steady';
}

/**
 * Calculate all velocity metrics from Google Trends historical data
 */
export function calculateVelocityMetrics(trendsData: any): VelocityMetrics {
    const timeSeriesData = extractTimeSeriesFromTrends(trendsData);

    if (timeSeriesData.length < 14) {
        // Not enough data - return default
        return {
            velocity: 0,
            acceleration: 0,
            volatility: 0,
            direction: 'stable',
            momentum: 'steady'
        };
    }

    const velocity = calculateVelocity(timeSeriesData);
    const acceleration = calculateAcceleration(timeSeriesData);
    const volatility = calculateVolatility(timeSeriesData);
    const direction = getTrendDirection(velocity);
    const momentum = getMomentum(acceleration);

    return {
        velocity,
        acceleration,
        volatility,
        direction,
        momentum
    };
}

/**
 * Extract time series points from Google Trends data
 */
function extractTimeSeriesFromTrends(trendsData: any): TimeSeriesPoint[] {
    if (!trendsData?.interest_over_time) return [];

    try {
        const timelineData = Array.isArray(trendsData.interest_over_time)
            ? trendsData.interest_over_time
            : trendsData.interest_over_time.timeline_data;

        if (!Array.isArray(timelineData)) return [];

        return timelineData.map((item: any) => ({
            date: item.date || item.time || '',
            value: item.values?.[0]?.value || item.value || item.interest || 0
        })).filter(p => p.value > 0);

    } catch (error) {
        console.error('Error extracting time series:', error);
        return [];
    }
}

/**
 * Utility: Calculate average of array
 */
function average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Utility: Calculate standard deviation
 */
function standardDeviation(numbers: number[]): number {
    if (numbers.length < 2) return 0;

    const avg = average(numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    const avgSquareDiff = average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
}

/**
 * Get velocity interpretation for humans
 */
export function interpretVelocity(velocity: number): string {
    if (velocity > 20) return 'Rapid growth';
    if (velocity > 10) return 'Strong growth';
    if (velocity > 5) return 'Moderate growth';
    if (velocity > -5) return 'Stable';
    if (velocity > -10) return 'Slight decline';
    if (velocity > -20) return 'Moderate decline';
    return 'Sharp decline';
}

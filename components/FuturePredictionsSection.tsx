import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FuturePredictionsSectionProps {
    topic: string;
    sentiment: { positive: number; neutral: number; negative: number };
    futureOutlook: string;
    forecast?: any;
    trendsData?: any;
}

/**
 * Generate forecast data from real API
 */
const generateForecastData = (realForecast?: any) => {
    if (!realForecast?.predictions || !Array.isArray(realForecast.predictions)) {
        return null;
    }

    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return realForecast.predictions.slice(0, 12).map((value: number, i: number) => {
        const monthIndex = (now.getMonth() + i) % 12;
        return {
            month: monthNames[monthIndex],
            value: Math.round(value)
        };
    });
};

/**
 * Calculate simple trend direction
 */
const getTrendDirection = (sentiment: { positive: number }, forecast?: any): 'up' | 'down' | 'stable' => {
    const score = sentiment.positive * 100;

    if (forecast?.predictions) {
        const first = forecast.predictions[0];
        const last = forecast.predictions[forecast.predictions.length - 1];
        if (last > first * 1.1) return 'up';
        if (last < first * 0.9) return 'down';
    }

    if (score >= 70) return 'up';
    if (score <= 40) return 'down';
    return 'stable';
};

const FuturePredictionsSection: React.FC<FuturePredictionsSectionProps> = ({
    sentiment,
    forecast
}) => {
    const forecastData = useMemo(() => generateForecastData(forecast), [forecast]);
    const direction = getTrendDirection(sentiment, forecast);
    const growthScore = Math.round(sentiment.positive * 100);

    return (
        <div className="space-y-6">
            {/* Minimalist Header with Key Metric */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-light text-stone-400 uppercase tracking-widest mb-2">
                        12-Month Outlook
                    </h3>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-extralight text-white">
                            {growthScore}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {direction === 'up' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                            {direction === 'down' && <TrendingDown className="w-5 h-5 text-rose-400" />}
                            {direction === 'stable' && <Minus className="w-5 h-5 text-stone-400" />}
                            <span className="text-sm font-light text-stone-400">
                                {direction === 'up' ? 'Growing' : direction === 'down' ? 'Declining' : 'Stable'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean Chart - Only if we have real data */}
            {forecastData ? (
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#292524" opacity={0.3} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#78716c', fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#78716c', fontSize: 11 }}
                                    domain={[0, 100]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#f59e0b' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-stone-500 text-center mt-4 font-light">
                        Search interest projection  based on historical data
                    </p>
                </div>
            ) : (
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-2xl p-12 border border-stone-800/50 text-center">
                    <p className="text-stone-500 font-light">Forecast data loading...</p>
                </div>
            )}

            {/* Simple Insight - No AI language */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-xl p-5 border border-stone-800/50">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-2">Market Signal</div>
                    <div className="text-lg font-light text-stone-200">
                        {growthScore >= 70 ? 'Strong momentum' : growthScore >= 50 ? 'Positive trend' : growthScore >= 35 ? 'Moderate interest' : 'Limited traction'}
                    </div>
                </div>
                <div className="bg-stone-900/40 backdrop-blur-sm rounded-xl p-5 border border-stone-800/50">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-2">Recommendation</div>
                    <div className="text-lg font-light text-stone-200">
                        {growthScore >= 70 ? 'High potential' : growthScore >= 50 ? 'Test & monitor' : 'Watch closely'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuturePredictionsSection;

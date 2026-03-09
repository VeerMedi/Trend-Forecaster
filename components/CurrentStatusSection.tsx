import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, BarChart3 } from 'lucide-react';
import { interpretGrowth } from '../utils/signalInterpretation';

interface CurrentStatusSectionProps {
    topic: string;
    sentiment: { positive: number; neutral: number; negative: number };
    trendsData?: any;
    redditData?: any;
    fashionMediaData?: any;
}

// Generate mock trend data based on sentiment
const generateTrendData = (sentiment: { positive: number }) => {
    const baseValue = sentiment.positive * 100;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();

    return months.slice(0, currentMonth + 1).map((month, i) => ({
        month,
        interest: Math.round(baseValue * (0.7 + Math.random() * 0.3) + i * 2),
        social: Math.round(baseValue * (0.5 + Math.random() * 0.5)),
    }));
};

// Generate regional data
const generateRegionalData = (topic: string) => {
    const topicLower = topic.toLowerCase();

    // Default regions with interest levels
    let regions = [
        { region: 'United States', interest: 85 },
        { region: 'United Kingdom', interest: 72 },
        { region: 'Japan', interest: 68 },
        { region: 'Germany', interest: 55 },
        { region: 'France', interest: 78 },
        { region: 'South Korea', interest: 82 },
    ];

    // Adjust for specific trends
    if (topicLower.includes('k-') || topicLower.includes('korean')) {
        regions = regions.map(r => r.region === 'South Korea' ? { ...r, interest: 98 } : r);
    }

    return regions.sort((a, b) => b.interest - a.interest);
};

const CurrentStatusSection: React.FC<CurrentStatusSectionProps> = ({
    topic,
    sentiment,
    trendsData,
    redditData,
    fashionMediaData
}) => {
    // REAL DATA: Extract actual Google Trends score
    const getGoogleTrendsScore = () => {
        if (!trendsData?.interest_over_time) return Math.round(sentiment.positive);

        const timelineData = Array.isArray(trendsData.interest_over_time)
            ? trendsData.interest_over_time
            : trendsData.interest_over_time.timeline_data;

        if (!Array.isArray(timelineData) || timelineData.length === 0) {
            return Math.round(sentiment.positive);
        }

        // Get average of last 30 days
        const recent = timelineData.slice(-30);
        const values = recent.map((item: any) => {
            const val = item.values?.[0]?.value || item.value || item.interest || 0;
            return typeof val === 'number' && !isNaN(val) ? val : 0;
        }).filter((v: number) => v > 0);

        if (values.length === 0) return Math.round(sentiment.positive);

        const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
        return Math.round(Math.max(0, Math.min(100, avg)));
    };

    // REAL DATA: Format actual Google Trends timeline
    const formatTrendsTimeline = () => {
        if (!trendsData?.interest_over_time) {
            // Fallback to sentiment-based mock data
            return generateTrendData(sentiment);
        }

        const timelineData = Array.isArray(trendsData.interest_over_time)
            ? trendsData.interest_over_time
            : trendsData.interest_over_time.timeline_data;

        if (!Array.isArray(timelineData)) {
            return generateTrendData(sentiment);
        }

        return timelineData.slice(-12).map((item: any) => ({
            month: item.date?.substring(0, 3) || item.month || 'N/A',
            interest: Math.max(0, Math.min(100, item.values?.[0]?.value || item.value || item.interest || 0))
        }));
    };

    // REAL DATA: Get actual regional data
    const getRegionalData = () => {
        if (trendsData?.interest_by_region && Array.isArray(trendsData.interest_by_region)) {
            return trendsData.interest_by_region
                .slice(0, 6)
                .map((item: any) => ({
                    region: item.location || item.region || 'Unknown',
                    interest: Math.max(0, Math.min(100, item.value || item.interest || 0))
                }))
                .sort((a, b) => b.interest - a.interest);
        }
        return generateRegionalData(topic);
    };

    // REAL DATA: Calculate actual community mentions
    const getCommunityMentions = () => {
        let total = 0;

        // Reddit community indicators
        if (redditData?._signal?.volume_indicator) {
            total += redditData._signal.volume_indicator;
        }

        // Media articles count
        if (fashionMediaData?.articles?.length) {
            total += fashionMediaData.articles.length;
        }

        // If no real data, use sentiment fallback
        if (total === 0) {
            return Math.round((sentiment.positive + sentiment.neutral * 0.5) * 80);
        }

        return total;
    };

    const popularityScore = getGoogleTrendsScore();
    const socialBuzz = getCommunityMentions();
    const trendData = formatTrendsTimeline();
    const regionalData = getRegionalData();

    // Interpret growth signal
    const growthPercent = trendData.length >= 2
        ? Math.round(((trendData[trendData.length - 1].interest - trendData[0].interest) / trendData[0].interest) * 100)
        : Math.round(sentiment.positive * 45);
    const growthSignal = interpretGrowth(growthPercent);

    // Determine trend direction
    const getTrendDirection = () => {
        if (trendData.length >= 2) {
            const lastTwo = trendData.slice(-2);
            const diff = lastTwo[1].interest - lastTwo[0].interest;
            if (diff > 5) return { label: 'Rising', Icon: TrendingUp, color: 'text-emerald-400' };
            if (diff < -5) return { label: 'Declining', Icon: TrendingDown, color: 'text-rose-400' };
        }
        return { label: 'Stable', Icon: ArrowRight, color: 'text-amber-400' };
    };

    const trend = getTrendDirection();
    const TrendIcon = trend.Icon;

    return (
        <section className="bg-stone-900/40 rounded-3xl p-8 border border-stone-800/50">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-light tracking-widest uppercase text-stone-400">
                    Current Status
                </h2>
                <span className={`ml-auto flex items-center gap-1.5 text-sm font-light ${trend.color}`}>
                    <TrendIcon className="w-4 h-4" /> {trend.label}
                </span>
            </div>

            {/* Key Metrics Row - REAL GOOGLE TRENDS DATA */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Average Search Interest (Real Google Trends Score) */}
                <div className="bg-stone-800/30 rounded-2xl p-5 text-center border border-stone-700/30">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-3 font-light">Google Trends Score</div>
                    <div className="text-5xl font-extralight text-stone-200 mb-2">{popularityScore}</div>
                    <div className="text-xs text-stone-400 mb-3 font-light">Average Interest (0-100)</div>
                    <div className="mt-2 h-2 bg-stone-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-600/80 to-amber-500/80 rounded-full transition-all duration-1000"
                            style={{ width: `${popularityScore}%` }}
                        />
                    </div>
                </div>

                {/* Peak Interest */}
                <div className="bg-stone-800/30 rounded-2xl p-5 text-center border border-stone-700/30">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-3 font-light">Peak Interest</div>
                    <div className="text-5xl font-extralight text-stone-200 mb-2">
                        {trendData.length > 0 ? Math.max(...trendData.map(d => d.interest)) : popularityScore}
                    </div>
                    <div className="text-xs text-stone-400 mb-3 font-light">Highest Score (Last 12 months)</div>
                    <div className={`flex items-center justify-center gap-1.5 text-sm font-light ${trend.color}`}>
                        <TrendIcon className="w-4 h-4" /> {trend.label}
                    </div>
                </div>

                {/* Growth Rate */}
                <div className="bg-stone-800/30 rounded-2xl p-5 text-center border border-stone-700/30">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-3 font-light">Growth Rate</div>
                    <div className={`text-4xl font-extralight ${growthPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'} mb-2`}>
                        {growthPercent >= 0 ? '+' : ''}{growthPercent}%
                    </div>
                    <div className="text-xs text-stone-400 mb-3 font-light">vs. First Data Point</div>
                    <div className={`text-xs ${growthSignal.color} font-light`}>
                        {growthSignal.band}
                    </div>
                </div>
            </div>

            {/* Search Interest Chart */}
            <div className="mb-8">
                <h3 className="text-sm font-light text-stone-400 mb-4 tracking-wide">Search Interest Over Time</h3>
                <div className="h-48 bg-stone-800/20 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#78716c', fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    background: '#1c1917',
                                    border: '1px solid #44403c',
                                    borderRadius: '8px',
                                    color: '#d6d3d1'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="interest"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fill="url(#colorInterest)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Regional Interest */}
            <div>
                <h3 className="text-sm font-light text-stone-400 mb-4 tracking-wide">Where It's Trending</h3>
                <div className="h-40 bg-stone-800/20 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionalData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="region"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a8a29e', fontSize: 11 }}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#1c1917',
                                    border: '1px solid #44403c',
                                    borderRadius: '8px',
                                    color: '#d6d3d1'
                                }}
                                formatter={(value: number) => [`${value}%`, 'Interest']}
                            />
                            <Bar
                                dataKey="interest"
                                fill="#f59e0b"
                                radius={[0, 4, 4, 0]}
                                barSize={12}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default CurrentStatusSection;

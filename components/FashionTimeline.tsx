import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface FashionTimelineProps {
    trend: string;
    data?: { date: string; value: number }[];
}

// Generate organic timeline data
const generateTimelineData = () => {
    const points = 12;
    const data = [];
    let value = 30 + Math.random() * 20;

    for (let i = 0; i < points; i++) {
        // Organic growth with slight variation
        value = Math.min(95, Math.max(20, value + (Math.random() - 0.3) * 8 + 2));
        data.push({
            point: i,
            value: Math.round(value),
        });
    }
    return data;
};

// Generate momentum caption
const getMomentumCaption = (data: { value: number }[]): string => {
    const first = data[0]?.value || 50;
    const last = data[data.length - 1]?.value || 50;
    const change = last - first;

    if (change > 25) return 'Strong momentum building since early winter';
    if (change > 15) return 'Interest increasing steadily since early spring';
    if (change > 5) return 'Gradual movement through the season';
    if (change > -5) return 'Holding steady this season';
    return 'Consolidating after earlier momentum';
};

const FashionTimeline: React.FC<FashionTimelineProps> = ({ trend }) => {
    const timelineData = generateTimelineData();
    const caption = getMomentumCaption(timelineData);

    return (
        <section className="py-12">
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-stone-500 mb-2">
                    Trend Momentum
                </h2>
                <p className="text-stone-400 font-light text-lg">
                    How this direction is moving over time
                </p>
            </div>

            {/* Timeline Container */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-stone-900/20 rounded-3xl p-8 border border-stone-800/30">

                    {/* Minimal Line Chart */}
                    <div className="h-32 md:h-40 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#78716c" stopOpacity={0.4} />
                                        <stop offset="50%" stopColor="#d6d3d1" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#fbbf24" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#lineGradient)"
                                    strokeWidth={3}
                                    dot={false}
                                    strokeLinecap="round"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Timeline Labels */}
                    <div className="flex justify-between items-center px-4">
                        <span className="text-xs text-stone-600 font-light">Earlier this season</span>
                        <span className="text-xs text-stone-600 font-light">Now</span>
                    </div>

                    {/* Caption */}
                    <div className="mt-8 text-center">
                        <p className="text-stone-300 font-light text-sm italic">
                            {caption}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FashionTimeline;

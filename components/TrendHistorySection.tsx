import React from 'react';
import { Lightbulb, ScrollText } from 'lucide-react';

interface TrendHistorySectionProps {
    topic: string;
}

// Generate historical context based on topic
const generateHistory = (topic: string) => {
    const topicLower = topic.toLowerCase();

    // Default milestones that will be customized
    let origin = 'Mid-20th century fashion evolution';
    let originYear = '1950s';
    let culturalContext = 'Emerged from practical workwear and evolved into mainstream fashion through cultural movements and celebrity influence.';

    const milestones: Array<{ year: string; event: string; type: 'origin' | 'peak' | 'evolution' | 'revival' }> = [];

    // Customize based on trend type
    if (topicLower.includes('cargo') || topicLower.includes('baggy')) {
        origin = 'Military uniforms of World War II';
        originYear = '1940s';
        culturalContext = 'Originally designed for soldiers needing to carry equipment, cargo pants transitioned to civilian workwear before becoming a fashion statement.';
        milestones.push(
            { year: '1940s', event: 'Invented for British military paratroopers', type: 'origin' },
            { year: '1990s', event: 'Hip-hop culture embraces baggy cargo pants', type: 'peak' },
            { year: '2000s', event: 'Mainstream adoption, worn by everyone', type: 'evolution' },
            { year: '2010s', event: 'Slim-fit trend pushes cargos out', type: 'evolution' },
            { year: '2023+', event: 'Y2K revival brings back wide-leg styles', type: 'revival' }
        );
    } else if (topicLower.includes('denim') || topicLower.includes('jeans')) {
        origin = 'American workwear for miners and laborers';
        originYear = '1870s';
        culturalContext = 'Levi Strauss invented riveted denim pants for Gold Rush workers. Hollywood and youth rebellion transformed jeans into a cultural icon.';
        milestones.push(
            { year: '1873', event: 'Levi Strauss patents riveted jeans', type: 'origin' },
            { year: '1950s', event: 'James Dean makes jeans rebellious cool', type: 'peak' },
            { year: '1980s', event: 'Designer jeans become status symbols', type: 'evolution' },
            { year: '2020s', event: 'Sustainable denim and vintage washes trend', type: 'revival' }
        );
    } else if (topicLower.includes('shirt') || topicLower.includes('button')) {
        origin = 'European aristocratic undergarments';
        originYear = '1600s';
        culturalContext = 'Originally worn beneath suits as undergarments, shirts evolved into standalone fashion pieces with the rise of business casual culture.';
        milestones.push(
            { year: '1600s', event: 'White linen shirts worn by nobility', type: 'origin' },
            { year: '1920s', event: 'Oxford button-downs for sportswear', type: 'evolution' },
            { year: '1980s', event: 'Power dressing makes shirts essential', type: 'peak' },
            { year: '2020s', event: 'Oversized and sustainable shirts trend', type: 'revival' }
        );
    } else if (topicLower.includes('sneaker') || topicLower.includes('shoe')) {
        origin = 'Athletic footwear for sports';
        originYear = '1890s';
        culturalContext = 'From basketball courts to fashion runways, sneakers evolved from performance wear to status symbols worth thousands.';
        milestones.push(
            { year: '1917', event: 'Converse All-Stars debut for basketball', type: 'origin' },
            { year: '1984', event: 'Air Jordan changes sneaker culture forever', type: 'peak' },
            { year: '2010s', event: 'Luxury sneakers by Balenciaga, Gucci', type: 'evolution' },
            { year: '2023+', event: 'Retro silhouettes and collabs dominate', type: 'revival' }
        );
    } else {
        // Generic fashion trend milestones
        milestones.push(
            { year: '1960s', event: 'Youth culture begins driving fashion', type: 'origin' },
            { year: '1980s', event: 'Television and MTV influence style', type: 'evolution' },
            { year: '2000s', event: 'Fast fashion makes trends accessible', type: 'peak' },
            { year: '2020s', event: 'Social media accelerates trend cycles', type: 'revival' }
        );
    }

    return { origin, originYear, culturalContext, milestones };
};

const TrendHistorySection: React.FC<TrendHistorySectionProps> = ({ topic }) => {
    const history = generateHistory(topic);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'origin': return 'bg-amber-900/40 border-amber-600/50 text-amber-300';
            case 'peak': return 'bg-emerald-900/40 border-emerald-600/50 text-emerald-300';
            case 'evolution': return 'bg-blue-900/40 border-blue-600/50 text-blue-300';
            case 'revival': return 'bg-violet-900/40 border-violet-600/50 text-violet-300';
            default: return 'bg-stone-800/40 border-stone-600/50 text-stone-300';
        }
    };

    return (
        <section className="bg-gradient-to-br from-amber-950/20 to-stone-950 rounded-3xl p-8 border border-amber-900/30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <ScrollText className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-amber-400/80">
                    History & Origins
                </h2>
            </div>

            {/* Origin Story */}
            <div className="mb-10">
                <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-light text-amber-300">{history.originYear}</span>
                    <span className="text-stone-400 font-light">— When it all began</span>
                </div>
                <h3 className="text-2xl font-light text-white mb-3">{history.origin}</h3>
                <p className="text-stone-400 font-light leading-relaxed">
                    {history.culturalContext}
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                <h4 className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-6">
                    Key Milestones
                </h4>

                {/* Timeline line */}
                <div className="absolute left-[7px] top-16 bottom-4 w-0.5 bg-gradient-to-b from-amber-600/50 via-stone-700 to-violet-600/50" />

                {/* Milestones */}
                <div className="space-y-6">
                    {history.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-4 relative">
                            {/* Dot */}
                            <div className={`w-4 h-4 rounded-full border-2 ${getTypeStyles(milestone.type)} flex-shrink-0 mt-1`} />

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-lg font-medium text-stone-200">{milestone.year}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyles(milestone.type)}`}>
                                        {milestone.type}
                                    </span>
                                </div>
                                <p className="text-stone-400 font-light">{milestone.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fun Fact */}
            <div className="mt-8 p-4 bg-amber-900/20 rounded-xl border border-amber-800/30">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium text-sm">Did you know?</span>
                </div>
                <p className="text-stone-300 font-light text-sm">
                    Fashion trends typically cycle every 20-30 years. What was popular in the 90s is trending again today!
                </p>
            </div>
        </section>
    );
};

export default TrendHistorySection;

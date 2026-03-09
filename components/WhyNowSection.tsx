import React from 'react';

interface WhyNowSectionProps {
    topic: string;
    sentiment: { positive: number; neutral: number; negative: number };
}

// Generate cultural driver based on trend
const getCulturalDriver = (topic: string): string => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('sustain') || topicLower.includes('eco') || topicLower.includes('organic')) {
        return 'Climate anxiety has moved from fringe concern to mainstream purchasing criteria. Consumers—especially under 35—now openly reject brands without transparent supply chains.';
    }
    if (topicLower.includes('minimal') || topicLower.includes('quiet') || topicLower.includes('clean')) {
        return 'Post-pandemic exhaustion with maximalism has created space for restraint. The shift reflects broader rejection of conspicuous consumption in favor of considered curation.';
    }
    if (topicLower.includes('y2k') || topicLower.includes('2000') || topicLower.includes('retro')) {
        return "Gen Z's nostalgia for an era they didn't experience mirrors the 90s revival of the 2010s. Digital natives romanticize pre-smartphone aesthetics as rebellion against current tech saturation.";
    }
    if (topicLower.includes('oversized') || topicLower.includes('baggy') || topicLower.includes('wide')) {
        return 'Remote work normalized comfort-first dressing. The silhouette shift also represents generational rejection of body-conscious norms that dominated the 2010s.';
    }
    if (topicLower.includes('gender') || topicLower.includes('fluid') || topicLower.includes('neutral')) {
        return "Younger consumers increasingly refuse binary categories. This isn't political posturing—it's foundational identity expression reflected in wardrobe building.";
    }
    if (topicLower.includes('craft') || topicLower.includes('artisan') || topicLower.includes('handmade')) {
        return 'AI ubiquity has made human imperfection newly valuable. Consumers seek proof of maker involvement as counterweight to algorithmic uniformity.';
    }

    return 'Shifting cultural values and economic realities are converging to make this moment uniquely receptive to this aesthetic direction.';
};

// Generate styling contrast explanation
const getStylingContrast = (topic: string): string => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('skinny') || topicLower.includes('fitted') || topicLower.includes('tailored')) {
        return "After a decade of oversized silhouettes dominating, fitted pieces now read as intentional restraint rather than dated uniformity. They're being styled as contrast, not standalone looks.";
    }
    if (topicLower.includes('bright') || topicLower.includes('bold') || topicLower.includes('color')) {
        return "Muted palettes have saturated for long enough that vivid color now feels like rebellion. It's being deployed strategically—one statement piece among neutrals—not head-to-toe saturation.";
    }
    if (topicLower.includes('minimal') || topicLower.includes('quiet')) {
        return 'Minimalism works now because it sits in opposition to logo-heavy streetwear. The contrast makes both more legible—clean lines gain meaning against graphic chaos.';
    }

    return 'This direction gains resonance by existing in tension with recent dominant aesthetics, not by replacing them wholesale.';
};

// Generate cycle reasoning (20-30 year rule)
const getCycleReasoning = (topic: string): string => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('90s') || topicLower.includes('grunge') || topicLower.includes('minimalist')) {
        return "We're 25-30 years past peak 90s minimalism. Trends reliably resurface when they're distant enough to feel fresh but recent enough for archival reference. This isn't coincidence—it's cyclical inevitability.";
    }
    if (topicLower.includes('y2k') || topicLower.includes('2000')) {
        return "Twenty years post-Y2K, we're hitting the cultural sweet spot where early 2000s aesthetics feel both nostalgic and novel. The cycle repeats with each generation reclaiming the decade before their formative years.";
    }
    if (topicLower.includes('80s') || topicLower.includes('power')) {
        return "Strong shoulders and structured tailoring last peaked in the late 80s. Three decades later, we're culturally positioned for their return—familiar enough to reference, distant enough to reinterpret.";
    }
    if (topicLower.includes('70s') || topicLower.includes('boho') || topicLower.includes('flare')) {
        return 'Bohemian codes resurface reliably every 20-30 years when economic uncertainty meets social upheaval. The 70s revival of the 00s is now giving way to a new interpretation for the 20s.';
    }

    return "Fashion operates in 20-30 year cycles. This timing isn't random—it's when trends become distant enough to reinterpret without feeling derivative.";
};

// Generate tech/sustainability shift
const getTechSustainabilityShift = (topic: string): string => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('tech') || topicLower.includes('smart') || topicLower.includes('digital')) {
        return 'Wearable tech is finally moving beyond fitness trackers. Garments with integrated function are shedding the "prototype" aesthetic for actual design consideration.';
    }
    if (topicLower.includes('sustain') || topicLower.includes('recycled') || topicLower.includes('circular')) {
        return 'Resale infrastructure has matured enough to support circular models at scale. What was niche virtue-signaling in 2015 is now basic market expectation from major retailers.';
    }
    if (topicLower.includes('craft') || topicLower.includes('slow')) {
        return 'Supply chain transparency tools now allow consumers to verify maker claims. Technology is enabling rather than replacing craft—digital traceability validates artisan authenticity.';
    }
    if (topicLower.includes('vintage') || topicLower.includes('archive')) {
        return "Online resale platforms have democratized access to archived pieces. What required collectors' networks in the 90s is now searchable inventory, fundamentally changing how trends resurface.";
    }

    return "New production methods and distribution channels are enabling what wasn't commercially viable five years ago. The infrastructure now exists to support this at scale.";
};

const WhyNowSection: React.FC<WhyNowSectionProps> = ({ topic, sentiment }) => {
    const culturalDriver = getCulturalDriver(topic);
    const stylingContrast = getStylingContrast(topic);
    const cycleReasoning = getCycleReasoning(topic);
    const techShift = getTechSustainabilityShift(topic);

    return (
        <section className="bg-gradient-to-br from-amber-950/20 to-stone-950 rounded-3xl p-8 border border-amber-900/30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <span className="text-2xl">⏰</span>
                <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-amber-400/80">
                    Why This Is Happening Now
                </h2>
            </div>

            {/* Content Grid */}
            <div className="space-y-6">
                {/* Cultural Driver */}
                <div className="bg-stone-900/40 rounded-2xl p-6 border border-stone-800/40">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🌍</span>
                        <h3 className="text-sm font-medium text-amber-300 uppercase tracking-wider">Cultural Driver</h3>
                    </div>
                    <p className="text-stone-300 font-light leading-relaxed">
                        {culturalDriver}
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Styling Contrast */}
                    <div className="bg-stone-900/40 rounded-2xl p-6 border border-stone-800/40">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">⚖️</span>
                            <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Styling Contrast</h3>
                        </div>
                        <p className="text-stone-300 font-light leading-relaxed text-sm">
                            {stylingContrast}
                        </p>
                    </div>

                    {/* Tech/Sustainability Shift */}
                    <div className="bg-stone-900/40 rounded-2xl p-6 border border-stone-800/40">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🔄</span>
                            <h3 className="text-sm font-medium text-emerald-300 uppercase tracking-wider">Infrastructure Shift</h3>
                        </div>
                        <p className="text-stone-300 font-light leading-relaxed text-sm">
                            {techShift}
                        </p>
                    </div>
                </div>

                {/* Cycle Reasoning */}
                <div className="bg-amber-900/10 rounded-2xl p-6 border border-amber-800/30">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🔁</span>
                        <h3 className="text-sm font-medium text-amber-300 uppercase tracking-wider">20–30 Year Cycle</h3>
                    </div>
                    <p className="text-stone-300 font-light leading-relaxed">
                        {cycleReasoning}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhyNowSection;

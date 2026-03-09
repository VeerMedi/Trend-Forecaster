import React from 'react';
import DesignerTakeaway from './DesignerTakeaway';

interface StyleSuggestionsSectionProps {
    topic: string;
}

// Generate style suggestions based on topic
const generateSuggestions = (topic: string) => {
    const topicLower = topic.toLowerCase();

    let outfitIdeas: Array<{ title: string; items: string[]; occasion: string }> = [];
    let recommendedColors: Array<{ name: string; hex: string }> = [];
    let complementaryPieces: string[] = [];
    let avoidList: string[] = [];
    let proTips: string[] = [];

    // Cargo pants / baggy pants
    if (topicLower.includes('cargo') || topicLower.includes('baggy') || topicLower.includes('pant')) {
        outfitIdeas = [
            { title: 'Casual Weekend', items: ['Baggy cargo pants', 'Fitted white tee', 'Chunky sneakers', 'Baseball cap'], occasion: 'Everyday' },
            { title: 'Street Style', items: ['Black cargos', 'Oversized hoodie', 'High-top sneakers', 'Crossbody bag'], occasion: 'Going out' },
            { title: 'Smart Casual', items: ['Olive cargos', 'Tucked linen shirt', 'Loafers', 'Minimal watch'], occasion: 'Semi-formal' },
        ];
        recommendedColors = [
            { name: 'Olive Green', hex: '#556B2F' },
            { name: 'Khaki', hex: '#C3B091' },
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Stone', hex: '#8B8378' },
        ];
        complementaryPieces = ['Fitted tops to balance volume', 'Platform sneakers', 'Cropped jackets', 'Belt bags', 'Tank tops'];
        avoidList = ['Oversized tops (too much volume)', 'Very slim shoes', 'Formal blazers', 'Delicate jewelry'];
        proTips = ['Balance proportions: baggy bottom = fitted top', 'Cuff the hem for a cleaner look', 'Low-rise works best with crop tops'];
    }
    // Shirts
    else if (topicLower.includes('shirt') || topicLower.includes('button')) {
        outfitIdeas = [
            { title: 'Business Casual', items: ['Oxford shirt', 'Chinos', 'Leather loafers', 'Leather belt'], occasion: 'Office' },
            { title: 'Relaxed Weekend', items: ['Oversized linen shirt', 'Wide-leg pants', 'Sandals', 'Tote bag'], occasion: 'Brunch' },
            { title: 'Date Night', items: ['Silk button-up', 'Dark jeans', 'Chelsea boots', 'Minimal chain'], occasion: 'Evening' },
        ];
        recommendedColors = [
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Light Blue', hex: '#ADD8E6' },
            { name: 'Navy', hex: '#000080' },
            { name: 'Sage', hex: '#9DC183' },
        ];
        complementaryPieces = ['Well-fitted trousers', 'Leather accessories', 'Statement watch', 'Quality undershirt', 'Rolled sleeves'];
        avoidList = ['Visible undershirt lines', 'Too tight fit', 'Mismatched formality', 'Wrinkled fabric'];
        proTips = ['Third button should hit your natural waist', 'Invest in quality fabrics', 'French tuck for casual looks'];
    }
    // Default fashion suggestions
    else {
        outfitIdeas = [
            { title: 'Everyday Casual', items: ['Quality basics', 'Well-fitted jeans', 'Clean sneakers', 'Simple accessories'], occasion: 'Daily' },
            { title: 'Elevated Casual', items: ['Layered neutrals', 'Tailored pants', 'Leather shoes', 'Statement piece'], occasion: 'Going out' },
            { title: 'Weekend Vibes', items: ['Comfortable knit', 'Relaxed pants', 'Platform shoes', 'Sunglasses'], occasion: 'Leisure' },
        ];
        recommendedColors = [
            { name: 'Neutral Beige', hex: '#D2B48C' },
            { name: 'Classic Navy', hex: '#000080' },
            { name: 'Soft White', hex: '#FAF9F6' },
            { name: 'Charcoal', hex: '#36454F' },
        ];
        complementaryPieces = ['Quality basics', 'Versatile outerwear', 'Timeless accessories', 'Comfortable footwear'];
        avoidList = ['Overly trendy pieces without classics', 'Poor fit', 'Clashing patterns', 'Over-accessorizing'];
        proTips = ['Fit is everything', 'Build a capsule wardrobe first', 'Invest in quality over quantity'];
    }

    return { outfitIdeas, recommendedColors, complementaryPieces, avoidList, proTips };
};

const StyleSuggestionsSection: React.FC<StyleSuggestionsSectionProps> = ({ topic }) => {
    const suggestions = generateSuggestions(topic);

    return (
        <section className="bg-gradient-to-br from-emerald-950/20 to-stone-950 rounded-3xl p-8 border border-emerald-900/30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <span className="text-2xl">👕</span>
                <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-emerald-400/80">
                    How to Style It
                </h2>
                <span className="ml-auto text-xs text-stone-500 bg-stone-800/50 px-3 py-1 rounded-full">
                    Beginner Friendly
                </span>
            </div>

            {/* Outfit Ideas */}
            <div className="mb-8">
                <h3 className="text-lg font-light text-white mb-4">Complete Outfit Ideas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {suggestions.outfitIdeas.map((outfit, i) => (
                        <div key={i} className="bg-stone-800/30 rounded-2xl p-5 hover:bg-stone-800/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-emerald-300 font-medium">{outfit.title}</h4>
                                <span className="text-xs text-stone-500 bg-stone-700/50 px-2 py-0.5 rounded">
                                    {outfit.occasion}
                                </span>
                            </div>
                            <ul className="space-y-1.5">
                                {outfit.items.map((item, j) => (
                                    <li key={j} className="text-stone-300 font-light text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Recommendations */}
            <div className="mb-8">
                <h3 className="text-lg font-light text-white mb-4">Recommended Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {suggestions.recommendedColors.map((color, i) => (
                        <div key={i} className="flex items-center gap-2 bg-stone-800/30 rounded-full px-4 py-2">
                            <div
                                className="w-6 h-6 rounded-full border-2 border-stone-600"
                                style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-stone-300 text-sm font-light">{color.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Complementary Pieces */}
                <div className="bg-emerald-900/20 rounded-2xl p-5 border border-emerald-800/20">
                    <h4 className="text-emerald-300 font-medium mb-3 flex items-center gap-2">
                        ✅ Pairs Well With
                    </h4>
                    <ul className="space-y-2">
                        {suggestions.complementaryPieces.map((piece, i) => (
                            <li key={i} className="text-stone-300 font-light text-sm flex items-center gap-2">
                                <span className="text-emerald-400">+</span>
                                {piece}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What to Avoid */}
                <div className="bg-rose-900/20 rounded-2xl p-5 border border-rose-800/20">
                    <h4 className="text-rose-300 font-medium mb-3 flex items-center gap-2">
                        ❌ What to Avoid
                    </h4>
                    <ul className="space-y-2">
                        {suggestions.avoidList.map((item, i) => (
                            <li key={i} className="text-stone-300 font-light text-sm flex items-center gap-2">
                                <span className="text-rose-400">−</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-stone-800/30 rounded-2xl p-5">
                <h4 className="text-amber-300 font-medium mb-3 flex items-center gap-2">
                    💡 Pro Tips
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {suggestions.proTips.map((tip, i) => (
                        <div key={i} className="text-stone-300 font-light text-sm p-3 bg-stone-700/30 rounded-xl">
                            {tip}
                        </div>
                    ))}
                </div>
            </div>

            {/* Designer Takeaway */}
            <DesignerTakeaway
                type="styling"
                takeaway="Balance volume strategically—pair with fitted tops and platform footwear. Reserve for transitional seasons (Sept-Oct, March-April) when layering adds value."
            />
        </section>
    );
};

export default StyleSuggestionsSection;

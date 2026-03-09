import React, { useState, useEffect } from 'react';
import { getFashionImage } from '../services/unsplashService';

interface FashionInsightBlockProps {
    index?: number;
    trend: string;
    insight: string;
    growthPotential: number;
    impact: 'High' | 'Medium' | 'Low';
    colors?: string[];
    fabrics?: string[];
    silhouettes?: string[];
    imageSearchTerm?: string;
}

// Momentum label from growth potential
const getMomentumLabel = (potential: number): { label: string; color: string } => {
    if (potential >= 75) return { label: 'Rising Fast', color: 'text-emerald-300' };
    if (potential >= 50) return { label: 'Rising', color: 'text-amber-300' };
    if (potential >= 30) return { label: 'Stable', color: 'text-blue-300' };
    return { label: 'Early Signal', color: 'text-violet-300' };
};

// Enhanced design directions based on trend analysis
const getDesignDirections = (trend: string): {
    colors: string[];
    fabrics: string[];
    silhouettes: string[];
} => {
    const trendLower = trend.toLowerCase();

    // Color detection
    let colors: string[] = [];
    if (trendLower.includes('earth') || trendLower.includes('natural') || trendLower.includes('organic')) {
        colors = ['Warm Terracotta', 'Sage Green', 'Sand'];
    } else if (trendLower.includes('bold') || trendLower.includes('vibrant') || trendLower.includes('color')) {
        colors = ['Electric Blue', 'Vivid Coral', 'Statement Red'];
    } else if (trendLower.includes('pastel') || trendLower.includes('soft')) {
        colors = ['Blush Pink', 'Powder Blue', 'Lavender'];
    } else if (trendLower.includes('mono') || trendLower.includes('minimal')) {
        colors = ['Pure White', 'Charcoal', 'Cream'];
    } else if (trendLower.includes('luxury') || trendLower.includes('elegant')) {
        colors = ['Deep Navy', 'Champagne Gold', 'Ivory'];
    } else {
        colors = ['Seasonal Neutrals', 'Earth Palette'];
    }

    // Fabric detection
    let fabrics: string[] = [];
    if (trendLower.includes('sustain') || trendLower.includes('eco') || trendLower.includes('organic')) {
        fabrics = ['Organic Cotton', 'Hemp Blend', 'Recycled Polyester'];
    } else if (trendLower.includes('luxury') || trendLower.includes('elegant')) {
        fabrics = ['Silk Satin', 'Cashmere', 'Fine Wool'];
    } else if (trendLower.includes('tech') || trendLower.includes('sport') || trendLower.includes('athletic')) {
        fabrics = ['Performance Mesh', 'Stretch Jersey', 'Neoprene'];
    } else if (trendLower.includes('denim') || trendLower.includes('casual')) {
        fabrics = ['Raw Denim', 'Washed Cotton', 'Chambray'];
    } else if (trendLower.includes('sheer') || trendLower.includes('light')) {
        fabrics = ['Organza', 'Chiffon', 'Voile'];
    } else {
        fabrics = ['Natural Fibers', 'Textured Weaves'];
    }

    // Silhouette detection
    let silhouettes: string[] = [];
    if (trendLower.includes('over') || trendLower.includes('volume') || trendLower.includes('drape')) {
        silhouettes = ['Oversized', 'Voluminous', 'Flowing'];
    } else if (trendLower.includes('tailor') || trendLower.includes('structured')) {
        silhouettes = ['Tailored', 'Architectural', 'Sharp Lines'];
    } else if (trendLower.includes('mini') || trendLower.includes('bodycon')) {
        silhouettes = ['Fitted', 'Body-conscious', 'Streamlined'];
    } else if (trendLower.includes('layer')) {
        silhouettes = ['Layered', 'Dimensional', 'Textural'];
    } else {
        silhouettes = ['Relaxed Fit', 'Modern Lines'];
    }

    return { colors, fabrics, silhouettes };
};

const FashionInsightBlock: React.FC<FashionInsightBlockProps> = ({
    index = 0,
    trend,
    insight,
    growthPotential,
    impact,
    colors: propColors,
    fabrics: propFabrics,
    silhouettes: propSilhouettes,
    imageSearchTerm,
}) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const momentum = getMomentumLabel(growthPotential);
    const defaults = getDesignDirections(trend);

    const colors = propColors || defaults.colors;
    const fabrics = propFabrics || defaults.fabrics;
    const silhouettes = propSilhouettes || defaults.silhouettes;

    // Fetch image on mount with index for variety
    useEffect(() => {
        let mounted = true;

        const loadImage = async () => {
            try {
                const searchQuery = imageSearchTerm || trend;
                const url = await getFashionImage(searchQuery, index);
                if (mounted) {
                    setImageUrl(url);
                }
            } catch (err) {
                console.error('Failed to load image:', err);
                if (mounted) {
                    setImageError(true);
                }
            }
        };

        loadImage();
        return () => { mounted = false; };
    }, [trend, index, imageSearchTerm]);

    return (
        <div className="group relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-950/50 hover:shadow-amber-900/20 transition-all duration-500">
            {/* Image Container - 70% dominant visual */}
            <div className="relative h-96 md:h-[28rem] overflow-hidden">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={`${trend} fashion inspiration`}
                        className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            } group-hover:scale-105`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                )}

                {/* Loading State */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-10 h-10 border-2 border-stone-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                            <span className="text-xs text-stone-500 font-light">Loading inspiration...</span>
                        </div>
                    </div>
                )}

                {/* Soft gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/60 via-60% to-transparent" />

                {/* Momentum Badge - Top Right */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 bg-stone-950/80 backdrop-blur-md rounded-full text-xs font-light tracking-wide ${momentum.color}`}>
                        {momentum.label}
                    </span>
                </div>

                {/* Content Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {/* Trend Name */}
                    <h3 className="text-3xl md:text-4xl font-extralight text-white tracking-tight leading-tight mb-3 drop-shadow-lg">
                        {trend}
                    </h3>

                    {/* Editorial Insight - One-line reaction to image */}
                    <p className="text-base md:text-lg text-stone-100/95 font-light leading-relaxed mb-4 drop-shadow">
                        {insight}
                    </p>

                    {/* Design Direction Chips - Compact Row */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Colors */}
                        {colors.slice(0, 2).map((color, i) => (
                            <span
                                key={`c-${i}`}
                                className="text-xs px-2.5 py-1 bg-amber-900/40 text-amber-200/90 backdrop-blur-sm rounded-full font-light"
                            >
                                {color}
                            </span>
                        ))}
                        {/* Fabrics */}
                        {fabrics.slice(0, 2).map((fabric, i) => (
                            <span
                                key={`f-${i}`}
                                className="text-xs px-2.5 py-1 bg-stone-800/60 text-stone-200/90 backdrop-blur-sm rounded-full font-light"
                            >
                                {fabric}
                            </span>
                        ))}
                        {/* Silhouettes */}
                        {silhouettes.slice(0, 2).map((sil, i) => (
                            <span
                                key={`s-${i}`}
                                className="text-xs px-2.5 py-1 bg-slate-800/50 text-slate-200/90 backdrop-blur-sm rounded-full font-light"
                            >
                                {sil}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FashionInsightBlock;

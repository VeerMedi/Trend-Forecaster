import React, { useState } from 'react';
import { ChevronRight, TrendingUp, BarChart3, Sparkles, Target, Palette } from 'lucide-react';

interface PremiumCardProps {
    title: string;
    description: string;
    ctaText: string;
    icon: React.ReactNode;
    gradient: 'amber' | 'blue' | 'emerald' | 'violet' | 'rose';
    imageUrl?: string;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

/**
 * Premium Card Widget
 * Large, beautiful cards with gradients and images
 */
const PremiumCard: React.FC<PremiumCardProps> = ({
    title,
    description,
    ctaText,
    icon,
    gradient,
    imageUrl,
    defaultExpanded = false,
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const gradients = {
        amber: {
            card: 'from-amber-950/40 via-orange-950/30 to-stone-950/40',
            glow: 'from-amber-600/20 via-orange-600/10 to-transparent',
            border: 'border-amber-900/30',
            iconBg: 'bg-amber-900/40',
            iconGlow: 'shadow-amber-600/20',
            text: 'text-amber-400',
            ctaBg: 'bg-amber-600 hover:bg-amber-500',
            ctaShadow: 'shadow-amber-600/30'
        },
        blue: {
            card: 'from-blue-950/40 via-indigo-950/30 to-stone-950/40',
            glow: 'from-blue-600/20 via-indigo-600/10 to-transparent',
            border: 'border-blue-900/30',
            iconBg: 'bg-blue-900/40',
            iconGlow: 'shadow-blue-600/20',
            text: 'text-blue-400',
            ctaBg: 'bg-blue-600 hover:bg-blue-500',
            ctaShadow: 'shadow-blue-600/30'
        },
        emerald: {
            card: 'from-emerald-950/40 via-teal-950/30 to-stone-950/40',
            glow: 'from-emerald-600/20 via-teal-600/10 to-transparent',
            border: 'border-emerald-900/30',
            iconBg: 'bg-emerald-900/40',
            iconGlow: 'shadow-emerald-600/20',
            text: 'text-emerald-400',
            ctaBg: 'bg-emerald-600 hover:bg-emerald-500',
            ctaShadow: 'shadow-emerald-600/30'
        },
        violet: {
            card: 'from-violet-950/40 via-purple-950/30 to-stone-950/40',
            glow: 'from-violet-600/20 via-purple-600/10 to-transparent',
            border: 'border-violet-900/30',
            iconBg: 'bg-violet-900/40',
            iconGlow: 'shadow-violet-600/20',
            text: 'text-violet-400',
            ctaBg: 'bg-violet-600 hover:bg-violet-500',
            ctaShadow: 'shadow-violet-600/30'
        },
        rose: {
            card: 'from-rose-950/40 via-pink-950/30 to-stone-950/40',
            glow: 'from-rose-600/20 via-pink-600/10 to-transparent',
            border: 'border-rose-900/30',
            iconBg: 'bg-rose-900/40',
            iconGlow: 'shadow-rose-600/20',
            text: 'text-rose-400',
            ctaBg: 'bg-rose-600 hover:bg-rose-500',
            ctaShadow: 'shadow-rose-600/30'
        }
    };

    const colors = gradients[gradient];

    return (
        <div className="group">
            {/* Card - Always Visible */}
            <div
                className={`relative overflow-hidden rounded-3xl border ${colors.border} bg-gradient-to-br ${colors.card} backdrop-blur-sm transition-all duration-500 ${isExpanded ? 'shadow-2xl shadow-stone-950/50' : 'shadow-xl shadow-stone-950/40 hover:shadow-2xl'
                    }`}
            >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-t ${colors.glow} opacity-60 pointer-events-none`}></div>

                {/* Background Image Overlay (if provided) */}
                {imageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                )}

                {/* Content */}
                <div className="relative z-10 p-8 sm:p-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.iconBg} backdrop-blur-md flex items-center justify-center mb-6 shadow-lg ${colors.iconGlow}`}>
                        <div className={colors.text}>
                            {icon}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-light text-white mb-3 tracking-tight">
                        {title}
                    </h2>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-stone-300 font-light mb-6 leading-relaxed max-w-2xl">
                        {description}
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${colors.ctaBg} text-white font-medium transition-all duration-300 shadow-lg ${colors.ctaShadow} hover:shadow-xl hover:scale-105 active:scale-100`}
                    >
                        <span>{isExpanded ? 'Hide Details' : ctaText}</span>
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="mt-6 animate-fade-in">
                    <div className="bg-stone-900/60 backdrop-blur-lg rounded-3xl border border-stone-800/50 p-6 sm:p-8 shadow-xl">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumCard;
export { TrendingUp, BarChart3, Sparkles, Target, Palette };

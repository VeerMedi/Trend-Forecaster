import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdaptiveWidgetProps {
    icon: string;
    title: string;
    summary: string;
    accentColor?: 'amber' | 'blue' | 'violet' | 'emerald' | 'rose';
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

/**
 * Adaptive Widget - Minimal by default, expandable on demand
 * Clean card design without heavy borders
 */
const AdaptiveWidget: React.FC<AdaptiveWidgetProps> = ({
    icon,
    title,
    summary,
    accentColor = 'amber',
    defaultExpanded = false,
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const colors = {
        amber: 'border-amber-900/30 hover:border-amber-800/50',
        blue: 'border-blue-900/30 hover:border-blue-800/50',
        violet: 'border-violet-900/30 hover:border-violet-800/50',
        emerald: 'border-emerald-900/30 hover:border-emerald-800/50',
        rose: 'border-rose-900/30 hover:border-rose-800/50'
    };

    return (
        <div className={`bg-stone-950/50 backdrop-blur-sm border ${colors[accentColor]} rounded-2xl transition-all duration-300 ${isExpanded ? 'shadow-xl shadow-black/20' : 'hover:bg-stone-950/70'
            }`}>
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 sm:px-8 py-6 sm:py-8 text-left flex items-start gap-4 sm:gap-6"
            >
                {/* Icon */}
                <div className="text-3xl sm:text-4xl flex-shrink-0 mt-1">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-light text-white mb-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed">
                        {summary}
                    </p>
                </div>

                {/* Expand Indicator */}
                <ChevronDown className={`w-5 h-5 text-stone-500 flex-shrink-0 mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                    }`} />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 sm:px-8 pb-8 border-t border-stone-800/50 animate-fade-in">
                    <div className="pt-6">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdaptiveWidget;

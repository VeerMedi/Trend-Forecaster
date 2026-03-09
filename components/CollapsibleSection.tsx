import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    subtitle?: string;
    icon?: string;
    defaultExpanded?: boolean;
    accentColor?: 'amber' | 'violet' | 'blue' | 'emerald' | 'rose';
    children: React.ReactNode;
}

/**
 * Sleek Collapsible Section Component
 * Magazine-editorial style with smooth animations
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    subtitle,
    icon = '📊',
    defaultExpanded = false,
    accentColor = 'amber',
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const colorStyles = {
        amber: {
            border: 'border-amber-900/30 hover:border-amber-700/50',
            bg: 'from-amber-950/20 to-stone-950',
            iconBg: 'bg-gradient-to-br from-amber-600 to-orange-600',
            textAccent: 'text-amber-400'
        },
        violet: {
            border: 'border-violet-900/30 hover:border-violet-700/50',
            bg: 'from-violet-950/20 to-stone-950',
            iconBg: 'bg-gradient-to-br from-violet-600 to-purple-600',
            textAccent: 'text-violet-400'
        },
        blue: {
            border: 'border-blue-900/30 hover:border-blue-700/50',
            bg: 'from-blue-950/20 to-stone-950',
            iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-600',
            textAccent: 'text-blue-400'
        },
        emerald: {
            border: 'border-emerald-900/30 hover:border-emerald-700/50',
            bg: 'from-emerald-950/20 to-stone-950',
            iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
            textAccent: 'text-emerald-400'
        },
        rose: {
            border: 'border-rose-900/30 hover:border-rose-700/50',
            bg: 'from-rose-950/20 to-stone-950',
            iconBg: 'bg-gradient-to-br from-rose-600 to-pink-600',
            textAccent: 'text-rose-400'
        }
    };

    const colors = colorStyles[accentColor];

    return (
        <div
            className={`bg-gradient-to-br ${colors.bg} rounded-3xl border ${colors.border} transition-all duration-300 overflow-hidden ${isExpanded ? 'shadow-2xl shadow-stone-950/50' : 'shadow-lg shadow-stone-950/30'
                }`}
        >
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 sm:p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all"
            >
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center text-2xl sm:text-3xl shadow-lg transition-transform duration-300 ${isExpanded ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                        {icon}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="flex-1 text-left min-w-0">
                        <h2 className={`text-xl sm:text-2xl font-light ${colors.textAccent} mb-1 tracking-tight`}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-sm text-stone-400 font-light line-clamp-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center gap-3 ml-4">
                    <span className={`hidden sm:block text-xs font-medium ${colors.textAccent} transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                        }`}>
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    <ChevronDown
                        className={`w-6 h-6 ${colors.textAccent} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Content - Expandable */}
            <div
                className={`transition-all duration-500 ease-in-out ${isExpanded
                        ? 'max-h-[10000px] opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent mb-6"></div>

                    {/* Content */}
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;

import React, { useState } from 'react';

interface ExpandableMetricCardProps {
    icon: string;
    title: string;
    value: string;
    subtitle?: string;
    details: React.ReactNode;
    color?: 'green' | 'amber' | 'blue' | 'purple';
}

/**
 * Expandable Metric Card
 * Shows summary metric, click to expand for detailed WHY explanation
 */
const ExpandableMetricCard: React.FC<ExpandableMetricCardProps> = ({
    icon,
    title,
    value,
    subtitle,
    details,
    color = 'green'
}) => {
    const [expanded, setExpanded] = useState(false);

    const colorClasses = {
        green: {
            bg: 'from-emerald-950/30 to-green-950/20',
            border: 'border-emerald-800/40',
            text: 'text-emerald-400',
            hover: 'hover:border-emerald-700/60'
        },
        amber: {
            bg: 'from-amber-950/30 to-yellow-950/20',
            border: 'border-amber-800/40',
            text: 'text-amber-400',
            hover: 'hover:border-amber-700/60'
        },
        blue: {
            bg: 'from-blue-950/30 to-cyan-950/20',
            border: 'border-blue-800/40',
            text: 'text-blue-400',
            hover: 'hover:border-blue-700/60'
        },
        purple: {
            bg: 'from-purple-950/30 to-violet-950/20',
            border: 'border-purple-800/40',
            text: 'text-purple-400',
            hover: 'hover:border-purple-700/60'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} ${colors.hover} transition-all overflow-hidden`}>
            {/* Header - Always Visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-start justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-start gap-3 text-left flex-1">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium tracking-[0.15em] uppercase text-stone-400 mb-1">
                            {title}
                        </div>
                        <div className={`text-lg font-medium ${colors.text} mb-0.5`}>
                            {value}
                        </div>
                        {subtitle && (
                            <div className="text-xs text-stone-500">
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center text-sm ${colors.text} transition-transform ${expanded ? 'rotate-180' : ''}`}>
                    {expanded ? '−' : '+'}
                </div>
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-5 pb-5 pt-2 border-t border-stone-800/50 bg-stone-900/30 animate-fade-in">
                    {details}
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ExpandableMetricCard;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, LucideIcon } from 'lucide-react';

interface ExpandableSignalCardProps {
    title: string;
    Icon: LucideIcon;
    isExpanded: boolean;
    onToggle: () => void;
    size?: 'small' | 'medium' | 'large' | 'wide'; // iOS widget sizes
    collapsedPreview: {
        metric1: { label: string; value: string };
        metric2: { label: string; value: string };
        metric3?: { label: string; value: string };
        metric4?: { label: string; value: string };
        subtitle?: string;
    };
    expandedContent: React.ReactNode;
}

/**
 * iOS Widget-Style Expandable Card
 * - Different sizes: small (1x1), medium (2x1), large (2x2), wide (4x1)
 * - Rich collapsed preview with multiple metrics
 * - Hover to scale, minimize button with genie animation
 */
const ExpandableSignalCard: React.FC<ExpandableSignalCardProps> = ({
    title,
    Icon,
    isExpanded,
    onToggle,
    size = 'medium',
    collapsedPreview,
    expandedContent
}) => {
    // Determine height based on size
    const heightClass = {
        small: 'min-h-[200px]',
        medium: 'min-h-[280px]',
        large: 'min-h-[400px]',
        wide: 'min-h-[220px]'
    }[size];

    return (
        <motion.div
            layout
            initial={false}
            animate={{
                backgroundColor: isExpanded
                    ? 'rgba(28, 25, 23, 0.85)'
                    : 'rgba(28, 25, 23, 0.60)'
            }}
            whileHover={!isExpanded ? {
                scale: 1.02,
                borderColor: 'rgba(251, 191, 36, 0.4)'
            } : {}}
            transition={{
                layout: { type: "spring", damping: 25, stiffness: 200 },
                backgroundColor: { duration: 0.3 },
                scale: { duration: 0.2 },
                borderColor: { duration: 0.2 }
            }}
            className={`
                rounded-2xl overflow-hidden backdrop-blur-xl
                border transition-colors duration-300
                ${!isExpanded ? heightClass : ''}
                ${isExpanded
                    ? 'border-amber-500/40 shadow-2xl shadow-amber-900/20 cursor-default'
                    : 'border-stone-700/40 hover:border-amber-500/30 shadow-lg shadow-black/40 cursor-pointer'
                }
            `}
            onClick={!isExpanded ? onToggle : undefined}
        >
            {/* Header - Always Visible */}
            <motion.div
                layout="position"
                className="flex items-center justify-between p-5"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        layout
                        animate={{ rotate: isExpanded ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Icon className={`w-5 h-5 ${isExpanded ? 'text-amber-400' : 'text-stone-400'}`} />
                    </motion.div>
                    <div>
                        <motion.h3
                            layout="position"
                            className="text-base font-light text-white tracking-tight"
                        >
                            {title}
                        </motion.h3>
                        {collapsedPreview.subtitle && !isExpanded && (
                            <p className="text-xs text-stone-500 font-light mt-0.5">
                                {collapsedPreview.subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Minimize Button (only when expanded) */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle();
                            }}
                            className="p-2 rounded-lg bg-stone-800/60 hover:bg-stone-700/60 border border-stone-600/40 transition-colors"
                        >
                            <Minus className="w-4 h-4 text-stone-300" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Expandable Content with Genie Animation */}
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{
                            opacity: 0,
                            height: 0,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            scale: 1
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            scale: 0.8,
                            transformOrigin: 'top center',
                            transition: {
                                duration: 0.4,
                                ease: [0.4, 0.0, 0.2, 1]
                            }
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1]
                        }}
                        className="px-5 pb-5"
                    >
                        {expandedContent}
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 flex-1 flex flex-col justify-center"
                    >
                        {/* Preview Metrics - iOS Widget Style */}
                        <div className="space-y-4">
                            {/* Primary Metrics */}
                            <div className={`grid ${size === 'small' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                <div className="space-y-1">
                                    <p className="text-3xl font-extralight text-white">
                                        {collapsedPreview.metric1.value}
                                    </p>
                                    <p className="text-xs text-stone-500 font-light tracking-wide">
                                        {collapsedPreview.metric1.label}
                                    </p>
                                </div>
                                {size !== 'small' && (
                                    <div className="space-y-1">
                                        <p className="text-3xl font-extralight text-white">
                                            {collapsedPreview.metric2.value}
                                        </p>
                                        <p className="text-xs text-stone-500 font-light tracking-wide">
                                            {collapsedPreview.metric2.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Secondary Metrics (for medium, large, wide) */}
                            {(size === 'large' || size === 'wide') && (collapsedPreview.metric3 || collapsedPreview.metric4) && (
                                <>
                                    <div className="h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />
                                    <div className={`grid ${size === 'wide' ? 'grid-cols-4' : 'grid-cols-2'} gap-3`}>
                                        {collapsedPreview.metric3 && (
                                            <div className="space-y-0.5">
                                                <p className="text-lg font-extralight text-stone-300">
                                                    {collapsedPreview.metric3.value}
                                                </p>
                                                <p className="text-[10px] text-stone-600 font-light uppercase tracking-wider">
                                                    {collapsedPreview.metric3.label}
                                                </p>
                                            </div>
                                        )}
                                        {collapsedPreview.metric4 && (
                                            <div className="space-y-0.5">
                                                <p className="text-lg font-extralight text-stone-300">
                                                    {collapsedPreview.metric4.value}
                                                </p>
                                                <p className="text-[10px] text-stone-600 font-light uppercase tracking-wider">
                                                    {collapsedPreview.metric4.label}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Click hint */}
                            <div className="pt-2">
                                <p className="text-[10px] text-stone-600 font-light italic">
                                    Tap to expand
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExpandableSignalCard;

// Signal Interpretation Utility
// Converts raw metrics into qualitative bands with context

export interface SignalBand {
    band: string;
    interpretation: string;
    color: string;
    icon: string;
}

/**
 * Investment Score (1-10) → Signal Band
 */
export const interpretInvestmentScore = (score: number): SignalBand => {
    if (score >= 8) {
        return {
            band: 'High Signal',
            interpretation: 'Strong industry momentum across multiple indicators. Early adoption recommended.',
            color: 'text-emerald-300',
            icon: '🚀'
        };
    }
    if (score >= 6) {
        return {
            band: 'Medium Signal',
            interpretation: 'Solid foundation with growing traction. Worth exploring for differentiation.',
            color: 'text-amber-300',
            icon: '📊'
        };
    }
    if (score >= 4) {
        return {
            band: 'Early Signal',
            interpretation: 'Emerging indicators present but limited validation. Monitor for development.',
            color: 'text-violet-300',
            icon: '🌱'
        };
    }
    return {
        band: 'Weak Signal',
        interpretation: 'Limited market activity. Consider alternative directions.',
        color: 'text-stone-400',
        icon: '⚪'
    };
};

/**
 * Confidence % → Signal Band
 */
export const interpretConfidence = (percent: number): SignalBand => {
    if (percent >= 80) {
        return {
            band: 'High Confidence',
            interpretation: 'Data points align consistently across sources',
            color: 'text-blue-300',
            icon: '✓'
        };
    }
    if (percent >= 60) {
        return {
            band: 'Moderate Confidence',
            interpretation: 'Mixed signals; requires deeper research',
            color: 'text-amber-300',
            icon: '~'
        };
    }
    return {
        band: 'Low Confidence',
        interpretation: 'Limited data availability; early stage',
        color: 'text-stone-400',
        icon: '?'
    };
};

/**
 * Growth % → Momentum Band
 */
export const interpretGrowth = (growthPercent: number): SignalBand => {
    if (growthPercent >= 1000) {
        return {
            band: 'Surging',
            interpretation: 'Search interest surged sharply last month, suggesting renewed curiosity rather than mass adoption.',
            color: 'text-emerald-300',
            icon: '⚡'
        };
    }
    if (growthPercent >= 100) {
        return {
            band: 'Accelerating',
            interpretation: 'Steady upward momentum across search and social channels.',
            color: 'text-blue-300',
            icon: '📈'
        };
    }
    if (growthPercent >= 20) {
        return {
            band: 'Growing',
            interpretation: 'Moderate growth indicating sustained but not explosive interest.',
            color: 'text-amber-300',
            icon: '→'
        };
    }
    if (growthPercent >= 0) {
        return {
            band: 'Stable',
            interpretation: 'Maintaining steady presence without significant movement.',
            color: 'text-stone-300',
            icon: '═'
        };
    }
    return {
        band: 'Softening',
        interpretation: 'Declining indicators suggest waning interest or seasonal adjustment.',
        color: 'text-rose-300',
        icon: '📉'
    };
};

/**
 * Sentiment % → Mood Band
 */
export const interpretSentiment = (positivePercent: number, negativePercent: number): SignalBand => {
    if (positivePercent >= 70) {
        return {
            band: 'Positive',
            interpretation: 'Industry conversation is broadly favorable',
            color: 'text-emerald-300',
            icon: '😊'
        };
    }
    if (positivePercent >= 50) {
        return {
            band: 'Mixed-Positive',
            interpretation: 'Generally favorable with some skepticism',
            color: 'text-amber-300',
            icon: '🤔'
        };
    }
    if (negativePercent >= 40) {
        return {
            band: 'Skeptical',
            interpretation: 'Significant concerns or pushback in discourse',
            color: 'text-rose-300',
            icon: '😐'
        };
    }
    return {
        band: 'Neutral',
        interpretation: 'Conversation lacks strong directional bias',
        color: 'text-stone-300',
        icon: '😶'
    };
};

/**
 * Growth Potential (0-100) → Signal Band
 */
export const interpretGrowthPotential = (potential: number): SignalBand => {
    if (potential >= 75) {
        return {
            band: 'Rising Fast',
            interpretation: 'Multiple indicators suggest accelerating adoption',
            color: 'text-emerald-300',
            icon: '🚀'
        };
    }
    if (potential >= 50) {
        return {
            band: 'Rising',
            interpretation: 'Upward trajectory supported by early signals',
            color: 'text-amber-300',
            icon: '↗'
        };
    }
    if (potential >= 30) {
        return {
            band: 'Stable',
            interpretation: 'Established presence without major shifts',
            color: 'text-blue-300',
            icon: '─'
        };
    }
    return {
        band: 'Early Signal',
        interpretation: 'Nascent indicators worth monitoring',
        color: 'text-violet-300',
        icon: '·'
    };
};

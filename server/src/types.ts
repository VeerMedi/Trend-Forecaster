// Enhanced type definitions for actionable trend analysis
export interface TrendAnalysis {
    topic: string;
    summary: string;

    // Editorial Narrative - calm, authoritative context
    editorialNarrative?: string;

    // Investment Analysis
    investmentAnalysis?: {
        score: number;
        recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Avoid';
        riskLevel: 'Low' | 'Medium' | 'High';
        confidencePercent: number;
        reasoning: string;
    };

    // Market Timing
    marketTiming?: {
        currentPhase: 'Emerging' | 'Growing' | 'Mainstream' | 'Mature' | 'Declining';
        phaseDescription: string;
        peakPrediction: string;
        entryWindow: string;
        exitSignals: string[];
    };

    // Price Analysis
    priceAnalysis?: {
        budgetRange: string;
        midRange: string;
        luxuryRange: string;
        bestValuePick: string;
    };

    // Target Audience
    targetAudience?: {
        primaryDemo: string;
        secondaryDemo: string;
        notRecommendedFor: string;
        adoptionLevel: string;
    };

    // Key Players
    keyPlayers?: {
        brand: string;
        role: string;
        pricePoint: string;
        notableProduct: string;
    }[];

    // Image Search Terms for context-aware images
    imageSearchTerms?: string[];

    // Actionable Next Steps
    actionableNextSteps?: string[];

    keyInsights: {
        insight: string;
        sourceType: string;
        impact?: 'High' | 'Medium' | 'Low';
        evidence?: string;
    }[];

    emergingTrends: {
        trend: string;
        impact: 'High' | 'Medium' | 'Low';
        growthPotential: number;
        description?: string;
    }[];

    sentiment: {
        positive: number;
        neutral: number;
        negative: number;
    };

    competitors: {
        name: string;
        summary: string;
        recentActivity: string;
        threatLevel?: string;
    }[];

    futureOutlook: string;

    // AI-Generated Forecast (12-month predictions)
    forecast?: {
        predictions: number[];      // 12 monthly values (0-100 scale)
        upperBound: number[];       // Upper confidence band
        lowerBound: number[];       // Lower confidence band
        confidence: number;         // Overall forecast confidence (0-1)
        methodology: string;        // How forecast was generated
        assumptions: string[];      // Key assumptions made
    };

    sources: {
        web: {
            uri: string;
            title: string;
        };
    }[];

    correlationMatrix: {
        trends: string[];
        matrix: number[][];
    };
}

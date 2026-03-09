import { VIEWS, SOURCES } from './constants';

export interface TrendAnalysis {
  topic: string;
  summary: string;

  // NEW: Editorial narrative - calm, authoritative context
  editorialNarrative?: string;

  // NEW: Investment Analysis
  investmentAnalysis?: {
    score: number; // 1-10
    recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Avoid';
    riskLevel: 'Low' | 'Medium' | 'High';
    confidencePercent: number;
    reasoning: string;
  };

  // NEW: Market Timing
  marketTiming?: {
    currentPhase: 'Emerging' | 'Growing' | 'Mainstream' | 'Mature' | 'Declining';
    phaseDescription: string;
    peakPrediction: string;
    entryWindow: string;
    exitSignals: string[];
  };

  // NEW: Price Analysis
  priceAnalysis?: {
    budgetRange: string;
    midRange: string;
    luxuryRange: string;
    bestValuePick: string;
  };

  // NEW: Target Audience
  targetAudience?: {
    primaryDemo: string;
    secondaryDemo: string;
    notRecommendedFor: string;
    adoptionLevel: string;
  };

  // NEW: Key Players
  keyPlayers?: {
    brand: string;
    role: string;
    pricePoint: string;
    notableProduct: string;
  }[];

  // NEW: Image Search Terms (for context-aware images)
  imageSearchTerms?: string[];

  // NEW: Actionable Next Steps
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
    designerGuidance?: string;  // Actionable guidance for collection planning
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

export type View = typeof VIEWS[number]['id'];
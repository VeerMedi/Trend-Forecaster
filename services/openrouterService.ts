import type { TrendAnalysis } from '../types';

const API_BASE_URL = '/api';

/**
 * Get trend analysis from backend API
 * Backend handles: News API, Google Trends, AI Analysis
 */
export const getTrendAnalysis = async (
  topic: string,
  sources: string[] = ['web'],
  region: string = 'global'
): Promise<TrendAnalysis> => {
  console.log(`📊 Requesting analysis for: ${topic}`);
  console.log(`📂 Sources: ${sources.join(', ')}`);
  console.log(`🌍 Region: ${region}`);

  try {
    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, sources, region }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Analysis received from backend');

    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    return result.data as TrendAnalysis;

  } catch (error: any) {
    console.error('❌ Error calling backend API:', error.message);

    // Fallback: return mock data if backend is unavailable
    console.log('⚠️ Returning fallback mock data...');
    return {
      topic,
      summary: `Analysis of ${topic} trends based on current market data. (Fallback data - backend may be unavailable)`,
      keyInsights: [
        { insight: `${topic} is showing significant growth potential in the current market`, sourceType: 'web' },
        { insight: `Market sentiment around ${topic} is generally positive`, sourceType: 'news' }
      ],
      emergingTrends: [
        { trend: `Advanced ${topic} solutions`, impact: 'High', growthPotential: 85 },
        { trend: `AI-powered ${topic} tools`, impact: 'Medium', growthPotential: 70 }
      ],
      sentiment: { positive: 65, neutral: 25, negative: 10 },
      competitors: [
        { name: 'Market Leader A', summary: 'Established player in the market', recentActivity: 'Recent product launch' },
        { name: 'Emerging Startup B', summary: 'Innovative newcomer', recentActivity: 'Funding announcement' }
      ],
      futureOutlook: `The future of ${topic} looks promising with continued innovation and market expansion expected.`,
      correlationMatrix: {
        trends: [`Advanced ${topic} solutions`, `AI-powered ${topic} tools`],
        matrix: [[1.0, 0.6], [0.6, 1.0]]
      },
      sources: []
    };
  }
};

/**
 * Get analysis history from backend
 */
export const getAnalysisHistory = async (limit: number = 10): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/history?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];

  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return [];
  }
};

/**
 * Get specific analysis by ID
 */
export const getAnalysisById = async (id: string): Promise<TrendAnalysis | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.status}`);
    }

    const result = await response.json();
    return result.data || null;

  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
};
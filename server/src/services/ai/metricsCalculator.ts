/**
 * Real Data Metrics Calculator
 * Calculates all metrics from actual API data instead of LLM inference
 */

interface TrendsMetrics {
    avgInterest: number;
    trendDirection: 'rising' | 'falling' | 'stable';
    volatility: number;
    recentGrowth: number;
}

interface ShoppingMetrics {
    productCount: number;
    avgPrice: number;
    priceRange: { min: number; max: number };
    brandCount: number;
    priceDistribution: { budget: number; mid: number; luxury: number };
}

interface NewsMetrics {
    articleCount: number;
    sourceDiversity: number;
    recency: number; // How recent articles are (0-100)
}

interface CalculatedMetrics {
    investmentScore: number;        // 1-10
    confidencePercent: number;      // 0-100
    growthPotential: number;        // 0-100
    riskLevel: 'Low' | 'Medium' | 'High';
    marketMaturity: 'Emerging' | 'Growing' | 'Mainstream' | 'Mature' | 'Declining';
}

class MetricsCalculator {
    /**
     * Calculate investment score from real market data
     * Formula: Weighted average of market signals
     */
    calculateInvestmentScore(
        trendsMetrics: TrendsMetrics,
        shoppingMetrics: ShoppingMetrics,
        newsMetrics: NewsMetrics
    ): number {
        let score = 5; // Start neutral

        // Trends contribution (40% weight)
        if (trendsMetrics.trendDirection === 'rising') {
            score += 2 * (trendsMetrics.recentGrowth / 50); // Max +2
        } else if (trendsMetrics.trendDirection === 'falling') {
            score -= 2 * (Math.abs(trendsMetrics.recentGrowth) / 50); // Max -2
        }

        // Shopping volume contribution (30% weight)
        if (shoppingMetrics.productCount > 100) score += 1.5;
        else if (shoppingMetrics.productCount > 50) score += 1;
        else if (shoppingMetrics.productCount > 20) score += 0.5;
        else if (shoppingMetrics.productCount < 10) score -= 1;

        // Brand diversity contribution (15% weight)
        if (shoppingMetrics.brandCount > 15) score += 0.75;
        else if (shoppingMetrics.brandCount > 8) score += 0.5;
        else if (shoppingMetrics.brandCount < 3) score -= 0.5;

        // News coverage contribution (15% weight)
        if (newsMetrics.articleCount > 10) score += 0.75;
        else if (newsMetrics.articleCount > 5) score += 0.5;
        else if (newsMetrics.articleCount === 0) score -= 0.75;

        // Clamp to 1-10 range
        return Math.max(1, Math.min(10, Math.round(score)));
    }

    /**
     * Calculate confidence based on data quality
     */
    calculateConfidence(
        trendsMetrics: TrendsMetrics,
        shoppingMetrics: ShoppingMetrics,
        newsMetrics: NewsMetrics
    ): number {
        let confidence = 0;

        // Data volume (50% of confidence)
        const volumeScore =
            (shoppingMetrics.productCount > 0 ? 20 : 0) +
            (newsMetrics.articleCount > 0 ? 15 : 0) +
            (trendsMetrics.avgInterest > 0 ? 15 : 0);

        // Data quality (30% of confidence)
        const qualityScore =
            (shoppingMetrics.brandCount > 5 ? 15 : shoppingMetrics.brandCount * 3) +
            (newsMetrics.sourceDiversity > 3 ? 15 : newsMetrics.sourceDiversity * 5);

        // Data recency (20% of confidence)
        const recencyScore = newsMetrics.recency * 0.20;

        confidence = volumeScore + qualityScore + recencyScore;

        return Math.round(Math.max(10, Math.min(100, confidence)));
    }

    /**
     * Calculate growth potential from trend slope
     */
    calculateGrowthPotential(trendsMetrics: TrendsMetrics): number {
        let potential = 50; // Start at neutral

        // Recent growth is the primary signal
        potential += trendsMetrics.recentGrowth;

        // High volatility reduces reliability
        if (trendsMetrics.volatility > 20) potential -= 15;
        else if (trendsMetrics.volatility < 5) potential += 10;

        // Current interest level matters
        if (trendsMetrics.avgInterest > 70) potential += 10; // High interest = momentum
        else if (trendsMetrics.avgInterest < 20) potential -= 20; // Low interest = niche

        return Math.round(Math.max(0, Math.min(100, potential)));
    }

    /**
     * Determine risk level based on volatility and data quality
     */
    calculateRiskLevel(
        trendsMetrics: TrendsMetrics,
        confidence: number
    ): 'Low' | 'Medium' | 'High' {
        if (confidence > 70 && trendsMetrics.volatility < 10) return 'Low';
        if (confidence < 40 || trendsMetrics.volatility > 25) return 'High';
        return 'Medium';
    }

    /**
     * Determine market maturity from interest level and growth
     */
    calculateMarketMaturity(
        trendsMetrics: TrendsMetrics,
        shoppingMetrics: ShoppingMetrics
    ): 'Emerging' | 'Growing' | 'Mainstream' | 'Mature' | 'Declining' {
        const { avgInterest, trendDirection } = trendsMetrics;
        const { productCount } = shoppingMetrics;

        if (avgInterest < 20 && productCount < 20) return 'Emerging';
        if (avgInterest < 40 && trendDirection === 'rising') return 'Growing';
        if (avgInterest > 60 && productCount > 50) return 'Mainstream';
        if (avgInterest > 70 && trendDirection === 'stable') return 'Mature';
        if (trendDirection === 'falling') return 'Declining';

        return 'Growing'; // Default
    }

    /**
     * Extract metrics from raw trends data
     */
    extractTrendsMetrics(trendsData: any): TrendsMetrics {
        if (!trendsData || !trendsData.timelineData || trendsData.timelineData.length === 0) {
            return {
                avgInterest: 0,
                trendDirection: 'stable',
                volatility: 0,
                recentGrowth: 0
            };
        }

        const values = trendsData.timelineData.map((d: any) => d.interest || d.value || 0);
        const avgInterest = values.reduce((a: number, b: number) => a + b, 0) / values.length;

        // Calculate trend direction
        const recent = values.slice(-3);
        const older = values.slice(0, 3);
        const recentAvg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a: number, b: number) => a + b, 0) / older.length;
        const recentGrowth = recentAvg - olderAvg;

        let trendDirection: 'rising' | 'falling' | 'stable' = 'stable';
        if (recentGrowth > 5) trendDirection = 'rising';
        else if (recentGrowth < -5) trendDirection = 'falling';

        // Calculate volatility (standard deviation)
        const variance = values.reduce((sum: number, val: number) =>
            sum + Math.pow(val - avgInterest, 2), 0) / values.length;
        const volatility = Math.sqrt(variance);

        return { avgInterest, trendDirection, volatility, recentGrowth };
    }

    /**
     * Extract metrics from shopping data
     */
    extractShoppingMetrics(shoppingData: any): ShoppingMetrics {
        const products = shoppingData?.shopping_results || shoppingData?.products || [];

        if (products.length === 0) {
            return {
                productCount: 0,
                avgPrice: 0,
                priceRange: { min: 0, max: 0 },
                brandCount: 0,
                priceDistribution: { budget: 0, mid: 0, luxury: 0 }
            };
        }

        const prices = products
            .map((p: any) => parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0'))
            .filter((p: number) => p > 0);

        const brands = new Set(products.map((p: any) => p.source || p.brand).filter(Boolean));

        const avgPrice = prices.length > 0
            ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length
            : 0;

        const priceRange = prices.length > 0
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : { min: 0, max: 0 };

        // Price distribution
        let budget = 0, mid = 0, luxury = 0;
        prices.forEach((price: number) => {
            if (price < 50) budget++;
            else if (price < 200) mid++;
            else luxury++;
        });

        return {
            productCount: products.length,
            avgPrice,
            priceRange,
            brandCount: brands.size,
            priceDistribution: { budget, mid, luxury }
        };
    }

    /**
     * Extract metrics from news data
     */
    extractNewsMetrics(newsData: any): NewsMetrics {
        const articles = newsData?.articles || [];

        if (articles.length === 0) {
            return { articleCount: 0, sourceDiversity: 0, recency: 0 };
        }

        const sources = new Set(articles.map((a: any) => a.source?.name).filter(Boolean));

        // Calculate recency (articles from last 7 days score higher)
        const now = Date.now();
        const recencyScores = articles.map((a: any) => {
            const pubDate = new Date(a.publishedAt || Date.now()).getTime();
            const daysOld = (now - pubDate) / (1000 * 60 * 60 * 24);
            if (daysOld < 7) return 100;
            if (daysOld < 30) return 70;
            if (daysOld < 90) return 40;
            return 20;
        });
        const avgRecency = recencyScores.reduce((a: number, b: number) => a + b, 0) / recencyScores.length;

        return {
            articleCount: articles.length,
            sourceDiversity: sources.size,
            recency: avgRecency
        };
    }

    /**
     * Calculate all metrics from raw data
     */
    calculateAllMetrics(
        trendsData: any,
        shoppingData: any,
        newsData: any
    ): CalculatedMetrics {
        const trendsMetrics = this.extractTrendsMetrics(trendsData);
        const shoppingMetrics = this.extractShoppingMetrics(shoppingData);
        const newsMetrics = this.extractNewsMetrics(newsData);

        const investmentScore = this.calculateInvestmentScore(trendsMetrics, shoppingMetrics, newsMetrics);
        const confidencePercent = this.calculateConfidence(trendsMetrics, shoppingMetrics, newsMetrics);
        const growthPotential = this.calculateGrowthPotential(trendsMetrics);
        const riskLevel = this.calculateRiskLevel(trendsMetrics, confidencePercent);
        const marketMaturity = this.calculateMarketMaturity(trendsMetrics, shoppingMetrics);

        return {
            investmentScore,
            confidencePercent,
            growthPotential,
            riskLevel,
            marketMaturity
        };
    }
}

export default new MetricsCalculator();
export { MetricsCalculator, CalculatedMetrics, TrendsMetrics, ShoppingMetrics, NewsMetrics };

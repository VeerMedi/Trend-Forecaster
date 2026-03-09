import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BarChart3, Sparkles, Waves, ScrollText, Palette, Shirt, Trophy } from 'lucide-react';
import type { TrendAnalysis } from '../types';
import EditorialNarrative from './EditorialNarrative';
import EditorialInvestment from './editorial/EditorialInvestment';
import TrendHistorySection from './TrendHistorySection';
import WhyNowSection from './WhyNowSection';
import SignalSourcesTabs from './SignalSourcesTabs';
import FuturePredictionsSection from './FuturePredictionsSection';
import FashionInsightSection from './FashionInsightSection';
import StyleSuggestionsSection from './StyleSuggestionsSection';
import CompetitorAnalysis from './CompetitorAnalysis';
import ExpandableSignalCard from './ExpandableSignalCard';
import { getVisualContent, type VisualPhoto } from '../services/pexelsService';

interface EducationalDashboardProps {
    data: TrendAnalysis;
    selectedSources?: string[];
    selectedRegion?: string;
}

type DashboardSection = 'market' | 'signals' | 'predictions' | 'competitors' | 'why-now' | 'history' | 'visual' | 'styling';

/**
 * Redesigned Dashboard with Background Image and Expandable Card Grid
 * Elegant fashion editorial layout with translucent glassmorphism cards
 * Multiple cards can be open at once
 */
const EducationalDashboard: React.FC<EducationalDashboardProps> = ({
    data,
    selectedSources = [],
    selectedRegion = 'global'
}) => {
    // Allow multiple cards to be expanded at once
    const [expandedSections, setExpandedSections] = useState<Set<DashboardSection>>(new Set());
    const [backgroundImage, setBackgroundImage] = useState<string>('');

    // Fetch background image
    useEffect(() => {
        let mounted = true;

        const fetchBackground = async () => {
            try {
                const visualData = await getVisualContent(data.topic);
                if (mounted && visualData.photos && visualData.photos.length > 0) {
                    // Use a random photo from the set for variety
                    const randomIndex = Math.floor(Math.random() * Math.min(visualData.photos.length, 5));
                    setBackgroundImage(visualData.photos[randomIndex].url);
                }
            } catch (err) {
                console.error('Failed to load background image:', err);
            }
        };

        fetchBackground();
        return () => { mounted = false; };
    }, [data.topic]);

    // Extract real data
    const shoppingData = (data as any).shoppingData;
    const trendsData = (data as any).trendsData;
    const redditData = (data as any).redditData;
    const fashionMediaData = (data as any).fashionMediaData;

    // Check what data we have
    const hasShoppingData = shoppingData?.shopping_results?.length > 0;
    const productCount = shoppingData?.shopping_results?.length || 0;
    const hasTrendsData = trendsData || data.sentiment?.score !== undefined;
    const hasRedditData = redditData?.topPosts?.length > 0;
    const hasMediaData = fashionMediaData?.articles?.length > 0;

    const handleToggle = (section: DashboardSection) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section); // Close if already open
            } else {
                newSet.add(section); // Open card (don't close others)
            }
            return newSet;
        });
    };

    // Dashboard sections configuration with iOS widget-style sizes
    const sections = [
        {
            id: 'market' as DashboardSection,
            title: 'Market Intelligence',
            Icon: Briefcase,
            size: 'large' as const, // Large widget for important market data
            preview: {
                metric1: { label: 'Products', value: productCount.toString() },
                metric2: { label: 'Brands', value: (new Set(shoppingData?.shopping_results?.map((item: any) => item.source).filter(Boolean))).size.toString() || '0' },
                metric3: { label: 'Avg Price', value: shoppingData?.shopping_results?.length > 0 ? `$${Math.round(shoppingData.shopping_results.reduce((sum: number, item: any) => sum + parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'), 0) / shoppingData.shopping_results.length)}` : 'N/A' },
                metric4: { label: 'Range', value: 'Multi-tier' },
                subtitle: 'Pricing & Brand Analysis'
            },
            content: <EditorialInvestment shoppingData={shoppingData} region={selectedRegion} />
        },
        {
            id: 'signals' as DashboardSection,
            title: 'Live Signals',
            Icon: BarChart3,
            size: 'medium' as const,
            preview: {
                metric1: { label: 'Articles', value: fashionMediaData?.articles?.length?.toString() || '0' },
                metric2: { label: 'Reddit Posts', value: redditData?.topPosts?.length?.toString() || '0' },
                subtitle: 'Social & Media Buzz'
            },
            content: <SignalSourcesTabs analysis={data} />
        },
        {
            id: 'predictions' as DashboardSection,
            title: 'Future Predictions',
            Icon: Sparkles,
            size: 'large' as const, // Large for important predictions
            preview: {
                metric1: { label: 'Growth Probability', value: `${Math.round((data.sentiment?.positive || 0) * 100)}%` },
                metric2: { label: 'Forecast', value: `${data.forecast?.length || 12}mo` },
                metric3: { label: 'Confidence', value: 'High' },
                metric4: { label: 'Trend', value: data.sentiment?.positive > 0.7 ? 'Rising' : data.sentiment?.positive > 0.5 ? 'Stable' : 'Monitor' },
                subtitle: 'AI-Powered Analysis'
            },
            content: (
                <FuturePredictionsSection
                    topic={data.topic}
                    sentiment={data.sentiment}
                    futureOutlook={data.futureOutlook}
                    forecast={data.forecast}
                    trendsData={trendsData}
                />
            )
        },
        {
            id: 'competitors' as DashboardSection,
            title: 'Competitor Analysis',
            Icon: Trophy,
            size: 'medium' as const,
            preview: {
                metric1: { label: 'Brands', value: (new Set(shoppingData?.shopping_results?.map((item: any) => item.source).filter(Boolean))).size.toString() || '0' },
                metric2: { label: 'Leaders', value: 'Top 3' },
                subtitle: 'Market Leaders'
            },
            content: <CompetitorAnalysis shoppingData={shoppingData} topic={data.topic} region={selectedRegion} />
        },
        {
            id: 'why-now' as DashboardSection,
            title: 'Why Now',
            Icon: Waves,
            size: 'small' as const, // Small widget
            preview: {
                metric1: { label: 'Cultural Momentum', value: 'High' },
                metric2: { label: 'Timing', value: 'Peak' },
                subtitle: 'Cultural Context'
            },
            content: <WhyNowSection topic={data.topic} sentiment={data.sentiment} />
        },
        {
            id: 'history' as DashboardSection,
            title: 'History & Origins',
            Icon: ScrollText,
            size: 'small' as const,
            preview: {
                metric1: { label: 'Timeline', value: 'Full' },
                metric2: { label: 'Evolution', value: 'Deep' },
                subtitle: 'Trend Background'
            },
            content: <TrendHistorySection topic={data.topic} />
        },
        {
            id: 'visual' as DashboardSection,
            title: 'Visual Direction',
            Icon: Palette,
            size: 'wide' as const, // Wide widget for visual content
            preview: {
                metric1: { label: 'Photos', value: '12+' },
                metric2: { label: 'Colors', value: 'Key' },
                metric3: { label: 'Silhouette', value: 'Defined' },
                metric4: { label: 'Source', value: 'Pexels' },
                subtitle: 'Pinterest-Style Gallery'
            },
            content: (
                <FashionInsightSection
                    data={data}
                    shoppingData={shoppingData}
                    redditData={redditData}
                    fashionMediaData={fashionMediaData}
                />
            )
        },
        {
            id: 'styling' as DashboardSection,
            title: 'How to Wear It',
            Icon: Shirt,
            size: 'medium' as const,
            preview: {
                metric1: { label: 'Outfits', value: '5+' },
                metric2: { label: 'Tips', value: 'Expert' },
                subtitle: 'Styling Guide'
            },
            content: <StyleSuggestionsSection
                topic={data.topic}
                shoppingData={shoppingData}
                fashionCategory={(data as any).fashionCategory}
            />
        }
    ];

    return (
        <div className="w-full bg-black min-h-screen">
            {/* Hero - Editorial Narrative */}
            {data.editorialNarrative && (
                <EditorialNarrative narrative={data.editorialNarrative} topic={data.topic} />
            )}

            {/* Main Dashboard Container with Background Image */}
            <div className="relative min-h-screen">
                {/* Background Image Layer */}
                {backgroundImage && (
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={backgroundImage}
                            alt="Background"
                            className="w-full h-full object-cover opacity-40"
                            style={{ filter: 'blur(2px)' }}
                        />
                        {/* Dark overlay for readability - balanced to show image while keeping text readable */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/65" />
                    </div>
                )}

                {/* Fallback dark background if no image */}
                {!backgroundImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-black" />
                )}

                {/* Content Layer - with backdrop blur */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-extralight text-white mb-3 tracking-tight">
                            Deep Dive Analysis
                        </h2>
                        <p className="text-stone-300 font-light max-w-2xl mx-auto">
                            Explore comprehensive insights across market intelligence, trend signals, predictions, and styling guidance.
                            Click any card to discover detailed analysis.
                        </p>
                    </motion.div>

                    {/* Uniform 2x4 Card Grid with Enhanced Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={expandedSections.has(section.id) ? 'md:col-span-2' : ''}
                            >
                                <ExpandableSignalCard
                                    title={section.title}
                                    Icon={section.Icon}
                                    size="medium"
                                    isExpanded={expandedSections.has(section.id)}
                                    onToggle={() => handleToggle(section.id)}
                                    collapsedPreview={section.preview}
                                    expandedContent={section.content}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Hint */}
                    {expandedSections.size === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-xs text-stone-500 font-light italic">
                                Click cards to expand • Multiple cards can be open at once
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-20"></div>
        </div>
    );
};

export default EducationalDashboard;

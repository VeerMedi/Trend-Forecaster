import React, { useState, useCallback, useEffect } from 'react';
import { getTrendAnalysis } from './services/openrouterService';
import type { TrendAnalysis, View } from './types';
import { SOURCES } from './constants';
import BottomNav from './components/BottomNav';
import EducationalDashboard from './components/EducationalDashboard';
import FashionBrandsView from './components/FashionBrandsView';
import AlertsView from './components/AlertsView';
import Loader from './components/common/Loader';
import LoginView from './components/LoginView';
import EditorialSelector from './components/editorial/EditorialSelector';
import { SearchIcon, SparklesIcon, UserCircleIcon } from './components/common/Icons';
import { TrendingUp, Zap, Target, BarChart3, Globe, Sparkles } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<TrendAnalysis | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['web']);
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Hide header on scroll down, keep it hidden until user scrolls back to top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header only when near the top (less than 100px)
      if (currentScrollY < 100) {
        setHeaderVisible(true);
      } else {
        // Hide header when scrolled down
        setHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleAnalysis = useCallback(async () => {
    if (!topic || isLoading) return;
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setActiveView('dashboard');
    try {
      const data = await getTrendAnalysis(topic, selectedSources, selectedRegion);
      setAnalysisData(data);
    } catch (err) {
      setError('Failed to fetch trend analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic, isLoading, selectedSources, selectedRegion]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAnalysisData(null);
    setTopic('');
    setSelectedSources(['web']);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message={`Discovering trend directions for "${topic}"...`} />;
    }
    if (error) {
      return <div className="text-center text-red-400 mt-20">{error}</div>;
    }
    if (analysisData) {
      switch (activeView) {
        case 'dashboard':
          return <EducationalDashboard data={analysisData} selectedSources={selectedSources} selectedRegion={selectedRegion} />;
        case 'competitors':
          return <FashionBrandsView data={analysisData} />;
        case 'alerts':
          return <AlertsView />;
        default:
          return <EducationalDashboard data={analysisData} selectedSources={selectedSources} selectedRegion={selectedRegion} />;
      }
    }
    // Empty state - centered hero search
    return null; // Search is now absolutely positioned
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans flex flex-col relative">
      {/* Header - only show when there's data */}
      {analysisData && (
        <header className={`p-6 border-b border-stone-800/50 fixed top-0 left-0 right-0 bg-stone-950/90 backdrop-blur-md z-10 transition-transform duration-300 ease-in-out ${headerVisible ? 'translate-y-0' : '-translate-y-full'
          }`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-light tracking-tight text-stone-100">
                Trend <span className="text-amber-400">Direction</span>
              </h1>
              <div className="flex items-center space-x-4">
                <UserCircleIcon className="w-8 h-8 text-stone-500" />
                <button
                  onClick={handleLogout}
                  className="text-sm font-light text-stone-400 hover:text-stone-200 bg-stone-800/50 hover:bg-stone-800 px-4 py-1.5 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                placeholder="Search another trend..."
                className="w-full bg-stone-900/60 border border-stone-700/50 rounded-2xl pl-12 pr-32 py-3.5 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all font-light"
              />
              <button
                onClick={handleAnalysis}
                disabled={isLoading || !topic || selectedSources.length === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600/90 text-stone-950 px-5 py-2 rounded-xl font-medium text-sm hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
              >
                Explore
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Centered Hero Search - only show when NO data */}
      {!analysisData && !isLoading && (
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-950 to-stone-900" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          {/* Floating Animated Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <TrendingUp className="absolute top-20 left-10 w-12 h-12 text-amber-500/10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }} />
            <Sparkles className="absolute top-40 right-20 w-8 h-8 text-amber-400/15 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
            <BarChart3 className="absolute bottom-32 left-20 w-10 h-10 text-amber-500/10 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }} />
            <Target className="absolute top-60 right-40 w-10 h-10 text-amber-400/10 animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }} />
            <Globe className="absolute bottom-40 right-16 w-12 h-12 text-amber-500/10 animate-float" style={{ animationDelay: '1.5s', animationDuration: '7.5s' }} />
            <Zap className="absolute top-1/3 left-1/4 w-8 h-8 text-amber-400/10 animate-float" style={{ animationDelay: '0.5s', animationDuration: '6.5s' }} />
          </div>

          {/* CSS for floating animation */}
          <style>{`
            @keyframes float {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.1;
              }
              50% {
                transform: translateY(-20px) rotate(5deg);
                opacity: 0.2;
              }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `}</style>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            {/* Branding */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <SparklesIcon className="w-8 h-8 text-amber-400" />
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight text-white tracking-tight">
                  Trend <span className="text-amber-400 font-light">Direction</span>
                </h1>
                <SparklesIcon className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex items-center justify-center gap-3 text-lg sm:text-xl text-stone-400 font-light max-w-2xl mx-auto">
                <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                <p>AI-powered fashion forecasting with real-time market intelligence</p>
                <TrendingUp className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Editorial Region Selector */}
            <div className="mb-8 flex justify-center">
              <EditorialSelector
                tags={[
                  { id: 'global', label: 'Global', description: 'Worldwide trends and international market movements' },
                  { id: 'US', label: 'United States', description: 'American fashion culture, from streetwear to luxury' },
                  { id: 'IN', label: 'India', description: 'South Asian aesthetics and emerging market dynamics' },
                  { id: 'GB', label: 'United Kingdom', description: 'British heritage meets contemporary London style' }
                ]}
                selected={selectedRegion}
                onSelect={setSelectedRegion}
                label="Market Focus"
              />
            </div>

            {/* Hero Search Bar */}
            <div className="relative mb-8 max-w-2xl mx-auto">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                placeholder="e.g., 'Quiet Luxury' or 'Y2K Revival' or 'Sustainable Denim'"
                className="w-full bg-stone-900/40 border border-stone-700/50 rounded-3xl pl-14 pr-36 py-5 text-lg text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all font-light backdrop-blur-sm"
                autoFocus
              />
              <button
                onClick={handleAnalysis}
                disabled={isLoading || !topic || selectedSources.length === 0}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-600 text-stone-950 px-8 py-3 rounded-2xl font-medium text-base hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-900/20"
              >
                Explore
              </button>
            </div>

            {/* Logout button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleLogout}
                className="text-sm font-light text-stone-500 hover:text-stone-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}


      <main className="flex-grow p-6 pb-32 pt-48">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {analysisData && (
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      )}
    </div>
  );
}
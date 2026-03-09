import React, { useState, useEffect } from 'react';
import { Search, Users, BarChart3, TrendingUp, Brain, Sparkles, Lightbulb, Zap, Target, Shirt, TrendingDown } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

// Expanded fashion facts collection (50+ facts)
const fashionFacts = [
  "The word 'jeans' comes from 'Genoa,' the Italian city where the fabric originated.",
  "Coco Chanel popularized the little black dress in the 1920s, making it a wardrobe staple.",
  "The average person owns 7 pairs of jeans but wears only 4 regularly.",
  "High heels were originally worn by men in the 10th century for horseback riding.",
  "The bikini was named after Bikini Atoll, where atomic tests were conducted—meant to be 'explosive.'",
  "Levi Strauss and Jacob Davis invented blue jeans in 1873, patenting riveted denim workwear.",
  "The fashion industry is worth over $2.5 trillion globally.",
  "Color trends are decided 2 years in advance by the Pantone Color Institute.",
  "The hoodie was invented in the 1930s for workers in freezing New York warehouses.",
  "Stiletto heels get their name from the Italian stiletto dagger due to their narrow, sharp heel.",
  "The average American throws away 81 pounds of clothing per year.",
  "Vintage Hermès Birkin bags often appreciate in value, outperforming gold and stock market returns.",
  "Designer Christian Louboutin's red soles were inspired by an assistant painting her nails red.",
  "The zipper was invented in 1913 but didn't become popular until the 1920s.",
  "Neckties were introduced by Croatian mercenaries in the 17th century.",
  "The business suit as we know it was popularized by Beau Brummell in early 1800s England.",
  "Denim gets softer with each wash because the cotton fibers break down slightly.",
  "The T-shirt became acceptable outerwear after Marlon Brando wore one in 'A Streetcar Named Desire' (1951).",
  "Converse Chuck Taylors were the official shoe of the NBA until the 1970s.",
  "The little pocket in jeans was originally designed for pocket watches.",
  "Alexander McQueen's 'bumster' pants from 1996 lowered the waistline by 8 inches.",
  "The fashion industry produces 10% of global carbon emissions—more than aviation and shipping combined.",
  "Prada started as a leather goods shop in 1913, selling trunks and handbags.",
  "The wrap dress was invented by Diane von Fürstenberg in 1974 and sold over 5 million in two years.",
  "Skinny jeans were popularized by rock bands in the 2000s, especially The Strokes.",
  "The average fashion show costs $200,000-$300,000 to produce.",
  "Yves Saint Laurent was the first designer to introduce tuxedos for women in 1966.",
  "The LBD (Little Black Dress) became symbolic of versatility and elegance after Audrey Hepburn wore Givenchy.",
  "Crocs sell over 100 million pairs per year worldwide.",
  "The bomber jacket was created in 1917 for WWI pilots.",
  "Vivienne Westwood is credited with bringing punk fashion into the mainstream in the 1970s.",
  "The fashion calendar operates on 6-month advance cycles: Spring/Summer and Fall/Winter.",
  "Platform shoes were worn by ancient Greek actors to signify character importance on stage.",
  "Ralph Lauren designed the costumes for 'The Great Gatsby' (1974), launching his Hollywood career.",
  "Sustainable fashion brand Patagonia encourages customers NOT to buy their products unless necessary.",
  "The average garment travels 1,500 miles before reaching a store.",
  "Comme des Garçons translates to 'like boys' in French, reflecting Rei Kawakubo's androgynous designs.",
  "Nike's swoosh logo cost just $35 when designed by Carolyn Davidson in 1971.",
  "The 'New Look' by Christian Dior in 1947 used 20+ yards of fabric per dress, defying post-war rationing.",
  "Fast fashion items are worn an average of 7 times before being discarded.",
  "The oldest surviving pair of Levi's 501 jeans sold for $60,000 at auction.",
  "Rei Kawakubo of Comme des Garçons intentionally creates 'anti-fashion'—challenging beauty norms.",
  "The turtleneck became a fashion statement after Steve Jobs wore it as his signature look.",
  "Fashion Week originated in 1943 in New York when WWII prevented buyers from traveling to Paris.",
  "The first fashion magazine, 'Cabinet des Modes,' was published in France in 1785.",
  "Denim production uses 1,800 gallons of water per pair of jeans on average.",
  "The Breton stripe shirt was the official uniform of French navy sailors before becoming fashionable.",
  "Gucci's double-G logo represents founder Guccio Gucci's initials.",
  "The color black became fashionable for everyday wear in the 14th century, previously reserved for mourning.",
  "Balenciaga's Triple S sneaker helped launch the 'ugly shoe' trend worth billions today.",
  "Vintage fashion resale is expected to grow 3x faster than traditional retail by 2030.",
];

// Dynamic status messages with Lucide icons
const loadingStages = [
  { stage: 'Analyzing search patterns...', Icon: Search, duration: 3000 },
  { stage: 'Scanning fashion communities...', Icon: Users, duration: 5000 },
  { stage: 'Consulting trend databases...', Icon: BarChart3, duration: 8000 },
  { stage: 'Extracting market signals...', Icon: TrendingUp, duration: 12000 },
  { stage: 'Synthesizing insights...', Icon: Brain, duration: 18000 },
  { stage: 'Finalizing predictions...', Icon: Sparkles, duration: 25000 },
];

const Loader: React.FC<LoaderProps> = ({ message }) => {
  const [currentFact, setCurrentFact] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Rotate fashion facts every 4 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % fashionFacts.length);
    }, 4000);

    return () => clearInterval(factInterval);
  }, []);

  // Track elapsed time and update stage
  useEffect(() => {
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);

      // Find current stage based on elapsed time
      const stageIndex = loadingStages.findIndex((s, i) => {
        const nextStage = loadingStages[i + 1];
        return !nextStage || elapsed < nextStage.duration;
      });
      setCurrentStage(Math.max(0, stageIndex));
    }, 500);

    return () => clearInterval(timeInterval);
  }, []);

  const progress = Math.min(95, (elapsedTime / 30000) * 100); // Cap at 95% until actual completion
  const CurrentIcon = loadingStages[currentStage]?.Icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Shirt className="absolute top-20 left-10 w-16 h-16 text-amber-500/5 animate-float-slow" style={{ animationDelay: '0s' }} />
        <Sparkles className="absolute top-1/4 right-20 w-12 h-12 text-amber-400/8 animate-float-slow" style={{ animationDelay: '2s' }} />
        <TrendingUp className="absolute bottom-1/4 left-1/4 w-14 h-14 text-amber-500/6 animate-float-slow" style={{ animationDelay: '1s' }} />
        <Target className="absolute top-1/3 right-1/3 w-10 h-10 text-amber-400/5 animate-float-slow" style={{ animationDelay: '3s' }} />
        <BarChart3 className="absolute bottom-20 right-16 w-16 h-16 text-amber-500/6 animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <Zap className="absolute top-40 left-1/3 w-8 h-8 text-amber-400/7 animate-float-slow" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main loader card */}
        <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl p-10 border border-stone-700/40 shadow-2xl">

          {/* Animated logo/spinner */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer spinning ring with gradient */}
              <div className="w-24 h-24 rounded-full animate-spin" style={{
                background: 'linear-gradient(90deg, transparent 50%, rgba(217, 119, 6, 0.3) 50%)',
                border: '4px solid rgba(68, 64, 60, 0.4)',
                borderTopColor: 'rgb(217, 119, 6)',
              }}></div>
              {/* Inner glow ring */}
              <div className="absolute inset-2 w-20 h-20 rounded-full border-2 border-amber-500/20 animate-pulse"></div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrentIcon className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main message */}
          <h2 className="text-2xl md:text-3xl font-light text-center text-stone-100 mb-3">
            {message || 'Analyzing Fashion Trends...'}
          </h2>

          {/* Current stage */}
          <p className="text-center text-amber-400 font-medium mb-8 animate-pulse">
            {loadingStages[currentStage]?.stage || 'Processing...'}
          </p>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-500 ease-out shadow-lg shadow-amber-500/50"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-stone-500 text-center mt-2">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Fashion fact carousel */}
          <div className="bg-stone-950/40 rounded-2xl p-6 border border-stone-700/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-400 flex-shrink-0 animate-pulse" />
              <div className="flex-1 min-h-[60px]">
                <p className="text-xs font-medium tracking-widest uppercase text-stone-500 mb-2">
                  Fashion Fact #{currentFact + 1}
                </p>
                <p className="text-sm text-stone-300 leading-relaxed animate-fade-in">
                  {fashionFacts[currentFact]}
                </p>
              </div>
            </div>
          </div>

          {/* Stage indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {loadingStages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx <= currentStage
                  ? 'w-8 bg-amber-500 shadow-sm shadow-amber-500/50'
                  : 'w-2 bg-stone-700'
                  }`}
              ></div>
            ))}
          </div>

          {/* Estimated time remaining */}
          <p className="text-center text-xs text-stone-500 mt-6">
            Typically completes in 30-45 seconds
          </p>
        </div>

        {/* Subtle hint text */}
        <p className="text-center text-xs text-stone-600 mt-6">
          Analyzing real-time data from multiple fashion intelligence sources
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.05;
          }
          33% {
            transform: translateY(-30px) translateX(10px) rotate(5deg);
            opacity: 0.08;
          }
          66% {
            transform: translateY(-15px) translateX(-10px) rotate(-5deg);
            opacity: 0.06;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;

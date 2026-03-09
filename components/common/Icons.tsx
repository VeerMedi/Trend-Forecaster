import React from 'react';
import {
  Search,
  Sparkles,
  BarChart3,
  Users,
  Bell,
  BellRing,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Beaker,
  Link2,
  UserCircle,
  Key,
  Globe,
  MessageCircle,
  Newspaper,
  GraduationCap
} from 'lucide-react';

type IconProps = React.ComponentProps<typeof Search>;

// Animated Search Icon with pulse effect
export const SearchIcon: React.FC<IconProps> = (props) => (
  <div className="relative inline-flex">
    <Search {...props} />
    <style>{`
      @keyframes search-pulse {
        0%, 100% {
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
      }
    `}</style>
  </div>
);

// Animated Sparkles Icon with rotation
export const SparklesIcon: React.FC<IconProps> = (props) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sparkles
      {...props}
      className={`${props.className || ''} transition-transform duration-1000 ${isAnimating ? 'rotate-12 scale-110' : ''}`}
    />
  );
};

export const ChartBarIcon: React.FC<IconProps> = (props) => <BarChart3 {...props} />;
export const UsersIcon: React.FC<IconProps> = (props) => <Users {...props} />;
export const BellIcon: React.FC<IconProps> = (props) => <Bell {...props} />;
export const BellAlertIcon: React.FC<IconProps> = (props) => <BellRing {...props} />;
export const CheckCircleIcon: React.FC<IconProps> = (props) => <CheckCircle {...props} />;
export const ArrowTrendingUpIcon: React.FC<IconProps> = (props) => <TrendingUp {...props} />;
export const LightBulbIcon: React.FC<IconProps> = (props) => <Lightbulb {...props} />;
export const ForwardIcon: React.FC<IconProps> = (props) => <ChevronRight {...props} />;
export const ShieldCheckIcon: React.FC<IconProps> = (props) => <ShieldCheck {...props} />;
export const BeakerIcon: React.FC<IconProps> = (props) => <Beaker {...props} />;
export const LinkIcon: React.FC<IconProps> = (props) => <Link2 {...props} />;
export const UserCircleIcon: React.FC<IconProps> = (props) => <UserCircle {...props} />;
export const KeyIcon: React.FC<IconProps> = (props) => <Key {...props} />;
export const GlobeAltIcon: React.FC<IconProps> = (props) => <Globe {...props} />;
export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => <MessageCircle {...props} />;
export const NewspaperIcon: React.FC<IconProps> = (props) => <Newspaper {...props} />;
export const AcademicCapIcon: React.FC<IconProps> = (props) => <GraduationCap {...props} />;
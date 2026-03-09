import { ChartBarIcon, UsersIcon, BellIcon, GlobeAltIcon, NewspaperIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, SparklesIcon } from './components/common/Icons';

export const VIEWS = [
  { id: 'dashboard', label: 'Inspiration', icon: SparklesIcon },
  { id: 'competitors', label: 'Brands', icon: UsersIcon },
  { id: 'alerts', label: 'Alerts', icon: BellIcon },
] as const;

export const SOURCES = [
  { id: 'web', label: 'Trend Signals', icon: GlobeAltIcon },
  { id: 'social', label: 'Social Buzz', icon: ChatBubbleLeftRightIcon },
  { id: 'news', label: 'Fashion Media', icon: NewspaperIcon },
  { id: 'academic', label: 'Research', icon: AcademicCapIcon },
] as const;

// Fashion-specific language mappings
export const FASHION_LABELS = {
  growthStrength: {
    exploding: 'Exploding',
    rising: 'Rising',
    stable: 'Stable',
    declining: 'Fading',
  },
  trendMoods: ['Bold', 'Calm', 'Playful', 'Elegant', 'Experimental'],
  directions: {
    color: ['Earth Tones', 'Soft Pastels', 'Monochrome', 'Bold Accents', 'Seasonal Neutrals'],
    fabric: ['Natural Fibers', 'Denim Evolution', 'Technical Fabrics', 'Luxe Textures', 'Artisan Knits'],
    pattern: ['Minimal', 'Abstract Forms', 'Heritage Motifs', 'Organic Prints', 'Tonal Patterns'],
  },
} as const;
import React from 'react';

export interface Region {
    code: 'global' | 'IN' | 'US' | 'GB';
    name: string;
    flag: string;
    currency: string;
    currencySymbol: string;
    conversionRate: number; // Relative to USD
}

export const REGIONS: Region[] = [
    {
        code: 'global',
        name: 'Global',
        flag: '🌍',
        currency: 'USD',
        currencySymbol: '$',
        conversionRate: 1
    },
    {
        code: 'IN',
        name: 'India',
        flag: '🇮🇳',
        currency: 'INR',
        currencySymbol: '₹',
        conversionRate: 83
    },
    {
        code: 'US',
        name: 'United States',
        flag: '🇺🇸',
        currency: 'USD',
        currencySymbol: '$',
        conversionRate: 1
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        flag: '🇬🇧',
        currency: 'GBP',
        currencySymbol: '£',
        conversionRate: 0.79
    }
];

interface RegionSelectorProps {
    selectedRegion: string;
    onChange: (region: string) => void;
}

/**
 * Region Selector Component
 * Allows users to filter trends by geographic region
 */
const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onChange }) => {
    return (
        <div className="mb-6">
            <div className="text-xs text-stone-500 uppercase tracking-wider mb-3">
                Select Region
            </div>
            <div className="flex gap-2 flex-wrap">
                {REGIONS.map((region) => (
                    <button
                        key={region.code}
                        onClick={() => onChange(region.code)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all
                            ${selectedRegion === region.code
                                ? 'bg-gradient-to-r from-violet-900/60 to-purple-900/60 border-violet-700/70 text-violet-200 shadow-lg shadow-violet-900/30'
                                : 'bg-stone-900/40 border-stone-700/50 text-stone-400 hover:bg-stone-800/60 hover:text-stone-300 hover:border-stone-600/70'
                            }
                            border
                        `}
                    >
                        <span className="text-2xl">{region.flag}</span>
                        <div className="text-left">
                            <div className="text-sm font-medium">{region.name}</div>
                            <div className="text-xs opacity-70">{region.currency}</div>
                        </div>
                        {selectedRegion === region.code && (
                            <div className="w-2 h-2 rounded-full bg-violet-400 ml-1" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RegionSelector;

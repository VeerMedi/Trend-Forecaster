import React, { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';

interface EditorialTag {
    id: string;
    label: string;
    description: string;
}

interface EditorialSelectorProps {
    tags: EditorialTag[];
    selected: string;
    onSelect: (id: string) => void;
    label?: string;
}

/**
 * Editorial Tag Selector
 * Pill-shaped curation tool with poetic hover descriptions
 * Feels like choosing a story, not toggling a feature
 */
const EditorialSelector: React.FC<EditorialSelectorProps> = ({
    tags,
    selected,
    onSelect,
    label
}) => {
    const [hoveredTag, setHoveredTag] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {/* Optional Label */}
            {label && (
                <div className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                    {label}
                </div>
            )}

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-3">
                {tags.map((tag) => {
                    const isSelected = selected === tag.id;
                    const isHovered = hoveredTag === tag.id;

                    return (
                        <button
                            key={tag.id}
                            onClick={() => onSelect(tag.id)}
                            onMouseEnter={() => setHoveredTag(tag.id)}
                            onMouseLeave={() => setHoveredTag(null)}
                            className={`
                                relative px-6 py-3 rounded-full font-light text-sm
                                transition-all duration-300 ease-out
                                flex items-center gap-2
                                ${isSelected
                                    ? 'bg-white text-black shadow-lg shadow-white/20'
                                    : 'bg-stone-900/50 text-stone-300 border border-stone-700/50 hover:border-stone-500/50 hover:bg-stone-800/50'
                                }
                            `}
                        >
                            {tag.id === 'global' ? (
                                <Globe className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
                            ) : (
                                <MapPin className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
                            )}
                            {tag.label}
                        </button>
                    );
                })}
            </div>

            {/* Hover Description */}
            <div className="h-12 flex items-center">
                {hoveredTag && (
                    <p className="text-sm text-stone-400 font-light italic animate-fade-in">
                        — {tags.find(t => t.id === hoveredTag)?.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EditorialSelector;

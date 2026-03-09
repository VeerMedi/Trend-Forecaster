import React from 'react';
import { Lightbulb, Scissors, Target } from 'lucide-react';

interface DesignerTakeawayProps {
    takeaway: string;
    type?: 'insight' | 'styling' | 'prediction';
}

const DesignerTakeaway: React.FC<DesignerTakeawayProps> = ({ takeaway, type = 'insight' }) => {
    const getStyle = () => {
        switch (type) {
            case 'insight':
                return {
                    bg: 'bg-stone-800/30',
                    border: 'border-amber-500/30',
                    Icon: Lightbulb,
                    label: 'What This Means for Design'
                };
            case 'styling':
                return {
                    bg: 'bg-stone-800/30',
                    border: 'border-amber-500/30',
                    Icon: Scissors,
                    label: 'Styling Application'
                };
            case 'prediction':
                return {
                    bg: 'bg-stone-800/30',
                    border: 'border-amber-500/30',
                    Icon: Target,
                    label: 'Collection Strategy'
                };
        }
    };

    const style = getStyle();
    const StyleIcon = style.Icon;

    return (
        <div className={`${style.bg} border ${style.border} rounded-xl p-4 mt-6`}>
            <div className="flex items-start gap-3">
                <StyleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-xs font-light text-amber-300 uppercase tracking-widest mb-2">
                        {style.label}
                    </h4>
                    <p className="text-stone-200 font-light leading-relaxed text-sm">
                        {takeaway}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DesignerTakeaway;

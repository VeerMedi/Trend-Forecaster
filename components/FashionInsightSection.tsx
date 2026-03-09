import React from 'react';
import PinterestGallery from './PinterestGallery';
import DesignerTakeaway from './DesignerTakeaway';

interface FashionInsightSectionProps {
    data: any;
    shoppingData?: any;
    redditData?: any;
    fashionMediaData?: any;
}

/**
 * Visual Directions Section with Pinterest-style Gallery
 * Displays curated fashion images from Pexels
 */
const FashionInsightSection: React.FC<FashionInsightSectionProps> = ({ data }) => {
    return (
        <section className="space-y-8">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-sm font-light tracking-widest uppercase text-stone-500 mb-2">
                    Visual Trend Intelligence
                </h2>
                <p className="text-stone-400 font-light text-lg max-w-xl mx-auto">
                    Image-anchored insights for creative direction
                </p>
            </div>

            {/* Pinterest Gallery */}
            <PinterestGallery topic={data.topic} />

            {/* Designer Takeaway */}
            <DesignerTakeaway
                type="insight"
                takeaway="Use these visual references to inform key pieces for SS25. Feature in editorial lookbooks to signal trend awareness, then gauge audience response before committing production budgets."
            />
        </section>
    );
};

export default FashionInsightSection;

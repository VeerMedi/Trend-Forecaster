import React from 'react';

interface EditorialHeroProps {
    imageUrl: string;
    headline: string;
    subheadline?: string;
    body?: string;
    overlayOpacity?: number;
    textPosition?: 'center' | 'bottom' | 'top-left';
}

/**
 * Editorial Hero - Large Image with Text Overlay
 * Magazine-style visual storytelling with asymmetric text placement
 */
const EditorialHero: React.FC<EditorialHeroProps> = ({
    imageUrl,
    headline,
    subheadline,
    body,
    overlayOpacity = 70,
    textPosition = 'bottom'
}) => {
    const positionClasses = {
        'center': 'items-center justify-center text-center',
        'bottom': 'items-end justify-start pb-16 sm:pb-20 lg:pb-24',
        'top-left': 'items-start justify-start pt-16 sm:pt-20 lg:pt-24'
    };

    return (
        <div className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* Asymmetric Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent"
                    style={{ opacity: overlayOpacity / 100 }}
                />

                {/* Additional left-side gradient for text anchor */}
                {textPosition !== 'center' && (
                    <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/80 to-transparent" />
                )}
            </div>

            {/* Content - Asymmetrically Placed */}
            <div className={`relative z-10 h-full flex flex-col ${positionClasses[textPosition]} px-8 sm:px-12 lg:px-16 max-w-7xl mx-auto`}>
                <div className="max-w-3xl"> {/* Constrain text width for asymmetry */}
                    {/* Headline - Left-aligned */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white leading-[0.95] tracking-tight mb-6">
                        {headline}
                    </h1>

                    {/* Subheadline */}
                    {subheadline && (
                        <p className="text-xl sm:text-2xl md:text-3xl font-light text-stone-200 mb-6 leading-relaxed">
                            {subheadline}
                        </p>
                    )}

                    {/* Body */}
                    {body && (
                        <p className="text-base sm:text-lg font-light text-stone-300 leading-relaxed border-l-2 border-stone-600 pl-4">
                            {body}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorialHero;

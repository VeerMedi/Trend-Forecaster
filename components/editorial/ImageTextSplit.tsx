import React from 'react';

interface ImageTextSplitProps {
    imageUrl: string;
    imagePosition?: 'left' | 'right';
    headline: string;
    body: string;
    caption?: string;
}

/**
 * Image + Text Split Layout
 * Asymmetric editorial spread with image and text side-by-side
 */
const ImageTextSplit: React.FC<ImageTextSplitProps> = ({
    imageUrl,
    imagePosition = 'left',
    headline,
    body,
    caption
}) => {
    return (
        <div className={`grid lg:grid-cols-2 gap-0 items-center ${imagePosition === 'right' ? 'lg:grid-flow-dense' : ''}`}>
            {/* Image Side */}
            <div className={`relative h-[60vh] lg:h-[80vh] overflow-hidden ${imagePosition === 'right' ? 'lg:col-start-2' : ''}`}>
                <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />

                {/* Caption overlaid on image - bottom left */}
                {caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-sm text-stone-300 font-light italic">
                            {caption}
                        </p>
                    </div>
                )}
            </div>

            {/* Text Side */}
            <div className={`px-8 sm:px-12 lg:px-16 py-16 ${imagePosition === 'right' ? 'lg:col-start-1' : ''}`}>
                <h3 className="text-4xl sm:text-5xl font-extralight text-white mb-6 leading-tight">
                    {headline}
                </h3>
                <div className="text-lg text-stone-300 font-light leading-relaxed space-y-4 border-l-2 border-stone-700 pl-6">
                    {body.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageTextSplit;

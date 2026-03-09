import React from 'react';

interface ImageWithCaptionProps {
    imageUrl: string;
    caption: string;
    credit?: string;
    aspectRatio?: '16/9' | '4/3' | '3/2' | 'square';
}

/**
 * Editorial Image with Caption
 * Magazine-style image treatment with intentional captions
 */
const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
    imageUrl,
    caption,
    credit,
    aspectRatio = '16/9'
}) => {
    const aspectClasses = {
        '16/9': 'aspect-[16/9]',
        '4/3': 'aspect-[4/3]',
        '3/2': 'aspect-[3/2]',
        'square': 'aspect-square'
    };

    return (
        <figure className="w-full space-y-4">
            {/* Image */}
            <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden bg-stone-900`}>
                <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Caption - Magazine style */}
            <figcaption className="px-2">
                <p className="text-sm text-stone-400 font-light leading-relaxed">
                    {caption}
                </p>
                {credit && (
                    <p className="text-xs text-stone-600 font-light mt-2 uppercase tracking-wider">
                        {credit}
                    </p>
                )}
            </figcaption>
        </figure>
    );
};

export default ImageWithCaption;

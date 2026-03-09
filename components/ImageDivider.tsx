import React, { useState, useEffect } from 'react';
import { getFashionImage } from '../services/unsplashService';

interface ImageDividerProps {
    imageQuery: string;    // Custom query for this specific image
    overlayText?: string;   // Optional text overlay
    height?: 'sm' | 'md' | 'lg';  // Section height
    alignment?: 'left' | 'center' | 'right';  // Text alignment
}

/**
 * Reusable Image Divider Component
 * Creates visual breaks between sections with contextual fashion imagery
 */
const ImageDivider: React.FC<ImageDividerProps> = ({
    imageQuery,
    overlayText,
    height = 'md',
    alignment = 'center'
}) => {
    const [image, setImage] = useState<{ url: string; photographer: string } | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const imageUrl = await getFashionImage(imageQuery);
                if (imageUrl) {
                    setImage({
                        url: `${imageUrl}&w=1600&q=80&fit=crop`,
                        photographer: 'Unsplash'
                    });
                }
            } catch (error) {
                console.error('Failed to load divider image:', error);
            }
        };

        loadImage();
    }, [imageQuery]);

    const heightClasses = {
        sm: 'min-h-[40vh]',
        md: 'min-h-[50vh]',
        lg: 'min-h-[60vh]'
    };

    const alignmentClasses = {
        left: 'justify-start items-end',
        center: 'justify-center items-center',
        right: 'justify-end items-end'
    };

    return (
        <section className={`relative w-full ${heightClasses[height]} overflow-hidden rounded-2xl my-8`}>
            {/* Background Image */}
            {image && (
                <div className="absolute inset-0">
                    {/* Blur placeholder */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />

                    {/* Actual image */}
                    <img
                        src={image.url}
                        alt="Fashion editorial divider"
                        className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Gradient for text if overlayText exists */}
                    {overlayText && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    )}
                </div>
            )}

            {/* Fallback gradient if no image */}
            {!image && (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
            )}

            {/* Optional Text Overlay */}
            {overlayText && (
                <div className={`relative h-full flex ${alignmentClasses[alignment]} p-8 md:p-12`}>
                    <h3 className="text-3xl md:text-5xl font-light text-white tracking-tight max-w-3xl">
                        {overlayText}
                    </h3>
                </div>
            )}

            {/* Photo Credit (subtle, bottom-right) */}
            {image && !overlayText && (
                <div className="absolute bottom-4 right-4 text-xs text-white/60 flex items-center gap-1">
                    <span>📸</span>
                    <span>{image.photographer}</span>
                </div>
            )}
        </section>
    );
};

export default ImageDivider;

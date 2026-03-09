import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Camera } from 'lucide-react';
import { getVisualContent, type VisualPhoto } from '../services/pexelsService';

interface PinterestGalleryProps {
    topic: string;
}

/**
 * Pinterest-style Masonry Gallery
 * Displays fashion images from Pexels in an elegant grid
 */
const PinterestGallery: React.FC<PinterestGalleryProps> = ({ topic }) => {
    const [photos, setPhotos] = useState<VisualPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchImages = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await getVisualContent(topic);

                if (mounted) {
                    setPhotos(data.photos || []);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch images:', err);
                if (mounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchImages();
        return () => { mounted = false; };
    }, [topic]);

    // Skeleton loader
    const SkeletonCard = ({ index }: { index: number }) => {
        // Vary heights for masonry effect
        const heights = ['h-64', 'h-80', 'h-72', 'h-96'];
        const height = heights[index % heights.length];

        return (
            <div className={`${height} rounded-xl bg-stone-800/30 animate-pulse`}>
                <div className="h-full w-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-stone-700" />
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <Camera className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <p className="text-stone-500 font-light">Unable to load gallery at this time</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Gallery Header */}
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-light text-stone-200 mb-2 tracking-tight">
                    Visual Inspiration
                </h3>
                <p className="text-stone-400 font-light text-sm">
                    Curated imagery from Pexels • {loading ? '...' : `${photos.length} images`}
                </p>
            </div>

            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        // Loading skeletons
                        [...Array(12)].map((_, i) => (
                            <div key={`skeleton-${i}`} className="break-inside-avoid mb-4">
                                <SkeletonCard index={i} />
                            </div>
                        ))
                    ) : (
                        // Actual images
                        photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid mb-4"
                            >
                                <ImageCard photo={photo} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pexels Attribution */}
            {!loading && photos.length > 0 && (
                <div className="mt-8 text-center">
                    <p className="text-xs text-stone-600 font-light">
                        Photos provided by{' '}
                        <a
                            href="https://www.pexels.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Pexels
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

/**
 * Individual Image Card with Hover Overlay
 */
const ImageCard: React.FC<{ photo: VisualPhoto }> = ({ photo }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="group relative overflow-hidden rounded-xl bg-stone-900/40 border border-stone-800/50 hover:border-amber-500/30 transition-all duration-300">
            {/* Image */}
            <img
                src={photo.url}
                alt={photo.alt || `Fashion inspiration by ${photo.photographer}`}
                className={`w-full h-auto transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    } group-hover:scale-105`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
            />

            {/* Loading placeholder */}
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-800/30">
                    <Camera className="w-8 h-8 text-stone-700 animate-pulse" />
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Photographer Credit */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-stone-300 font-light">
                                {photo.photographer}
                            </span>
                        </div>
                        <a
                            href={photo.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-stone-800/60 hover:bg-amber-600/20 rounded-lg transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinterestGallery;

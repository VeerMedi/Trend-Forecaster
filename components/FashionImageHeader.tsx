import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getVisualContent, type VisualVideo } from '../services/pexelsService';

interface FashionImageHeaderProps {
    topic: string;
    sentiment?: { positive: number; neutral: number; negative: number };
    summary: string;
}

/**
 * Hero Section with Pexels Video Background
 * Elegant text overlay on fashion video loop
 */
const FashionImageHeader: React.FC<FashionImageHeaderProps> = ({
    topic,
    sentiment,
    summary
}) => {
    const [video, setVideo] = useState<VisualVideo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchVideo = async () => {
            try {
                const data = await getVisualContent(topic);

                if (mounted && data.videos && data.videos.length > 0) {
                    // Get the first video
                    setVideo(data.videos[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load video:', err);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchVideo();
        return () => { mounted = false; };
    }, [topic]);

    // Sentiment color (keeping original logic)
    const sentimentColor = sentiment && sentiment.positive > 0.6
        ? 'text-emerald-300'
        : sentiment && sentiment.positive > 0.4
            ? 'text-amber-300'
            : 'text-rose-300';

    return (
        <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-black">
            {/* Video Background */}
            {video && !loading ? (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster={video.thumbnail}
                >
                    <source src={video.videoUrl} type="video/mp4" />
                </video>
            ) : (
                /* Loading/Fallback State */
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950" />
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

            {/* Content Overlay */}
            <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Animated Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        {topic}
                    </motion.h1>

                    {/* Decorative Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"
                    />

                    {/* Summary */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-lg sm:text-xl md:text-2xl font-light text-stone-200 max-w-3xl mx-auto leading-relaxed mb-8"
                    >
                        {summary}
                    </motion.p>

                    {/* Sentiment Badge (if available) */}
                    {sentiment && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-950/60 backdrop-blur-md border border-stone-700/50 rounded-full"
                        >
                            <div className={`w-2 h-2 rounded-full ${sentimentColor.replace('text-', 'bg-')} animate-pulse`} />
                            <span className="text-sm font-light text-stone-300 tracking-wide">
                                {Math.round(sentiment.positive * 100)}% Positive Sentiment
                            </span>
                        </motion.div>
                    )}

                    {/* Video Credit */}
                    {video && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="absolute bottom-6 right-6 text-xs text-stone-500 font-light"
                        >
                            Video by{' '}
                            <a
                                href={video.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                {video.creator}
                            </a>
                            {' '}on Pexels
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-stone-400 font-light tracking-widest uppercase">
                        Scroll to Explore
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-8 border border-stone-600 rounded-full flex items-start justify-center p-1.5"
                    >
                        <div className="w-1 h-2 bg-amber-400 rounded-full" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FashionImageHeader;

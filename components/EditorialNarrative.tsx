import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getVisualContent, type VisualVideo } from '../services/pexelsService';

interface EditorialNarrativeProps {
    narrative: string;
    topic: string;
}

/**
 * Editorial Hero Section with Pexels Video Background
 * Magazine-style full-screen video with bold typography overlay
 */
const EditorialNarrative: React.FC<EditorialNarrativeProps> = ({ narrative, topic }) => {
    const [video, setVideo] = useState<VisualVideo | null>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadVideo = async () => {
            try {
                const data = await getVisualContent(topic);
                if (mounted && data.videos && data.videos.length > 0) {
                    setVideo(data.videos[0]);
                }
            } catch (error) {
                console.error('Failed to load hero video:', error);
            }
        };

        loadVideo();
        return () => { mounted = false; };
    }, [topic]);

    const heroHeadline = narrative.split('.')[0] + '.';
    const bodyText = narrative.split('.').slice(1).join('.').trim();

    return (
        <section className="relative w-full min-h-[75vh] overflow-hidden rounded-3xl mb-8">
            {/* Video Background */}
            {video ? (
                <div className="absolute inset-0">
                    {/* Loading placeholder */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} />

                    {/* Video element */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                        poster={video.thumbnail}
                        onLoadedData={() => setVideoLoaded(true)}
                    >
                        <source src={video.videoUrl} type="video/mp4" />
                    </video>

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
            ) : (
                // Fallback gradient if no video
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950" />
            )}

            {/* Content */}
            <div className="relative h-full min-h-[75vh] flex flex-col justify-end p-8 md:p-12 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                        <span className="text-xs font-light tracking-widest uppercase text-white/90">
                            The Story Right Now
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] tracking-tight text-white mb-6 max-w-5xl"
                >
                    {heroHeadline}
                </motion.h1>

                {bodyText && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-base md:text-lg font-light leading-relaxed text-white/90 max-w-3xl mb-8"
                    >
                        {bodyText}
                    </motion.p>
                )}

                {/* Video Credit */}
                {video && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex items-center gap-2 text-xs text-white/60"
                    >
                        <span>Video by</span>
                        <a
                            href={video.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white/90 transition-colors"
                        >
                            {video.creator}
                        </a>
                        <span>•</span>
                        <a
                            href="https://www.pexels.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/90 transition-colors"
                        >
                            Pexels
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default EditorialNarrative;

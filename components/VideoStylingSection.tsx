import React, { useState } from 'react';
import { Play, Clock, Video } from 'lucide-react';

interface VideoStylingProps {
    topic: string;
    videos?: Array<{
        id: number;
        thumbnail: string;
        videoUrl: string;
        duration: number;
        creator: string;
    }>;
}

/**
 * Video/GRWM Section for Visual Styling Demonstrations
 * Shows fashion videos from Pexels related to the trend
 */
const VideoStylingSection: React.FC<VideoStylingProps> = ({ topic, videos = [] }) => {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    // Format duration from seconds to MM:SS
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-light text-white">Get Ready With Me</h3>
                <span className="ml-auto text-xs text-stone-500 bg-stone-800/50 px-3 py-1 rounded-full">
                    {videos.length} videos
                </span>
            </div>

            <div className="grid gap-4">
                {videos.slice(0, 3).map((video) => (
                    <div
                        key={video.id}
                        className="relative group rounded-2xl overflow-hidden bg-stone-900/50 border border-stone-700/30 hover:border-amber-500/30 transition-all cursor-pointer"
                        onClick={() => setActiveVideo(activeVideo === video.videoUrl ? null : video.videoUrl)}
                    >
                        {activeVideo === video.videoUrl ? (
                            // Video Player
                            <div className="aspect-video">
                                <video
                                    src={video.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-cover"
                                    onEnded={() => setActiveVideo(null)}
                                />
                            </div>
                        ) : (
                            // Video Thumbnail
                            <>
                                <div className="aspect-video relative">
                                    <img
                                        src={video.thumbnail}
                                        alt={`${topic} styling video`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center">
                                            <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-white" />
                                        <span className="text-xs text-white font-medium">
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="p-4">
                                    <p className="text-sm text-stone-300 font-light">
                                        Styling inspiration for {topic}
                                    </p>
                                    <p className="text-xs text-stone-500 mt-1">
                                        By {video.creator}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Hint */}
            <p className="text-xs text-stone-500 italic text-center mt-4">
                Click any video to watch styling demonstrations
            </p>
        </div>
    );
};

export default VideoStylingSection;

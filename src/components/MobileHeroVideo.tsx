import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import reel from '../assets/reel.mp4';

export const MobileHeroVideo: React.FC = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    const handlePlayClick = () => {
        setIsFullscreen(true);
    };

    const handleClose = () => {
        setIsFullscreen(false);
    };

    return (
        <>
            {/* Static Hero Video (Mobile Only) */}
            <div className="relative w-full h-full">
                <div className="relative w-full h-full overflow-hidden group cursor-pointer" onClick={handlePlayClick}>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={reel}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay - Portaled to body to escape stacking contexts */}
            {createPortal(
                <AnimatePresence>
                    {isFullscreen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center lg:p-4"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white/20 transition-all z-[10000]"
                            >
                                <X size={24} />
                            </button>

                            {/* Video Container */}
                            <div className="relative w-full max-w-5xl aspect-video bg-black lg:rounded-lg overflow-hidden shadow-2xl lg:border border-white/10">
                                <video
                                    ref={fullscreenVideoRef}
                                    className="w-full h-full object-contain"
                                    src={reel}
                                    autoPlay
                                    controls
                                    playsInline
                                    controlsList="nodownload"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, animate } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import reel from '../assets/reel.mp4';

interface InteractiveHeroVideoV2Props {
    targetRef: React.RefObject<HTMLDivElement | null>;
    setIsLocked: (locked: boolean) => void;
}

export const InteractiveHeroVideoV2: React.FC<InteractiveHeroVideoV2Props> = ({ targetRef, setIsLocked }) => {
    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });

    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [isMuted, setIsMuted] = useState(true);
    const [isActive, setIsActive] = useState(false); // User has clicked to "activate" the video
    const [isHovered, setIsHovered] = useState(false);
    const [isLockedInternal, setIsLockedInternal] = useState(false); // Internal tracking of lock state
    const [currentProgress, setCurrentProgress] = useState(0); // Track current scroll progress

    // Video State
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Constants
    const startingHeight = 280;
    const startingWidth = startingHeight * (16 / 9); // ~498px

    // Update target rect on resize and mount
    useEffect(() => {
        const updateRect = () => {
            if (targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                setTargetRect({
                    ...rect.toJSON(),
                    top: rect.top + scrollTop,
                    left: rect.left,
                });
            }
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, { once: true });

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [targetRef]);

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const halfWidth = startingWidth / 2;
            const clampedX = Math.max(halfWidth, Math.min(window.innerWidth - halfWidth, e.clientX));
            mouseX.set(clampedX);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, startingWidth]);



    // Animation Logic
    const startScroll = 0;
    let endScroll = 800; // Default fallback
    if (targetRect && windowSize.height > 0) {
        // Calculate scroll position where video center aligns with viewport center
        endScroll = targetRect.top + (targetRect.height / 2) - (windowSize.height / 2);
    }

    const progress = useTransform(scrollY, [startScroll, endScroll], [0, 1]);
    const smoothProgress = useSpring(progress, { stiffness: 200, damping: 30, mass: 0.5 });

    // Lock state and progress tracking
    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            const locked = v >= 0.99;
            setIsLocked(locked);
            setIsLockedInternal(locked);
            setCurrentProgress(v); // Track current progress
        });
        return () => unsubscribe();
    }, [smoothProgress, setIsLocked]);

    // Interpolations
    const width = useTransform(smoothProgress, [0, 1], [startingWidth, targetRect?.width || windowSize.width]);
    const borderRadius = useTransform(smoothProgress, [0, 1], [12, 32]);

    // X Position
    const targetCenterX = targetRect ? targetRect.left + targetRect.width / 2 : windowSize.width / 2;
    const x = useTransform([smoothProgress, smoothMouseX, width], ([p, m, w]) => {
        const currentWidth = w as number;
        const pVal = p as number;
        const mVal = m as number;
        const startX = mVal;
        const endX = targetCenterX;
        const currentX = startX * (1 - pVal) + endX * pVal;
        return currentX - (currentWidth / 2);
    });

    // Y Position
    const realY = useTransform([smoothProgress, scrollY], ([p, s]) => {
        if (!targetRect) return 160;
        const pVal = p as number;
        const sVal = s as number;
        const targetSlotY = targetRect.top - sVal;
        const startY = 160;
        return startY * (1 - pVal) + targetSlotY * pVal;
    });

    // Height
    const targetHeight = targetRect ? targetRect.width * (9 / 16) : windowSize.width * (9 / 16);
    const height = useTransform(smoothProgress, [0, 1], [startingHeight, targetHeight]);

    const handleVideoClick = (e: React.MouseEvent) => {
        // Prevent click propagation if clicking on controls
        if ((e.target as HTMLElement).closest('.custom-controls')) return;

        // If controls are active (video is in final position), just toggle play/pause
        if (currentProgress > 0.5 && isActive) {
            togglePlay();
            return;
        }

        // If not locked (regardless of isActive), scroll to lock position
        if (!isLockedInternal) {
            const wasActive = isActive; // Remember if already active

            // Activate and scroll to lock position
            setIsActive(true);
            setIsMuted(false);

            // Custom smooth scroll with better easing
            const startScrollPos = window.scrollY;
            const scrollDistance = endScroll - startScrollPos;

            // Use Framer Motion's animate for smooth, controlled scrolling
            animate(0, scrollDistance, {
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
                onUpdate: (latest) => {
                    window.scrollTo(0, startScrollPos + latest);
                }
            });

            if (videoRef.current) {
                // Only restart if this is the first click (wasn't active before)
                if (!wasActive) {
                    videoRef.current.currentTime = 0;
                }
                videoRef.current.muted = false;
                videoRef.current.play();
            }
        } else {
            // If locked, check if first activation or just play/pause toggle
            if (!isActive) {
                // First click while locked: activate, unmute, restart
                setIsActive(true);
                setIsMuted(false);

                if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.muted = false;
                    videoRef.current.play();
                }
            } else {
                // Already active: just toggle play/pause
                togglePlay();
            }
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }

        // Scroll to next section
        const logoWall = document.getElementById('logo-wall');
        if (logoWall) {
            logoWall.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback if ID not found
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (videoRef.current) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const newTime = percentage * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
        }
    };

    // Controls Visibility Logic
    const [controlsVisible, setControlsVisible] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handlePlayerMouseMove = () => {
        if (!isActive) return;

        setControlsVisible(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 2500);
    };

    // Clean up timeout
    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    if (!targetRect) return null;

    return (
        <motion.div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                x,
                y: realY,
                width,
                height,
                zIndex: 40,
                borderRadius,
            }}
            className="overflow-hidden shadow-2xl border border-white/10 bg-black cursor-pointer group"
            onClick={handleVideoClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handlePlayerMouseMove}
            onMouseLeave={() => {
                setIsHovered(false);
                setControlsVisible(false);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            }}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={reel}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Custom Controls Overlay */}
            <AnimatePresence>
                {currentProgress > 0.5 && isActive && (
                    <motion.div
                        className={`absolute inset-0 flex flex-col justify-between p-6 custom-controls transition-opacity duration-300 pointer-events-none ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Top Right: Close Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full bg-white hover:bg-gray-100 text-black transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-lg ring-1 ring-black/5 cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Bottom Controls */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                {/* Play/Pause */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className="p-2 rounded-full bg-white hover:bg-gray-100 text-black transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-lg ring-1 ring-black/5 cursor-pointer"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </button>

                                {/* Timeline */}
                                <div
                                    className="flex-1 h-3 bg-white rounded-full cursor-pointer relative overflow-hidden group/timeline pointer-events-auto shadow-lg ring-1 ring-black/10"
                                    onClick={handleSeek}
                                >
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#FDB447] rounded-full transition-all duration-100"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-full w-full opacity-0 group-hover/timeline:opacity-100 transition-opacity bg-black/5"
                                    />
                                </div>

                                {/* Mute/Unmute */}
                                <button
                                    onClick={toggleMute}
                                    className="p-2 rounded-full bg-white hover:bg-gray-100 text-black transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-lg ring-1 ring-black/5 cursor-pointer"
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 rounded-full bg-white hover:bg-gray-100 text-black transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-lg ring-1 ring-black/5 cursor-pointer"
                                >
                                    <Maximize size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Play Button - Show on hover before activation */}
            <AnimatePresence>
                {!isActive && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-black/80 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-3 border-2 border-white shadow-2xl">
                            <Play className="w-8 h-8 text-white fill-current" />
                            <span className="text-white font-semibold text-xl">Play</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

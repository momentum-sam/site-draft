import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface InteractiveHeroVideoProps {
    targetRef: React.RefObject<HTMLDivElement | null>;
    setIsLocked: (locked: boolean) => void;
}

export const InteractiveHeroVideo: React.FC<InteractiveHeroVideoProps> = ({ targetRef, setIsLocked }) => {
    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });

    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    // Calculate endScroll such that the video locks when the target is centered in the viewport
    // TargetScreenY = targetRect.top - scrollY
    // CenterY = windowHeight / 2
    // TargetCenterY = TargetScreenY + targetHeight / 2
    // We want TargetCenterY = CenterY
    // (targetRect.top - EndScroll) + targetHeight / 2 = windowHeight / 2
    // EndScroll = targetRect.top + targetHeight / 2 - windowHeight / 2

    let endScroll = 800; // Default fallback
    if (targetRect && windowSize.height > 0) {
        // Finish animation slightly earlier (subtract 200px) so it's locked before scrolling past
        endScroll = (targetRect.top + (targetRect.height / 2) - (windowSize.height / 2)) - 200;
    }

    const progress = useTransform(scrollY, [startScroll, endScroll], [0, 1]);
    const smoothProgress = useSpring(progress, { stiffness: 200, damping: 30, mass: 0.5 });

    // Lock state (for other components if needed, though we handle the video here)
    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            setIsLocked(v >= 0.99);
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
        const startY = 160; // 80px header + 80px gap

        // Interpolate between start position (160px) and the moving target slot
        // When p=0, we are at startY
        // When p=1, we are at targetSlotY (which moves as we scroll)
        return startY * (1 - pVal) + targetSlotY * pVal;
    });

    // Height and Overlay Opacity
    const targetHeight = targetRect ? targetRect.width * (9 / 16) : windowSize.width * (9 / 16);
    const height = useTransform(smoothProgress, [0, 1], [startingHeight, targetHeight]);
    const overlayOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

    if (!targetRect) return null;

    return (
        <motion.div
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
            className="overflow-hidden shadow-2xl border border-white/10 bg-black cursor-pointer"
            onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                }
            }}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="./assets/reel.mp4"
                autoPlay
                muted={isMuted}
                loop
                playsInline
            />

            <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-sm"
            >
                Showreel Preview
            </motion.div>

            {/* Sound Toggle Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full backdrop-blur-sm"
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                )}
            </motion.div>
        </motion.div>
    );
};

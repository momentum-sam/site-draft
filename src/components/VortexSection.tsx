import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { FunnelScene } from './FunnelScene';

export const VortexSection: React.FC = () => {
    const vortexContainerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: vortexContainerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // --- ANIMATION TIMELINES ---

    // SCROLL HEIGHT: Increased to 500vh for slower pacing.

    // Phase 1: Clarity (The Wide Funnel)
    // Enters SMOOTHER: 0.0 to 0.15 fade in (was 0.02).
    // Adds Y Movement: Floats up gently (20px -> 0px).
    const p1Opacity = useTransform(smoothProgress, [0.0, 0.15, 0.35, 0.40], [0, 1, 1, 0]);
    const p1Scale = useTransform(smoothProgress, [0.0, 0.15], [0.95, 1]); // More subtle scale
    const p1Y = useTransform(smoothProgress, [0.0, 0.15, 0.35, 0.40], [20, 0, 0, -50]);
    const p1PointerEvents = useTransform(smoothProgress, (v) => v >= 0 && v < 0.40 ? 'auto' : 'none');

    // Phase 2: Definition (The Middle/Processing)
    // Starts appearing at 0.45 as camera begins to dive.
    const p2Opacity = useTransform(smoothProgress, [0.45, 0.50, 0.70, 0.75], [0, 1, 1, 0]);
    const p2Y = useTransform(smoothProgress, [0.45, 0.50, 0.70, 0.75], [50, 0, 0, -50]);
    const p2PointerEvents = useTransform(smoothProgress, (v) => v > 0.45 && v < 0.75 ? 'auto' : 'none');

    // Phase 3: Expansion (The Output)
    // Appears at 0.80 as funnel widens at bottom.
    const p3Opacity = useTransform(smoothProgress, [0.80, 0.85], [0, 1]);
    const p3Y = useTransform(smoothProgress, [0.80, 0.85], [50, 0]);
    const p3PointerEvents = useTransform(smoothProgress, (v) => v > 0.80 ? 'auto' : 'none');

    return (
        <div ref={vortexContainerRef} className="relative h-[500vh] z-10 -mb-40" style={{ backgroundColor: 'var(--bg-dark)' }} data-theme="dark">

            {/* Sticky Viewport Wrapper */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

                {/* Gradient Mask */}
                <div className="absolute top-0 left-0 w-full h-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--bg-dark), transparent)' }} />

                {/* 3D Scene Background */}
                <div className="absolute inset-0 z-0">
                    <FunnelScene scrollProgress={smoothProgress} />
                </div>

                {/* Scroll Progress */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 mix-blend-difference hidden md:flex pointer-events-none">
                    <div className="w-[1px] h-32 bg-white/20 relative rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-white"
                            style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
                        />
                    </div>
                </div>

                {/* CONTENT LAYER */}
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">

                    {/* PHASE 1: CLARITY */}
                    <motion.div
                        className="absolute max-w-4xl mx-auto text-center px-6"
                        style={{ opacity: p1Opacity, scale: p1Scale, y: p1Y, pointerEvents: p1PointerEvents as any }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-['Open_Sauce_Sans'] mb-6 leading-[1.1]">
                            Infinite possibilities create a lack of clarity
                        </h2>
                    </motion.div>

                    {/* PHASE 2: DEFINITION */}
                    <motion.div
                        className="absolute max-w-4xl mx-auto text-center px-6"
                        style={{ opacity: p2Opacity, y: p2Y, pointerEvents: p2PointerEvents as any }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-['Open_Sauce_Sans'] mb-6 leading-[1.1]">
                            We define what's<br />worth building and why
                        </h2>
                    </motion.div>

                    {/* PHASE 3: EXPANSION */}
                    <motion.div
                        className="absolute max-w-4xl mx-auto text-center px-6"
                        style={{ opacity: p3Opacity, y: p3Y, pointerEvents: p3PointerEvents as any }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
                            So you can turn direction into momentum
                        </h2>
                        <div className="pointer-events-auto">
                            <button
                                onClick={() => {
                                    const contactForm = document.getElementById('contact-form');
                                    contactForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold hover:bg-[#FDB447] hover:text-black transition-all duration-300 cursor-pointer"
                            >
                                <span>Let's define what's next together</span>
                                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    <ArrowRight size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                                </div>
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

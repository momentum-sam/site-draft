import React, { forwardRef } from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
    isLocked?: boolean;
}

export const VideoSection = forwardRef<HTMLDivElement, VideoSectionProps>(({ isLocked = false }, ref) => {
    return (
        <section className="px-4 md:px-12 py-24">
            <div
                ref={ref}
                className={`w-full aspect-video bg-zinc-900 rounded-[32px] relative overflow-hidden border border-white/10 group cursor-pointer`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Play className="fill-white text-white translate-x-1" size={32} />
                    </div>
                </div>
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                    <p className="text-sm uppercase tracking-wider text-white/70">Showreel 2025</p>
                </div>
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                    <p className="text-sm uppercase tracking-wider text-white/70">Showreel 2025</p>
                </div>
            </div>
        </section>
    );
});

VideoSection.displayName = 'VideoSection';

import React, { forwardRef } from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
    isLocked?: boolean;
}

export const VideoSection = forwardRef<HTMLDivElement, VideoSectionProps>(({ isLocked = false }, ref) => {
    return (
        <section className="px-5 md:px-10 lg:px-16 py-24">
            <div
                ref={ref}
                className={`w-full aspect-video rounded-[32px] relative overflow-hidden border border-white/10 group cursor-pointer`}
            >
            </div>
        </section>
    );
});

VideoSection.displayName = 'VideoSection';

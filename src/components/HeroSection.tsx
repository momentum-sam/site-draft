import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
    videoRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ videoRef }) => {
    const handleScrollToVideo = () => {
        if (videoRef?.current) {
            const rect = videoRef.current.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop + (rect.height / 2) - (window.innerHeight / 2);

            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="h-screen flex flex-col justify-between px-5 pb-12 pt-32 md:px-10 lg:px-16 md:pb-16 relative">
            <div className="flex-1"></div>
            <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-12">
                <div className="max-w-5xl">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.95]">
                        We design what moves business forward
                    </h1>
                </div>
                <div
                    className="flex flex-col items-center gap-4 animate-bounce-slow cursor-pointer group"
                    onClick={handleScrollToVideo}
                >
                    <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent -translate-y-full animate-glimmer"></div>
                    </div>
                    <div className="flex flex-col items-center gap-2 transition-colors duration-300">
                        <span className="text-xs uppercase tracking-widest text-gray-400 writing-vertical-rl group-hover:text-[#FDB447] transition-colors duration-300">Find your momentum</span>
                        <ArrowDown className="text-white group-hover:text-[#FDB447] group-hover:translate-y-1 transition-all duration-300" size={20} />
                    </div>
                </div>
            </div>
        </section>
    );
};

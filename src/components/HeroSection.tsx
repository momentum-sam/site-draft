import React from 'react';
import { ArrowDown } from 'lucide-react';
import { MobileHeroVideo } from './MobileHeroVideo';

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
        <section className="h-[100dvh] flex flex-col justify-between px-5 pb-6 pt-0 md:pt-32 md:px-10 lg:px-12 md:pb-12 relative">
            <div className="md:hidden flex-1 min-h-0 flex flex-col justify-center pt-20 -mx-5">
                <MobileHeroVideo />
            </div>
            <div className="hidden md:block flex-1"></div>
            <div className="flex flex-col items-start gap-8">
                <div className="max-w-[1400px]">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-light tracking-tighter break-words">
                        We design what moves business <span className="text-gradient-forward">forward</span>
                    </h1>
                </div>
                <div
                    className="w-full md:w-auto flex flex-row items-center justify-between md:justify-start gap-2 animate-bounce-slow cursor-pointer group md:self-end"
                    onClick={handleScrollToVideo}
                >
                    <span className="text-xs uppercase tracking-widest text-gray-400 group-hover:text-[#FDB447] transition-colors duration-300">Find your momentum</span>
                    <ArrowDown className="text-white group-hover:text-[#FDB447] group-hover:translate-y-1 transition-all duration-300" size={20} />
                </div>
            </div>
        </section>
    );
};

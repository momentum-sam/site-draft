import React from 'react';
import { ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
    return (
        <section className="h-screen flex flex-col justify-between px-6 pb-12 pt-32 md:px-12 md:pb-16 relative">
            <div className="flex-1"></div>
            <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-12">
                <div className="max-w-4xl">
                    <div className="mb-6 inline-block px-3 py-1 border border-white/20 rounded-full text-sm text-gray-400 uppercase tracking-wider">
                        Globally rated #1 on Clutch - 2017-2024
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
                        We design what moves business forward
                    </h1>
                </div>
                <div className="flex flex-col items-center gap-4 animate-bounce-slow">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50"></div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-gray-400 writing-vertical-rl">Find your momentum</span>
                        <ArrowDown className="text-white" size={20} />
                    </div>
                </div>
            </div>
        </section>
    );
};

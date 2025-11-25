import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_GROUPS = [
    ['NVIDIA', 'AMD', 'Intel'],
    ['Spotify', 'Apple Music', 'SoundCloud'],
    ['Linear', 'Jira', 'Asana'],
    ['Vercel', 'Netlify', 'Heroku'],
    ['Stripe', 'PayPal', 'Square'],
    ['Nike', 'Adidas', 'Puma'],
    ['Polestar', 'Tesla', 'Rivian'],
    ['Ramp', 'Brex', 'Mercury']
];

interface LogoSlotProps {
    logos: string[];
    index: number;
}

const LogoSlot: React.FC<LogoSlotProps> = ({ logos, index }) => {
    const currentLogo = logos[index % logos.length];

    return (
        <div className="h-32 rounded-xl relative overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors duration-300">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentLogo}
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300">
                        {currentLogo}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export const LogoWallSection: React.FC = () => {
    const [timeIndex, setTimeIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeIndex((prev) => prev + 1);
        }, 3000); // All change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="px-6 md:px-12">
            <div className="flex flex-col items-center mb-12">
                <h3 className="text-2xl md:text-3xl text-center max-w-2xl leading-tight text-white">
                    Trusted to solve the toughest challenges
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-transparent">
                {LOGO_GROUPS.map((group, i) => (
                    <LogoSlot key={i} logos={group} index={timeIndex} />
                ))}
            </div>
        </section>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { SectionLink } from './SectionLink';

export const LocationsSection: React.FC = () => {
    return (
        <section className="relative z-20 bg-white text-black px-5 md:px-10 lg:px-12 py-24 md:py-32 rounded-b-[32px]" data-theme="light">
            <div className="max-w-[1640px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left - Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="col-span-12 lg:col-span-6"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
                            From San Francisco<br />to Belgrade
                        </h2>
                    </motion.div>

                    {/* Right - Description and Link (Last 4 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="col-span-12 lg:col-start-9 lg:col-span-4 flex flex-col justify-between"
                    >
                        <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-8">
                            We're strategists who design and designers who think strategically. Above all, we're people who genuinely care about solving your toughest challenges.
                        </p>

                        <div>
                            <SectionLink href="#" theme="light">
                                About HTEC Momentum
                            </SectionLink>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

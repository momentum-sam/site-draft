import React from 'react';
import { motion } from 'framer-motion';
import { SectionLink } from './SectionLink';

interface Capability {
    id: string;
    title: string;
    category: string;
}

const capabilities: Capability[] = [
    { id: '01', title: 'Define market vision', category: '/ Product' },
    { id: '02', title: 'Create what people love', category: '/ Design' },
    { id: '03', title: 'Build for scale', category: '/ Tech Strategy' },
    { id: '04', title: 'Turn data into insight', category: '/ Data & AI' },
    { id: '05', title: 'Launch with confidence', category: '/ Delivery' },
];

export const CapabilitiesSection: React.FC = () => {
    return (
        <section className="relative z-20 bg-white text-black px-8 md:px-16 py-16 md:py-24" data-theme="light">
            <div className="max-w-[1640px] mx-auto grid grid-cols-12 gap-x-8">
                {/* Top Section - Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="col-span-12 lg:col-span-9 mb-12"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
                        Success takes more than just great capabilities. It requires them to work together seamlessly.
                    </h2>
                </motion.div>

                {/* Description and Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-12 lg:col-start-6 lg:col-span-5 mb-24"
                >
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        This is how we combine insight, design, and technology to help you build what matters most.
                    </p>
                    <SectionLink href="#" theme="light">
                        Learn more about what we do
                    </SectionLink>
                </motion.div>

                {/* Capabilities List */}
                <div className="col-span-12 lg:col-start-3 lg:col-span-10 space-y-0">
                    {capabilities.map((capability, index) => (
                        <motion.div
                            key={capability.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group border-t border-gray-200 last:border-b hover:bg-gray-50/50 transition-colors duration-300"
                        >
                            <div className="py-8 md:py-10 flex items-center justify-between gap-8">
                                {/* Left - Number and Title */}
                                <div className="flex items-center gap-6 md:gap-8 flex-1">
                                    {/* Number with Circle Background on Hover */}
                                    <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[#FDB447] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" style={{ transformOrigin: 'center' }} />
                                        <span className="relative z-10 text-sm md:text-base italic text-gray-500 group-hover:text-black transition-colors duration-300">
                                            {capability.id}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight -ml-4 relative z-10">
                                        {capability.title}
                                    </h3>
                                </div>

                                {/* Right - Category */}
                                <div className="text-sm md:text-base italic text-gray-500 flex-shrink-0">
                                    {capability.category}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionLink } from './SectionLink';
import thumbnail from '../assets/img/thumbnail.png';
import thumbnail1 from '../assets/img/thumbnail-1.png';
import thumbnail2 from '../assets/img/thumbnail-2.png';

interface CaseStudy {
    title: string;
    tags: string;
    category: string;
    description: string;
    image: string;
    metrics: {
        label: string;
        value: string;
    }[];
}

const caseStudies: CaseStudy[] = [
    {
        title: 'Breaking down the crypto barrier for all',
        tags: 'Strategy, Design, Research',
        category: 'Product Design',
        description: 'Make investing more accessible, educating and helping Bitstamp expand its reach.',
        image: thumbnail,
        metrics: [
            { label: 'User Engagement', value: '+240%' },
            { label: 'Time Saved', value: '15hrs/week' },
        ],
    },
    {
        title: 'Empowering athletic performance',
        tags: 'Strategy, Design, Research',
        category: 'Interface Design',
        description: 'Helping every athlete train smarter, recover faster, and stay motivated with personalized experiences that elevate performance.',
        image: thumbnail1,
        metrics: [
            { label: 'Task Completion', value: '+95%' },
            { label: 'Error Reduction', value: '-78%' },
        ],
    },
    {
        title: 'Connecting the global health community',
        tags: 'Strategy, Design, Research',
        category: 'UX Strategy',
        description: 'A digital collaboration hub that empowers healthcare professionals worldwide to share, learn, and act together in real time.',
        image: thumbnail2,
        metrics: [
            { label: 'Conversion Rate', value: '+180%' },
            { label: 'Cart Abandonment', value: '-65%' },
        ],
    },

];

export const OurWorkSection: React.FC = () => {
    return (
        <section className="relative z-20 bg-white rounded-t-[32px] px-5 md:px-10 lg:px-12 py-16 md:py-24" data-theme="light">
            <div className="max-w-[1640px] mx-auto">
                {/* Section Header */}
                <div className="grid grid-cols-12 gap-x-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="col-span-12 lg:col-span-8"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-black">
                            Experiences reimagined for businesses like yours
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="col-span-12 lg:col-span-4 flex items-end justify-start lg:justify-end mt-8 lg:mt-0"
                    >
                        <SectionLink href="#" theme="light">
                            View our work
                        </SectionLink>
                    </motion.div>
                </div>

                {/* Case Studies Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {caseStudies.map((study, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] bg-gray-100">
                                <img
                                    src={study.image}
                                    alt={study.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Arrow Icon */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                                    <ArrowUpRight size={20} className="text-black" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-3 uppercase">
                                        {study.tags}
                                    </p>
                                    <h3 className="text-2xl font-bold text-black mb-2 transition-colors duration-300">
                                        {study.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {study.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

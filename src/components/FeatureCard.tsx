import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GeometricGlyphScene } from './three/GeometricGlyphScene';

export const FeatureCard: React.FC = () => {
  return (
    <section className="relative z-20 py-32 px-6 md:px-12 flex justify-center items-center overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)' }}>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-[#FECD84] rounded-[40px] overflow-hidden group h-[400px]"
      >
        <div className="absolute inset-0 flex">
          {/* Left Column - SVG Pattern / 3D Scene */}
          <div className="w-1/2 relative h-full overflow-hidden">
            <GeometricGlyphScene />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FECD84] pointer-events-none" />
          </div>

          {/* Right Column - Content */}
          <div className="w-1/2 relative z-10 flex flex-col justify-center p-12 md:p-16 pl-0">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tighter text-black font-['Open_Sauce_Sans'] mb-6 leading-[1.1]">
              Design Thinking meet<br />Cognitive Design
            </h2>

            <p className="text-lg text-black/80 leading-relaxed font-light mb-12 max-w-md">
              Our framework to design AI systems that amplify human decision-making.
            </p>

            <a href="#" className="group/link inline-flex items-center gap-2 text-black font-medium hover:opacity-70 transition-opacity absolute bottom-12 right-16">
              <span>Read our whitepaper</span>
              <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

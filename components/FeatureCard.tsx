import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeatureCard: React.FC = () => {
  return (
    <section className="relative z-20 py-32 px-6 md:px-12 flex justify-center items-center overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)' }}>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FDB447]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 overflow-hidden group"
      >
        {/* Card Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[#FDB447]/30 bg-[#FDB447]/10">
              <Sparkles size={14} className="text-[#FDB447]" />
              <span className="text-xs font-medium tracking-widest text-[#FDB447] uppercase">Next Gen Intelligence</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-['Open_Sauce_Sans'] mb-6 leading-[1.1]">
              The UX of AI
            </h2>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
              Design thinking meets Cognitive Design. We create systems that amplify human decision-making, not just automate it.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <button className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-[#FDB447] hover:text-white transition-all duration-300">
              <span>See our AI-First approach</span>
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-[#FDB447]/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
};

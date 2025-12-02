import React from 'react';


const CognitiveDesignCard: React.FC = () => {
    return (
        <div className="relative w-full h-[600px] rounded-[32px] overflow-hidden group bg-[#050505] border border-white/5">
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
                <div>
                    {/* Optional: Icon or small header could go here */}
                </div>

                <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
                        Cognitive
                        <br />
                        <span className="font-serif italic text-white/90">Design</span>
                    </h2>
                    <p className="text-white/60 max-w-md text-lg font-light leading-relaxed">
                        Designing interfaces that align with human thought processes.
                    </p>
                </div>
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    );
};

export default CognitiveDesignCard;

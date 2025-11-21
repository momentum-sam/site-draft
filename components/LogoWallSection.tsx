import React from 'react';

export const LogoWallSection: React.FC = () => {
    return (
        <section className="px-6 md:px-12">
            <div className="flex flex-col items-center mb-16">
                <h3 className="text-2xl md:text-3xl text-center max-w-2xl leading-tight">
                    Trusted to solve the toughest challenges
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
                {['NVIDIA', 'Spotify', 'Linear', 'Vercel', 'Stripe', 'Nike', 'Polestar', 'Ramp'].map((logo, i) => (
                    <div key={i} className="bg-[#050505] h-32 flex items-center justify-center group">
                        <span className="text-xl text-gray-500 group-hover:text-white transition-colors duration-300">
                            {logo}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

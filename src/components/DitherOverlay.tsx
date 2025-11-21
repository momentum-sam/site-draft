import React from 'react';

export const DitherOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-25 mix-blend-screen">
      {/* SVG Noise Filter for Grain/Dither feel */}
      <svg className="absolute h-full w-full opacity-50">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))]" 
           style={{ backgroundSize: "100% 4px, 3px 100%" }} />
    </div>
  );
};
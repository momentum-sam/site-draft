import React from 'react';
import { DitherOverlay } from './components/DitherOverlay';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VideoSection } from './components/VideoSection';
import { InteractiveHeroVideoV2 } from './components/InteractiveHeroVideoV2';
import { LogoWallSection } from './components/LogoWallSection';
import { VortexSection } from './components/VortexSection';
import { FooterSection } from './components/FooterSection';
import { FeatureCard } from './components/FeatureCard';
import { OurWorkSection } from './components/OurWorkSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { InsightsSection } from './components/InsightsSection';
import { LocationsSection } from './components/LocationsSection';

const App: React.FC = () => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = React.useState(false);

  return (
    <main className="relative text-white font-sans selection:bg-[#FDB447] selection:text-white" style={{ backgroundColor: 'var(--bg-dark)' }}>

      {/* Global Overlay Effects */}
      <DitherOverlay />

      <InteractiveHeroVideoV2 targetRef={videoRef} setIsLocked={setIsLocked} />

      <Header />

      {/* PRE-VORTEX CONTENT */}
      <div className="relative z-20 -mb-40" style={{ backgroundColor: 'var(--bg-dark)' }} data-theme="dark">
        <HeroSection videoRef={videoRef} />
        <VideoSection ref={videoRef} isLocked={isLocked} />
        <LogoWallSection />
      </div>

      <VortexSection />

      <OurWorkSection />

      <CapabilitiesSection />

      <LocationsSection />

      <InsightsSection />

      <FooterSection />

    </main>
  );
};

export default App;
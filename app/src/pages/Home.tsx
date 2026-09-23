import HeroSection from '@/sections/home/HeroSection';
import BasicsSection from '@/sections/home/BasicsSection';
import MiniMapSection from '@/sections/home/MiniMapSection';
import AnalogiesSection from '@/sections/home/AnalogiesSection';
import FactsStrip from '@/sections/home/FactsStrip';
import FinalCTA from '@/sections/home/FinalCTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BasicsSection />
      <MiniMapSection />
      <AnalogiesSection />
      <FactsStrip />
      <FinalCTA />
    </>
  );
}

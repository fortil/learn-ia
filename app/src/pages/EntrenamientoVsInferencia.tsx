import HeroSection from '@/sections/entrenamiento/HeroSection';
import ToggleSection from '@/sections/entrenamiento/ToggleSection';
import GoldenRule from '@/sections/entrenamiento/GoldenRule';
import Timeline from '@/sections/entrenamiento/Timeline';
import ClassifierGame from '@/sections/entrenamiento/ClassifierGame';
import Bridge from '@/sections/entrenamiento/Bridge';

export default function EntrenamientoVsInferencia() {
  return (
    <>
      <HeroSection />
      <ToggleSection />
      <GoldenRule />
      <Timeline />
      <ClassifierGame />
      <Bridge />
    </>
  );
}

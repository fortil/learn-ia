import { useCallback, useState } from 'react';
import MitosHero from '@/sections/mitos/MitosHero';
import ScoreBar from '@/sections/mitos/ScoreBar';
import MythWall from '@/sections/mitos/MythWall';
import GoldenIdea from '@/sections/mitos/GoldenIdea';
import MitosCTA from '@/sections/mitos/MitosCTA';

/**
 * Página "Mitos y Verdades" (/mitos): juego de "¿Mito o Verdad?" con 6
 * tarjetas de tres estados (apuesta → wiggle → volteo con sello) y marcador.
 */
export default function Mitos() {
  // mythId -> whether the player's bet was correct
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleResolved = useCallback((mythId: number, correct: boolean) => {
    setResults((prev) =>
      mythId in prev ? prev : { ...prev, [mythId]: correct },
    );
  }, []);

  const revealed = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;

  return (
    <>
      <MitosHero />
      <ScoreBar correct={correct} revealed={revealed} />
      <MythWall onResolved={handleResolved} />
      <GoldenIdea />
      <MitosCTA revealed={revealed} />
    </>
  );
}

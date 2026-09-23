import { useCallback, useState } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import MapaHeader from '@/sections/mapa/MapaHeader';
import MapaRoad from '@/sections/mapa/MapaRoad';
import Passport from '@/sections/mapa/Passport';
import Station1Entrada from '@/sections/mapa/Station1Entrada';
import Station2Tokens from '@/sections/mapa/Station2Tokens';
import Station3Biblioteca from '@/sections/mapa/Station3Biblioteca';
import Station4Prediccion from '@/sections/mapa/Station4Prediccion';
import Station5Respuesta from '@/sections/mapa/Station5Respuesta';
import ResumenViaje from '@/sections/mapa/ResumenViaje';

export default function Mapa() {
  const { t } = useLanguage();
  const [question, setQuestion] = useState(() => t('mapa.header.s1'));
  const [stamps, setStamps] = useState<boolean[]>([false, false, false, false, false]);
  const [answer, setAnswer] = useState<string | null>(null);

  const completeStation = useCallback((index: number) => {
    setStamps((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  return (
    <div className="relative">
      {/* the continuous road, drawn with scroll (fixed, behind content) */}
      <MapaRoad />

      <MapaHeader question={question} onQuestionChange={setQuestion} />

      {/* mobile compact passport bar (sticky under the navbar) */}
      <Passport stamps={stamps} variant="bar" />

      <div className="relative mx-auto max-w-[1440px] xl:grid xl:grid-cols-[1fr_260px] xl:gap-6 xl:px-6">
        <div className="relative z-10">
          <Station1Entrada
            question={question}
            completed={stamps[0]}
            onComplete={() => completeStation(0)}
          />
          <Station2Tokens
            key={question}
            question={question}
            completed={stamps[1]}
            onComplete={() => completeStation(1)}
          />
          <Station3Biblioteca
            question={question}
            completed={stamps[2]}
            onComplete={() => completeStation(2)}
          />
          <Station4Prediccion
            completed={stamps[3]}
            onComplete={() => completeStation(3)}
            onAnswer={setAnswer}
          />
          <Station5Respuesta
            answer={answer}
            completed={stamps[4]}
            onComplete={() => completeStation(4)}
          />
          <ResumenViaje />
        </div>

        {/* desktop passport, sticky in the right column */}
        <div className="relative z-10 hidden py-16 xl:block">
          <Passport stamps={stamps} variant="card" />
        </div>
      </div>
    </div>
  );
}

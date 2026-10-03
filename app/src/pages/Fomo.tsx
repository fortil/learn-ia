import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import BarraHabitos from '@/sections/fomo/BarraHabitos';
import FomoHero from '@/sections/fomo/FomoHero';
import Anecdota from '@/sections/fomo/Anecdota';
import Fabricantes from '@/sections/fomo/Fabricantes';
import TipSection from '@/sections/fomo/TipSection';
import Cierre from '@/sections/fomo/Cierre';
import Profundizar from '@/sections/fomo/Profundizar';
import { TIPS } from '@/sections/fomo/fomoData';
import { useLangFromQuery } from '@/sections/fomo/useLangFromQuery';
import { useLanguage } from '@/i18n/useLanguage';

/**
 * Episodio 032: guía "Cómo combatir el FOMO que te da la IA". Nada se mueve
 * ni se descarga hasta que el lector lo toca; MotionConfig respeta la
 * preferencia de movimiento reducido del sistema.
 */
export default function Fomo() {
  const { t } = useLanguage();
  useLangFromQuery();

  useEffect(() => {
    document.title = t('fomo.meta.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('fomo.meta.description'));
  }, [t]);

  return (
    <MotionConfig reducedMotion="user">
      <FomoHero />
      <BarraHabitos />
      <Anecdota />
      <Fabricantes />
      {TIPS.map((tip, i) => (
        <TipSection key={tip.n} tip={tip} index={i} />
      ))}
      <Cierre />
      <Profundizar />
    </MotionConfig>
  );
}

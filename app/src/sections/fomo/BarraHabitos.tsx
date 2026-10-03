import { useEffect, useState } from 'react';
import ProgressBar from '@/components/doodle/ProgressBar';
import { useLanguage } from '@/i18n/useLanguage';
import { TIPS } from './fomoData';

/**
 * Thin sticky bar under the navbar: "Hábito 2 de 5". Tracks which habit
 * section is on screen. Pattern follows mitos/ScoreBar.
 */
export default function BarraHabitos() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TIPS.forEach((tip, i) => {
      const el = document.getElementById(tip.anchor);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(i + 1);
          });
        },
        { rootMargin: '-40% 0px -50% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="sticky top-[72px] z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 md:px-6">
        <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink">
          {active > 0
            ? `${t('fomo.ui.habito')} ${active} ${t('fomo.ui.de')} ${TIPS.length}`
            : t('fomo.hero.sticker')}
        </span>
        <ProgressBar value={active / TIPS.length} color="coral" className="flex-1" />
      </div>
    </div>
  );
}

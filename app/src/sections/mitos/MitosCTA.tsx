import { memo, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Map } from 'lucide-react';
import DoodleArrow from '@/components/doodle/DoodleArrow';
import { useLanguage } from '@/i18n/useLanguage';
import { TOTAL_MYTHS } from './mythsData';

const TOTAL = TOTAL_MYTHS;

/** Coral CTA with a perpetual heartbeat, isolated + memoized. */
const PulsingCTA = memo(function PulsingCTA() {
  const { t } = useLanguage();
  return (
    <motion.div
      animate={{ scale: [1, 1.045, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Link
        to="/quiz"
        className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-coral px-8 py-4 font-display text-xl font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
      >
        {t('mitos.cta.button')}
        <ArrowRight className="h-5 w-5" strokeWidth={3} />
      </Link>
    </motion.div>
  );
});

/** Count-up that restarts whenever the value changes (and it is in view). */
function CountUp({ value, active }: { value: number; active: boolean }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    if (!active) return;
    const controls = animate(mv, value, { duration: 0.6, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, active, mv]);
  return <motion.span>{rounded}</motion.span>;
}

interface MitosCTAProps {
  revealed: number;
}

/** Closing section: dynamic tally + bridge to the quiz and the map. */
export default function MitosCTA({ revealed }: MitosCTAProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  return (
    <section className="bg-paper-deep py-24 md:py-32">
      <div
        ref={ref}
        className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 text-center md:px-6"
      >
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold leading-tight text-ink">
          {t('mitos.cta.titleBefore')}{' '}
          <span className="text-coral">
            <CountUp value={revealed} active={inView} /> {t('mitos.cta.titleOf')} {TOTAL}
          </span>{' '}
          {t('mitos.cta.titleAfter')}
        </h2>
        <p className="max-w-lg text-lg font-semibold text-ink-soft">
          {revealed < TOTAL ? t('mitos.cta.subtitlePending') : t('mitos.cta.subtitleDone')}
        </p>
        <PulsingCTA />
        <div className="flex flex-col items-center gap-1">
          <DoodleArrow color="coral" bow="up" flip drawOn className="h-10 w-20" />
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ink-soft underline decoration-wavy underline-offset-4 transition-colors hover:text-ink"
          >
            <Map className="h-4 w-4" strokeWidth={2.75} />
            {t('mitos.cta.map')}
          </Link>
        </div>
      </div>
    </section>
  );
}

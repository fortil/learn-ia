import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Stamp, Sparkles } from 'lucide-react';
import ProgressBar from '@/components/doodle/ProgressBar';
import { useLanguage } from '@/i18n/useLanguage';
import { TOTAL_MYTHS } from './mythsData';

const TOTAL = TOTAL_MYTHS;

/** Number that counts up whenever its value changes. */
function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

interface ScoreBarProps {
  correct: number;
  revealed: number;
}

/** Sticky scoreboard: hits counter + sun progress bar + discovered stamps. */
export default function ScoreBar({ correct, revealed }: ScoreBarProps) {
  const { t } = useLanguage();
  return (
    <div className="sticky top-[72px] z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <span className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ink">
          {t('mitos.score.hits')} <CountUp value={correct} />/{TOTAL}
          {/* mini sparkle on each hit */}
          <motion.span
            key={correct}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: correct > 0 ? [0, 1.4, 1] : 0, rotate: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex text-sun"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.75} fill="#FFC53D" />
          </motion.span>
        </span>
        <ProgressBar
          value={correct / TOTAL}
          color="sun"
          className="min-w-[140px] flex-1 sm:max-w-xs"
        />
        <span className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ink-soft">
          <Stamp className="h-4 w-4" strokeWidth={2.75} />
          {t('mitos.score.stamps')} {revealed}/{TOTAL}
        </span>
      </div>
    </div>
  );
}

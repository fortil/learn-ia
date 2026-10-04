import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import FlipCard from '@/components/doodle/FlipCard';
import ProgressBar from '@/components/doodle/ProgressBar';
import { useLanguage } from '@/i18n/useLanguage';
import type { TipInteraction as InteractionKind } from './fomoData';

/**
 * The touch interaction of a habit: 3 flip cards (habit 1), a checklist with
 * progress (habit 2) or a single flip card (habit 3). Everything responds to
 * one tap and works with the keyboard; the page reads complete without
 * touching any of it.
 */
export default function TipInteraction({ kind, n }: { kind: InteractionKind; n: number }) {
  const { t } = useLanguage();
  const ns = `fomo.tips.t${n}`;

  if (kind === 'flip3' || kind === 'flip1') {
    const cards =
      kind === 'flip3'
        ? [1, 2, 3].map((c) => ({
            front: t(`${ns}.c${c}f`),
            back: t(`${ns}.c${c}b`),
            color: CARD_COLORS[(c - 1) % CARD_COLORS.length],
          }))
        : [{ front: t(`${ns}.cardF`), back: t(`${ns}.cardB`), color: 'peach' }];
    return (
      <div className={cn('grid gap-4', kind === 'flip3' && 'sm:grid-cols-3')}>
        {cards.map((c) => (
          <FlipCard
            key={c.front}
            front={<span className="font-display text-lg font-extrabold leading-snug text-ink">{c.front}</span>}
            back={<span className="text-[0.95rem] font-semibold leading-snug text-ink">{c.back}</span>}
            backColor={c.color}
            hint={t('fomo.ui.flipHint')}
          />
        ))}
      </div>
    );
  }

  if (kind === 'checklist') {
    return <Checklist n={n} />;
  }

  return null;
}

const CARD_COLORS = ['peach', 'mint', 'sun'] as const;

/** Habit 2: three one-minute checks, ticked one by one. */
function Checklist({ n }: { n: number }) {
  const { t } = useLanguage();
  const ns = `fomo.tips.t${n}`;
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const items = [1, 2, 3].map((i) => t(`${ns}.i${i}`));
  const done = checked.filter(Boolean).length;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="rounded-blob-3 border-[3px] border-ink bg-white p-5 shadow-doodle-sm">
      <ul className="space-y-3">
        {items.map((label, i) => {
          const on = checked[i];
          return (
            <li key={label}>
              <motion.button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                whileTap={{ scale: 0.98 }}
                animate={on ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-[3px] px-4 py-3 text-left transition-colors',
                  on ? 'border-teal-deep bg-mint/50' : 'border-ink/25 bg-paper hover:border-ink/50',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px]',
                    on ? 'border-teal-deep bg-teal' : 'border-ink/40 bg-white',
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <motion.path
                      d="M4 13 C 8 16, 9 18, 10 19 C 13 13, 17 8, 21 5"
                      stroke="#26233F"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </svg>
                </span>
                <span className="flex-1 text-[1rem] font-semibold leading-snug text-ink">{label}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <ProgressBar value={done / items.length} color="teal" className="mt-4" />
    </div>
  );
}

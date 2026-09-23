import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import MythStamp from '@/components/doodle/MythStamp';
import { useLanguage } from '@/i18n/useLanguage';
import FallingConfetti from './FallingConfetti';
import type { Bet, Myth } from './mythsData';

type Phase = 'question' | 'wiggling' | 'revealed';

const backVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const backItem = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

interface MythCardProps {
  myth: Myth;
  index: number;
  onResolved: (mythId: number, correct: boolean) => void;
}

/**
 * Three-state myth card: question (bet buttons) → wiggle of anticipation →
 * 180° flip revealing the stamped MITO/VERDAD verdict.
 */
export default function MythCard({ myth, index, onResolved }: MythCardProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('question');
  const [bet, setBet] = useState<Bet | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const placeBet = (choice: Bet) => {
    if (phase !== 'question') return;
    setBet(choice);
    setPhase('wiggling');
    timer.current = window.setTimeout(() => {
      setPhase('revealed');
      onResolved(myth.id, choice === myth.answer);
    }, 450);
  };

  const revealed = phase === 'revealed';
  const correct = bet === myth.answer;

  return (
    <div className="relative [perspective:1200px]">
      {/* wiggle wrapper: shakes with anticipation after the bet */}
      <motion.div
        animate={
          phase === 'wiggling'
            ? { rotate: [0, -2, 2, -2, 2, 0] }
            : { rotate: 0 }
        }
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        {/* flipper */}
        <motion.div
          className="relative h-full [transform-style:preserve-3d]"
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* FRONT — the question (in flow, defines card height) */}
          <div
            className={cn(
              'doodle-card relative flex min-h-[340px] flex-col items-center justify-center gap-5 p-6 text-center [backface-visibility:hidden]',
              revealed && 'pointer-events-none',
            )}
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-pink">
              {t('mitos.card.rumor')} #{index + 1}
            </span>
            <p className="font-display text-[1.25rem] font-bold leading-snug text-ink md:text-[1.35rem]">
              “{myth.statement}”
            </p>
            {phase === 'wiggling' ? (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full border-[3px] border-ink bg-sun px-5 py-2 font-mono text-sm font-bold uppercase tracking-[0.1em] text-ink shadow-doodle-sm"
              >
                {t('mitos.card.letsSee')}
              </motion.span>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => placeBet('mito')}
                  whileHover={{ scale: 1.08, rotate: -1 }}
                  whileTap={{ scale: 0.93 }}
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-5 py-2.5 font-display text-base font-extrabold text-white shadow-doodle-sm"
                >
                  <X className="h-4 w-4" strokeWidth={3.5} />
                  {t('mitos.card.betMito')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => placeBet('verdad')}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  whileTap={{ scale: 0.93 }}
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-teal px-5 py-2.5 font-display text-base font-extrabold text-white shadow-doodle-sm"
                >
                  <Check className="h-4 w-4" strokeWidth={3.5} />
                  {t('mitos.card.betVerdad')}
                </motion.button>
              </div>
            )}
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-soft">
              {t('mitos.card.betHint')}
            </span>
          </div>

          {/* BACK — the verdict */}
          <div
            className={cn(
              'absolute inset-0 overflow-y-auto rounded-blob-3 border-[3px] border-ink p-6 text-center shadow-doodle [backface-visibility:hidden] [transform:rotateY(180deg)]',
              myth.answer === 'verdad' ? 'bg-mint' : 'bg-peach',
            )}
            aria-hidden={!revealed}
          >
            <motion.div
              className="flex min-h-full flex-col items-center justify-center gap-4"
              variants={backVariants}
              initial="hidden"
              animate={revealed ? 'show' : 'hidden'}
            >
              {revealed && (
                <MythStamp
                  variant={myth.answer}
                  rotate={-14}
                  delay={0.3}
                  className="bg-paper/70 text-base"
                >
                  {myth.answer === 'mito' ? t('mitos.card.betMito') : t('mitos.card.betVerdad')}
                </MythStamp>
              )}
              <motion.p variants={backItem} className="font-display text-xl font-extrabold text-ink">
                {myth.answer === 'mito' ? t('mitos.card.verdictMito') : t('mitos.card.verdictVerdad')}{' '}
                {myth.note && <span className="text-ink-soft">{myth.note}</span>}
              </motion.p>
              <motion.p variants={backItem} className="text-[0.98rem] font-semibold leading-relaxed text-ink">
                {myth.explanation}
              </motion.p>
              <motion.div
                variants={backItem}
                className="rounded-blob-3 border-[3px] border-ink bg-paper px-4 py-3 shadow-doodle-sm"
              >
                <p className="flex items-start gap-2 text-left text-[0.9rem] font-semibold leading-snug text-ink">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sun" strokeWidth={2.75} fill="#FFC53D" />
                  <span>
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                      {t('mitos.card.why')}{' '}
                    </span>
                    {myth.analogy}
                  </span>
                </p>
              </motion.div>
              <motion.p
                variants={backItem}
                className={cn(
                  'font-mono text-xs font-bold uppercase tracking-[0.1em]',
                  correct ? 'text-teal-deep' : 'text-coral-deep',
                )}
              >
                {correct
                  ? t('mitos.card.betCorrect')
                  : `${t('mitos.card.betWrongBefore')}${bet === 'mito' ? t('mitos.card.betMito') : t('mitos.card.betVerdad')}${t('mitos.card.betWrongAfter')}`}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* mini confetti rain over the card when the bet was right */}
      {revealed && correct && (
        <FallingConfetti count={12} fall={380} className="z-10 rounded-blob-3" />
      )}
    </div>
  );
}

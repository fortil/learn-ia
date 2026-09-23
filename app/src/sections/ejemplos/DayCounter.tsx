import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';

interface Situation {
  label: string;
  value: number;
}

export default function DayCounter() {
  const { t } = useLanguage();

  const SITUATIONS: Situation[] = [
    { label: t('ejemplos.day.s1'), value: 5 },
    { label: t('ejemplos.day.s2'), value: 2 },
    { label: t('ejemplos.day.s3'), value: 3 },
    { label: t('ejemplos.day.s4'), value: 4 },
    { label: t('ejemplos.day.s5'), value: 2 },
    { label: t('ejemplos.day.s6'), value: 3 },
    { label: t('ejemplos.day.s7'), value: 5 },
    { label: t('ejemplos.day.s8'), value: 1 },
  ];

  const messageFor = (total: number): string => {
    if (total < 3) return t('ejemplos.day.msg1');
    if (total <= 8) return t('ejemplos.day.msg2');
    return t('ejemplos.day.msg3');
  };

  const [checked, setChecked] = useState<boolean[]>(() => SITUATIONS.map(() => false));
  const total = SITUATIONS.reduce((sum, s, i) => sum + (checked[i] ? s.value : 0), 0);
  const [displayed, setDisplayed] = useState(0);
  const prevTotal = useRef(0);

  useEffect(() => {
    const controls = animate(prevTotal.current, total, {
      duration: 0.5,
      ease: 'backOut',
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    prevTotal.current = total;
    return () => controls.stop();
  }, [total]);

  const toggle = (i: number) =>
    setChecked((c) => c.map((v, j) => (j === i ? !v : v)));

  return (
    <section className="border-y-[3px] border-ink bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
            {t('ejemplos.day.sticker')}
          </span>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08]">
            {t('ejemplos.day.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg font-semibold text-paper/70">
            {t('ejemplos.day.subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
          {/* checklist */}
          <ul className="space-y-3">
            {SITUATIONS.map((s, i) => {
              const on = checked[i];
              return (
                <motion.li
                  key={s.label}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                >
                  <motion.button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border-[3px] px-4 py-3 text-left transition-colors',
                      on
                        ? 'border-sun bg-sun/15'
                        : 'border-paper/30 bg-transparent hover:border-paper/60',
                    )}
                    whileTap={{ scale: 0.98 }}
                    animate={on ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* hand-drawn checkbox */}
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px]',
                        on ? 'border-sun bg-sun' : 'border-paper/50',
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
                    <span className="flex-1 font-bold text-paper">{s.label}</span>
                    <span className="font-mono text-sm font-bold text-sun">+{s.value}</span>
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>

          {/* counter */}
          <div className="sticky top-24 rounded-blob-2 border-[3px] border-paper bg-paper/5 p-6 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
              {t('ejemplos.day.counterLabel')}
            </p>
            <motion.p
              key={total}
              className="mt-2 font-mono text-7xl font-bold text-paper"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            >
              {displayed}
            </motion.p>
            <div className="mt-4 flex min-h-[52px] items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageFor(total)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-sun px-4 py-2 font-display text-base font-extrabold text-sun"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {total > 8 && <Zap className="h-4 w-4" strokeWidth={2.75} />}
                  {messageFor(total)}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

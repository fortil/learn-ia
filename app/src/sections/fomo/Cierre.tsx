import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import { useLanguage } from '@/i18n/useLanguage';

const BUTTON_CLASSES = [
  'bg-coral text-white',
  'bg-teal text-white',
  'bg-sun text-ink',
  'bg-lilac text-white',
  'bg-pink text-ink',
];

/** Closing: pick one habit, get its weekly task, face the counter-question. */
export default function Cierre() {
  const { t } = useLanguage();
  const [chosen, setChosen] = useState<number | null>(null);

  return (
    <section className="bg-peach/40 px-4 py-16 text-center md:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <motion.h2
          className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight text-ink"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="relative inline-block">
            {t('fomo.cierre.lead')}
            <SquiggleUnderline color="coral" className="absolute -bottom-1 left-0" />
          </span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2.5">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <button
              key={n}
              type="button"
              onClick={() => setChosen(chosen === n ? null : n)}
              aria-pressed={chosen === n}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink px-3.5 py-2 font-mono text-[0.78rem] font-bold uppercase tracking-[0.06em] shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                BUTTON_CLASSES[i],
                chosen === n && 'ring-2 ring-ink ring-offset-2 ring-offset-paper',
              )}
            >
              {t(`fomo.hero.chip${n}`)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {chosen !== null && (
            <motion.p
              key={chosen}
              className="inline-flex items-start gap-2 rounded-blob-3 border-[3px] border-ink bg-white px-5 py-3 text-left text-[1rem] font-semibold leading-snug text-ink shadow-doodle"
              initial={{ y: 12, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                {t('fomo.cierre.resultLabel')}
              </span>
              {t(`fomo.tips.t${chosen}.task`)}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p
          className="max-w-xl text-[1.25rem] font-bold leading-snug text-ink"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('fomo.cierre.contra')}
        </motion.p>
      </div>
    </section>
  );
}

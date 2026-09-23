import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';

/** Row of the 5 map stations; tap/hover a chip to see what it means in this case. */
export default function FiveStops({ stops }: { stops: string[] }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);

  const STOPS = [
    { n: 1, label: t('ejemplos.stops.s1'), color: 'bg-coral text-white' },
    { n: 2, label: t('ejemplos.stops.s2'), color: 'bg-sun text-ink' },
    { n: 3, label: t('ejemplos.stops.s3'), color: 'bg-teal text-white' },
    { n: 4, label: t('ejemplos.stops.s4'), color: 'bg-lilac text-white' },
    { n: 5, label: t('ejemplos.stops.s5'), color: 'bg-pink text-ink' },
  ];

  return (
    <div className="mt-6">
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
        {t('ejemplos.stops.caption')}
      </p>
      <div className="flex flex-wrap gap-2">
        {STOPS.map((s, i) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => setOpen(i)}
            aria-expanded={open === i}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.06em] shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
              s.color,
              open === i && 'ring-2 ring-ink ring-offset-2 ring-offset-paper',
            )}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-ink bg-white text-[0.65rem] text-ink">
              {s.n}
            </span>
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[56px]">
        <AnimatePresence mode="wait">
          {open !== null && (
            <motion.p
              key={open}
              className="inline-block rounded-blob-3 border-[3px] border-ink bg-white px-4 py-2.5 text-[0.95rem] font-semibold leading-snug text-ink shadow-doodle-sm"
              initial={{ y: 10, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <strong className="font-display">{STOPS[open].label}:</strong> {stops[open]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

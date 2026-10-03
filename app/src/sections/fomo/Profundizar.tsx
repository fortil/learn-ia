import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { G2_JOBS_2030, G3_LAYOFFS, SOURCE_LINKS } from './fomoData';

const PANEL_CLASSES = ['bg-white', 'bg-mint/40', 'bg-peach/50', 'bg-sun/20', 'bg-white'];

/**
 * Closed-by-default accordion with the depth material: the fear business,
 * regulatory capture, the historical precedents, the full charts (G2, G3) and
 * the sources. Nothing here is required reading for the main path.
 */
export default function Profundizar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);

  const panels = [0, 1, 2, 3, 4].map((i) => ({
    i,
    title: t(`fomo.profundizar.p${i + 1}Title`),
  }));

  return (
    <section id="profundizar" className="bg-paper px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          className="flex items-center justify-center gap-2.5 font-display text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold text-ink"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <BookOpen className="h-6 w-6 text-coral" strokeWidth={2.75} />
          {t('fomo.profundizar.heading')}
        </motion.h2>

        <div className="mt-8 space-y-3">
          {panels.map(({ i, title }) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.05, duration: 0.45, ease: 'easeOut' }}
                className={cn(
                  'overflow-hidden rounded-blob-3 border-[3px] border-ink shadow-doodle-sm',
                  PANEL_CLASSES[i],
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <span className="flex-1 font-display text-[1.1rem] font-extrabold leading-snug text-ink">
                    {title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-ink-soft"
                  >
                    <ChevronDown className="h-5 w-5" strokeWidth={2.75} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t-[3px] border-dashed border-ink/30 px-5 py-4">
                        {i === 0 && <TextPanel bodyKey="p1Body" body2Key="p1Body2" />}
                        {i === 1 && <TextPanel bodyKey="p2Body" body2Key="p2Body2" />}
                        {i === 2 && <TextPanel bodyKey="p3Body" body2Key="p3Body2" />}
                        {i === 3 && <DataPanel />}
                        {i === 4 && <SourcesPanel />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TextPanel({ bodyKey, body2Key }: { bodyKey: string; body2Key: string }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3 text-[0.98rem] font-semibold leading-relaxed text-ink">
      <p>{t(`fomo.profundizar.${bodyKey}`)}</p>
      <p>{t(`fomo.profundizar.${body2Key}`)}</p>
    </div>
  );
}

function DataPanel() {
  const { t } = useLanguage();
  const g2 = [
    { label: t('fomo.profundizar.g2b1'), value: G2_JOBS_2030.created, color: 'bg-teal' },
    { label: t('fomo.profundizar.g2b2'), value: G2_JOBS_2030.displaced, color: 'bg-coral' },
    { label: t('fomo.profundizar.g2b3'), value: G2_JOBS_2030.net, color: 'bg-sun' },
  ];
  const g2max = G2_JOBS_2030.created;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-display text-[1.05rem] font-extrabold text-ink">
          {t('fomo.profundizar.g2Title')}
        </p>
        <div className="mt-3 space-y-2.5">
          {g2.map((b, i) => (
            <div key={b.label}>
              <p className="mb-1 text-[0.85rem] font-bold leading-tight text-ink">{b.label}</p>
              <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
                <motion.div
                  className={cn('h-full rounded-full', b.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.value / g2max) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.15, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-soft">
          {t('fomo.profundizar.g2Source')}
        </p>
      </div>

      <div>
        <p className="font-display text-[1.05rem] font-extrabold text-ink">
          {t('fomo.profundizar.g3Title')}
        </p>
        <div className="mt-3 flex h-36 items-end justify-between gap-3 px-1">
          {G3_LAYOFFS.map((y, i) => (
            <div key={y.year} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="font-mono text-[0.68rem] font-bold text-ink-soft">{y.k}k</span>
              <motion.div
                className={cn('w-full rounded-t-lg border-2 border-ink', y.peak ? 'bg-coral' : 'bg-lilac')}
                initial={{ height: 0 }}
                animate={{ height: `${(y.k / 263) * 100}%` }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
              />
              <span className="font-mono text-[0.68rem] font-bold text-ink">{y.year}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[0.8rem] font-semibold leading-snug text-ink-soft">
          {t('fomo.profundizar.g3Note')}
        </p>
        <p className="mt-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-soft">
          {t('fomo.profundizar.g3Source')}
        </p>
      </div>
    </div>
  );
}

function SourcesPanel() {
  const { t } = useLanguage();
  return (
    <ul className="space-y-2">
      {SOURCE_LINKS.map(({ key, url }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-1.5 text-[0.9rem] font-semibold text-ink underline decoration-dotted underline-offset-4 hover:text-coral-deep"
          >
            {t(`fomo.profundizar.${key}`)}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-soft" strokeWidth={2.5} />
          </a>
        </li>
      ))}
    </ul>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clapperboard, Sparkles, Star, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import CaseShell from './CaseShell';
import { useLanguage } from '@/i18n/useLanguage';

interface Poster {
  id: string;
  title: string;
  genre: string;
  bg: string;
}

const PICKS_NEEDED = 3;

export default function NetflixCase() {
  const { t } = useLanguage();
  const [picked, setPicked] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');

  const POSTERS: Poster[] = [
    { id: 'comedia', title: t('ejemplos.netflix.p1Title'), genre: t('ejemplos.netflix.p1Genre'), bg: 'bg-sun/70' },
    { id: 'misterio', title: t('ejemplos.netflix.p2Title'), genre: t('ejemplos.netflix.p2Genre'), bg: 'bg-lilac/40' },
    { id: 'romantica', title: t('ejemplos.netflix.p3Title'), genre: t('ejemplos.netflix.p3Genre'), bg: 'bg-pink/40' },
    { id: 'documental', title: t('ejemplos.netflix.p4Title'), genre: t('ejemplos.netflix.p4Genre'), bg: 'bg-teal/30' },
    { id: 'accion', title: t('ejemplos.netflix.p5Title'), genre: t('ejemplos.netflix.p5Genre'), bg: 'bg-coral/40' },
    { id: 'animacion', title: t('ejemplos.netflix.p6Title'), genre: t('ejemplos.netflix.p6Genre'), bg: 'bg-mint' },
  ];

  const toggle = (id: string) => {
    if (phase !== 'idle') return;
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= PICKS_NEEDED) return p;
      return [...p, id];
    });
  };

  const recommend = () => {
    if (picked.length < PICKS_NEEDED || phase !== 'idle') return;
    setPhase('scanning');
    window.setTimeout(() => setPhase('done'), 1100);
  };

  const reset = () => {
    setPicked([]);
    setPhase('idle');
  };

  const pickedGenres = POSTERS.filter((p) => picked.includes(p.id)).map((p) => p.genre);
  const recMovie = `'${t('ejemplos.netflix.recTitle')}'`;
  const explanation =
    pickedGenres.length >= 2
      ? `${t('ejemplos.netflix.explBefore')}${pickedGenres[0]} + ${pickedGenres[1]}${t('ejemplos.netflix.explMiddle')}${recMovie}.`
      : `${t('ejemplos.netflix.explSimple')}${recMovie}.`;

  return (
    <CaseShell
      caseNumber={1}
      color="coral"
      icon={Tv}
      timeSticker={t('ejemplos.netflix.time')}
      title={t('ejemplos.netflix.title')}
      text={t('ejemplos.netflix.text')}
      image="/ejemplo-netflix.png"
      imageAlt={t('ejemplos.netflix.imageAlt')}
      bg="bg-paper"
      stops={[
        t('ejemplos.netflix.stop1'),
        t('ejemplos.netflix.stop2'),
        t('ejemplos.netflix.stop3'),
        t('ejemplos.netflix.stop4'),
        t('ejemplos.netflix.stop5'),
      ]}
    >
      <div className="doodle-card relative overflow-hidden p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
            <Clapperboard className="h-5 w-5 text-coral" strokeWidth={2.75} />
            {t('ejemplos.netflix.recommender')}
          </h4>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
            {t('ejemplos.netflix.pickCounter')} ({picked.length}/{PICKS_NEEDED})
          </span>
        </div>

        {/* posters grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {POSTERS.map((p, i) => {
            const active = picked.includes(p.id);
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                aria-pressed={active}
                className={cn(
                  'relative flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-xl border-[3px] border-ink p-2 text-center shadow-doodle-sm transition-all',
                  p.bg,
                  active ? 'ring-4 ring-coral/60' : 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed',
                  phase !== 'idle' && !active && 'opacity-60',
                )}
                initial={{ y: 40, opacity: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="font-display text-sm font-extrabold leading-tight text-ink">{p.title}</span>
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
                  {p.genre}
                </span>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-coral text-white"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Check className="h-4 w-4" strokeWidth={3.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* action row */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={recommend}
            disabled={picked.length < PICKS_NEEDED || phase === 'scanning'}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-6 py-3 font-display text-base font-extrabold shadow-doodle transition-all',
              picked.length >= PICKS_NEEDED && phase !== 'scanning'
                ? 'bg-coral text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed'
                : 'cursor-not-allowed bg-paper-deep text-ink-soft',
            )}
          >
            <Sparkles className="h-5 w-5" strokeWidth={2.75} />
            {phase === 'scanning' ? t('ejemplos.netflix.thinking') : t('ejemplos.netflix.recommend')}
          </button>
          {phase === 'done' && (
            <button
              type="button"
              onClick={reset}
              className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              {t('ejemplos.netflix.pickOthers')}
            </button>
          )}
        </div>

        {/* radar sweep */}
        <AnimatePresence>
          {phase === 'scanning' && (
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-[130%] w-[130%] rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(255,107,74,0.45) 0deg, rgba(255,107,74,0.12) 60deg, transparent 90deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* recommendation */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              className="mt-6 rounded-blob-2 border-[3px] border-ink bg-peach p-5 shadow-doodle-sm"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <motion.span
                  className="text-sun"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 10 }}
                >
                  <Star className="h-8 w-8" fill="#FFC53D" strokeWidth={2.5} />
                </motion.span>
                <div>
                  <p className="font-display text-xl font-extrabold text-ink">
                    {recMovie}
                    <span className="ml-2 inline-block -rotate-3 rounded-full border-2 border-ink bg-coral px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-white">
                      97% {t('ejemplos.netflix.recBadge')}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-soft">{explanation}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { label: t('ejemplos.netflix.bar1'), pct: 97 },
                  { label: t('ejemplos.netflix.bar2'), pct: 88 },
                  { label: t('ejemplos.netflix.bar3'), pct: 81 },
                ].map((r, i) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="w-40 truncate font-mono text-xs font-bold text-ink">{r.label}</span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
                      <motion.div
                        className="h-full bg-coral"
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs font-bold text-ink">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CaseShell>
  );
}

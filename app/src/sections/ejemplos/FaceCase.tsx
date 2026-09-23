import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Lock, LockOpen, ScanFace, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import CaseShell from './CaseShell';
import { useLanguage } from '@/i18n/useLanguage';

const MATCH_YOU = 98.4;
const MATCH_TWIN = 41;

const FACE_POINTS = [
  { x: 32, y: 38 }, // left eye
  { x: 68, y: 38 }, // right eye
  { x: 50, y: 52 }, // nose
  { x: 38, y: 66 }, // mouth left
  { x: 62, y: 66 }, // mouth right
];

export default function FaceCase() {
  const { t } = useLanguage();
  const [twin, setTwin] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [match, setMatch] = useState(0);

  const scan = () => {
    setPhase('scanning');
    setMatch(0);
    window.setTimeout(() => setPhase('done'), 1400);
  };

  useEffect(() => {
    if (phase !== 'done') return;
    const target = twin ? MATCH_TWIN : MATCH_YOU;
    const controls = animate(0, target, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (v) => setMatch(Math.round(v * 10) / 10),
    });
    return () => controls.stop();
  }, [phase, twin]);

  const unlocked = phase === 'done' && !twin;

  return (
    <CaseShell
      caseNumber={3}
      color="teal"
      icon={ScanFace}
      timeSticker={t('ejemplos.face.time')}
      title={t('ejemplos.face.title')}
      text={t('ejemplos.face.text')}
      image="/ejemplo-cara.png"
      imageAlt={t('ejemplos.face.imageAlt')}
      bg="bg-mint"
      stops={[
        t('ejemplos.face.stop1'),
        t('ejemplos.face.stop2'),
        t('ejemplos.face.stop3'),
        t('ejemplos.face.stop4'),
        t('ejemplos.face.stop5'),
      ]}
    >
      <div className="doodle-card p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
            <ScanFace className="h-5 w-5 text-teal" strokeWidth={2.75} />
            {t('ejemplos.face.scanner')}
          </h4>
          {/* twin mode toggle */}
          <button
            type="button"
            onClick={() => {
              setTwin((t) => !t);
              setPhase('idle');
              setMatch(0);
            }}
            aria-pressed={twin}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
              twin ? 'bg-pink text-ink' : 'bg-white text-ink-soft',
            )}
          >
            <Users className="h-4 w-4" strokeWidth={2.75} />
            {t('ejemplos.face.twinMode')}: {twin ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* the phone */}
          <div className="mx-auto w-full max-w-[240px]">
            <motion.div
              className="relative overflow-hidden rounded-[2rem] border-[4px] border-ink bg-white p-3 shadow-doodle"
              animate={phase === 'done' && twin ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border-2 border-ink bg-peach">
                {/* doodle face */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle cx="50" cy="52" r="32" fill="#FFF6E9" stroke="#26233F" strokeWidth="3" />
                  <circle cx="38" cy="46" r="3.5" fill="#26233F" />
                  <circle cx="62" cy="46" r="3.5" fill="#26233F" />
                  <path d="M47 55 Q50 58 53 55" fill="none" stroke="#26233F" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40 64 Q50 72 60 64" fill="none" stroke="#26233F" strokeWidth="3" strokeLinecap="round" />
                  {twin && (
                    <path d="M30 30 L36 36 M36 30 L30 36" stroke="#E04E2D" strokeWidth="3" strokeLinecap="round" />
                  )}
                </svg>

                {/* facial reference points */}
                <AnimatePresence>
                  {phase !== 'idle' &&
                    FACE_POINTS.map((p, i) => (
                      <motion.span
                        key={`${p.x}-${p.y}-${String(twin)}`}
                        className="absolute h-2.5 w-2.5 rounded-full border-2 border-ink bg-teal"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, marginLeft: -5, marginTop: -5 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 500, damping: 16 }}
                      />
                    ))}
                </AnimatePresence>

                {/* measuring lines */}
                {phase !== 'idle' && (
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <motion.line x1="32" y1="38" x2="68" y2="38" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.4 }} />
                    <motion.line x1="50" y1="38" x2="50" y2="52" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.85, duration: 0.4 }} />
                    <motion.line x1="38" y1="66" x2="62" y2="66" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.4 }} />
                  </motion.svg>
                )}

                {/* scan line */}
                {phase === 'scanning' && (
                  <motion.div
                    className="absolute inset-x-0 h-1.5 bg-teal/80"
                    style={{ boxShadow: '0 0 18px rgba(20,184,166,0.8)' }}
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                )}
              </div>

              {/* lock */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <motion.span
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink text-white',
                    unlocked ? 'bg-teal' : phase === 'done' ? 'bg-coral' : 'bg-ink-soft',
                  )}
                  animate={unlocked ? { rotate: [-15, 0], scale: [0.8, 1.15, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                >
                  {unlocked ? (
                    <LockOpen className="h-5 w-5" strokeWidth={2.75} />
                  ) : (
                    <Lock className="h-5 w-5" strokeWidth={2.75} />
                  )}
                </motion.span>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                  {unlocked
                    ? t('ejemplos.face.open')
                    : phase === 'done'
                      ? t('ejemplos.face.denied')
                      : t('ejemplos.face.locked')}
                </span>
              </div>
            </motion.div>
          </div>

          {/* controls + match bar */}
          <div>
            <button
              type="button"
              onClick={scan}
              disabled={phase === 'scanning'}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-6 py-3 font-display text-base font-extrabold shadow-doodle transition-all',
                phase === 'scanning'
                  ? 'cursor-wait bg-paper-deep text-ink-soft'
                  : 'bg-teal text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed',
              )}
            >
              <ScanFace className="h-5 w-5" strokeWidth={2.75} />
              {phase === 'scanning' ? t('ejemplos.face.scanning') : t('ejemplos.face.scan')}
            </button>

            <div className="mt-6">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                  {t('ejemplos.face.match')}
                </span>
                <span className="font-mono text-2xl font-bold text-ink">
                  {phase === 'done' ? match.toFixed(1) : '0.0'}%
                </span>
              </div>
              <div className="h-6 overflow-hidden rounded-full border-[3px] border-ink bg-white">
                <motion.div
                  className={cn('h-full', unlocked ? 'bg-teal' : 'bg-coral')}
                  animate={{ width: phase === 'done' ? `${match}%` : '0%' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>

            <AnimatePresence>
              {phase === 'done' && twin && (
                <motion.p
                  className="mt-4 rounded-blob-3 border-[3px] border-ink bg-peach px-4 py-2.5 font-semibold text-ink shadow-doodle-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  {t('ejemplos.face.twinMsg')}
                </motion.p>
              )}
              {phase === 'done' && !twin && (
                <motion.p
                  className="mt-4 rounded-blob-3 border-[3px] border-ink bg-mint px-4 py-2.5 font-semibold text-ink shadow-doodle-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  {t('ejemplos.face.youMsg')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}

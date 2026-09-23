import { memo, useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpeechBubble, SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import StationShell from './StationShell';
import ConfettiBurst from './ConfettiBurst';
import { tokenize } from './tokenizer';

interface Pattern {
  label: string;
  strength: number;
}

/** pattern strengths (labels come from the dictionaries) */
const VARIANT_STRENGTHS = [
  [92, 85, 74],
  [90, 78, 66],
  [93, 81, 70],
] as const;

const CHIP_BG = ['bg-mint', 'bg-peach', 'bg-sun', 'bg-lilac/25'] as const;

/** Slow perpetual rotation, isolated + memoized so parent renders don't reset it. */
const SpinningRing = memo(function SpinningRing({
  children,
  spinning,
}: {
  children: ReactNode;
  spinning: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: spinning ? 720 : 360 }}
      transition={
        spinning
          ? { duration: 1.2, ease: 'easeInOut' }
          : { duration: 48, repeat: Infinity, ease: 'linear' }
      }
    >
      {children}
    </motion.div>
  );
});

interface Station3Props {
  question: string;
  completed: boolean;
  onComplete: () => void;
}

export default function Station3Biblioteca({ question, completed, onComplete }: Station3Props) {
  const { t } = useLanguage();
  const [consulted, setConsulted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [variant, setVariant] = useState(0);
  const [confetti, setConfetti] = useState(0);

  const questionVariants: { label: string; patterns: Pattern[] }[] = [
    {
      label: t('mapa.s3.v1Label'),
      patterns: [
        { label: t('mapa.s3.v1P1'), strength: VARIANT_STRENGTHS[0][0] },
        { label: t('mapa.s3.v1P2'), strength: VARIANT_STRENGTHS[0][1] },
        { label: t('mapa.s3.v1P3'), strength: VARIANT_STRENGTHS[0][2] },
      ],
    },
    {
      label: t('mapa.s3.v2Label'),
      patterns: [
        { label: t('mapa.s3.v2P1'), strength: VARIANT_STRENGTHS[1][0] },
        { label: t('mapa.s3.v2P2'), strength: VARIANT_STRENGTHS[1][1] },
        { label: t('mapa.s3.v2P3'), strength: VARIANT_STRENGTHS[1][2] },
      ],
    },
    {
      label: t('mapa.s3.v3Label'),
      patterns: [
        { label: t('mapa.s3.v3P1'), strength: VARIANT_STRENGTHS[2][0] },
        { label: t('mapa.s3.v3P2'), strength: VARIANT_STRENGTHS[2][1] },
        { label: t('mapa.s3.v3P3'), strength: VARIANT_STRENGTHS[2][2] },
      ],
    },
  ];

  /** union of all pattern labels, placed on the ring */
  const ringPatterns = questionVariants.flatMap((v) => v.patterns.map((p) => p.label));

  const orbitTokens = useMemo(() => tokenize(question).slice(0, 6), [question]);
  const active = questionVariants[variant];
  const isRelevant = (label: string) => active.patterns.some((p) => p.label === label);

  const consult = () => {
    if (spinning) return;
    setSpinning(true);
    window.setTimeout(() => {
      setSpinning(false);
      if (!consulted) {
        setConsulted(true);
        setConfetti((n) => n + 1);
        window.setTimeout(onComplete, 500);
      } else {
        setConsulted(true);
      }
    }, 1250);
  };

  const demo = (
    <div className="relative flex flex-col gap-4">
      <ConfettiBurst trigger={confetti} />

      {/* pattern tunnel */}
      <div className="relative mx-auto h-[260px] w-[260px] md:h-[300px] md:w-[300px]">
        {/* tunnel rings */}
        <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-teal/50" aria-hidden="true" />
        <div className="absolute inset-6 rounded-full border-[3px] border-dashed border-teal/30" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink bg-mint shadow-doodle-sm">
            <BookOpen className="h-8 w-8 text-teal-deep" strokeWidth={2.5} />
          </div>
        </div>

        <SpinningRing spinning={spinning}>
          {/* orbiting question tokens */}
          {orbitTokens.map((t, i) => {
            const angle = (i / orbitTokens.length) * 360 + 18;
            return (
              <span
                key={`tok-${i}`}
                className={cn(
                  'absolute left-1/2 top-1/2 rounded-md border-2 border-ink px-1.5 py-0.5 font-mono text-[0.62rem] font-bold shadow-doodle-sm',
                  CHIP_BG[i % CHIP_BG.length],
                )}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-118px) rotate(${-angle}deg)`,
                }}
              >
                {t.text}
              </span>
            );
          })}
          {/* pattern cards */}
          {ringPatterns.slice(0, 6).map((label, i) => {
            const angle = (i / 6) * 360;
            const relevant = consulted && isRelevant(label);
            return (
              <motion.span
                key={label}
                className={cn(
                  'absolute left-1/2 top-1/2 w-[104px] rounded-lg border-2 border-ink bg-white px-1.5 py-1 text-center font-mono text-[0.58rem] font-bold leading-tight shadow-doodle-sm transition-colors',
                  relevant ? 'bg-mint text-teal-deep' : 'text-ink-soft',
                  consulted && !relevant && 'opacity-45',
                )}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-72px) rotate(${-angle}deg)`,
                }}
                animate={relevant ? { scale: [1, 1.18, 1.08] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.12, zIndex: 20 }}
              >
                {label}
              </motion.span>
            );
          })}
        </SpinningRing>
      </div>

      {/* variant slider */}
      <div>
        <p className="mb-1.5 text-center font-mono text-[0.72rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
          {t('mapa.s3.variantLabel')}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {questionVariants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setVariant(i)}
              className={cn(
                'rounded-full border-2 border-ink px-2.5 py-1 font-mono text-[0.68rem] font-bold shadow-doodle-sm transition-colors',
                variant === i ? 'bg-teal text-white' : 'bg-paper text-ink hover:bg-mint',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={consult}
        whileHover={{ scale: 1.04, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center justify-center gap-2 self-center rounded-full border-[3px] border-ink bg-teal px-6 py-2.5 font-display font-extrabold text-white shadow-doodle-sm transition-colors hover:bg-teal-deep"
      >
        <Sparkles className="h-5 w-5" strokeWidth={2.75} />
        {consulted ? t('mapa.s3.consultAgain') : t('mapa.s3.consultIdle')}
      </motion.button>
      {completed && (
        <p className="text-center font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
          {t('mapa.s3.stampDone')}
        </p>
      )}

      {/* results panel */}
      <AnimatePresence>
        {consulted && (
          <motion.div
            key={`panel-${variant}`}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-2xl border-[3px] border-ink bg-mint/60 p-4"
          >
            <p className="mb-3 font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
              {t('mapa.s3.resultsTitle')}
            </p>
            <div className="space-y-2.5">
              {active.patterns.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.12 }}
                  className="rounded-xl border-2 border-ink bg-white p-2.5 shadow-doodle-sm"
                >
                  <p className="mb-1.5 text-[0.82rem] font-bold leading-tight text-ink">{p.label}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
                      <motion.div
                        className="h-full rounded-full bg-teal"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.strength}%` }}
                        transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="font-mono text-[0.72rem] font-bold text-teal-deep">{p.strength}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <StationShell
      id="estacion-3"
      number={3}
      color="teal"
      sticker={t('mapa.s3.sticker')}
      title={
        <>
          {t('mapa.s3.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.s3.titleHighlight')}
            <SquiggleUnderline color="teal" className="absolute -bottom-1 left-0" />
          </span>
        </>
      }
      dato={t('mapa.s3.dato')}
      machineLabel={t('mapa.s3.machineLabel')}
      bgTint="#EDF8F4"
      demo={demo}
      aside={
        <SpeechBubble mascot="preguntin-pensando" tail="bottom-left">
          {t('mapa.s3.bubble')}
        </SpeechBubble>
      }
    >
      <p>
        {t('mapa.s3.p1Before')}
        <strong className="text-ink">{t('mapa.s3.p1Strong1')}</strong>
        {t('mapa.s3.p1Mid')}
        <strong className="text-ink">{t('mapa.s3.p1Strong2')}</strong>
        {t('mapa.s3.p1After')}
      </p>
      <p>{t('mapa.s3.p2')}</p>
    </StationShell>
  );
}

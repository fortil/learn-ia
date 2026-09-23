import { useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { ChefHat, GraduationCap, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/doodle/SectionHeading';
import SpeechBubble from '@/components/doodle/SpeechBubble';
import { useLanguage } from '@/i18n/useLanguage';

type Bin = 'train' | 'infer';

interface GameCard {
  id: number;
  text: string;
  answer: Bin;
}

const CONFETTI_COLORS = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6'];

// deterministic pseudo-random pieces (stable across renders)
const CONFETTI_PIECES = Array.from({ length: 26 }, (_, i) => {
  const rand = (salt: number) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    id: i,
    x: rand(1) * 100,
    delay: rand(2) * 0.4,
    duration: 1.6 + rand(3) * 1.2,
    size: 8 + rand(4) * 8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
    drift: -40 + rand(5) * 80,
  };
});

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {CONFETTI_PIECES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            border: '2px solid #26233F',
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: p.drift, opacity: [1, 1, 0.6], rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function BinBox({
  bin,
  count,
  flashKey,
  boxRef,
}: {
  bin: Bin;
  count: number;
  flashKey: number;
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useLanguage();
  const isTrain = bin === 'train';
  const Icon = isTrain ? GraduationCap : ChefHat;
  return (
    <motion.div
      ref={boxRef}
      key={flashKey}
      animate={flashKey > 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 400, damping: 14 }}
      className={cn(
        'relative flex min-h-[190px] flex-col items-center justify-center gap-2 rounded-blob-2 border-[3px] border-dashed border-ink p-5 text-center shadow-doodle-sm',
        isTrain ? 'bg-lilac/15' : 'bg-peach',
      )}
    >
      <span
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink text-white shadow-doodle-sm',
          isTrain ? 'bg-lilac' : 'bg-coral',
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={2.75} />
      </span>
      <span className="font-display text-lg font-extrabold uppercase tracking-wide text-ink">
        {isTrain ? t('entrenar.game.binTrain') : t('entrenar.game.binInfer')}
      </span>
      <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
        {count} {count === 1 ? t('entrenar.game.cardSingular') : t('entrenar.game.cardPlural')}
      </span>
      <AnimatePresence>
        {flashKey > 0 && (
          <motion.span
            key={`spark-${flashKey}`}
            className="absolute -right-2 -top-3 text-sun"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.4, 0], rotate: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="h-8 w-8" strokeWidth={2.5} fill="#FFC53D" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ClassifierGame() {
  const { t } = useLanguage();
  const [solved, setSolved] = useState<number[]>([]);
  const [flash, setFlash] = useState<{ bin: Bin; n: number }>({ bin: 'train', n: 0 });
  const [showHint, setShowHint] = useState(false);
  const trainRef = useRef<HTMLDivElement>(null);
  const inferRef = useRef<HTMLDivElement>(null);
  const cardControls = useAnimationControls();

  const CARDS: GameCard[] = [
    { id: 1, text: t('entrenar.game.c1'), answer: 'infer' },
    { id: 2, text: t('entrenar.game.c2'), answer: 'train' },
    { id: 3, text: t('entrenar.game.c3'), answer: 'infer' },
    { id: 4, text: t('entrenar.game.c4'), answer: 'train' },
    { id: 5, text: t('entrenar.game.c5'), answer: 'infer' },
    { id: 6, text: t('entrenar.game.c6'), answer: 'train' },
    { id: 7, text: t('entrenar.game.c7'), answer: 'infer' },
    { id: 8, text: t('entrenar.game.c8'), answer: 'train' },
  ];

  const current = CARDS.find((c) => !solved.includes(c.id));
  const done = solved.length === CARDS.length;
  const remaining = CARDS.length - solved.length;

  const hitBin = (x: number, y: number): Bin | null => {
    const inRect = (el: HTMLDivElement | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    if (inRect(trainRef.current)) return 'train';
    if (inRect(inferRef.current)) return 'infer';
    return null;
  };

  const judge = (bin: Bin) => {
    if (!current) return;
    if (bin === current.answer) {
      const next = [...solved, current.id];
      setSolved(next);
      setShowHint(false);
      setFlash({ bin, n: flash.n + 1 });
    } else {
      setShowHint(true);
      cardControls.start({
        x: [0, -12, 12, -9, 9, 0],
        transition: { duration: 0.45 },
      });
    }
  };

  const restart = () => {
    setSolved([]);
    setShowHint(false);
    setFlash({ bin: 'train', n: 0 });
  };

  return (
    <section className="relative bg-paper-deep py-24 md:py-32">
      {done && <Confetti />}
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          sticker={t('entrenar.game.sticker')}
          stickerColor="sun"
          title={t('entrenar.game.title')}
          underlineWord={t('entrenar.game.underlineWord')}
          underlineColor="lilac"
          subtitle={t('entrenar.game.subtitle')}
        />

        <div className="mx-auto max-w-4xl">
          {/* score strip */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="rounded-full border-[3px] border-ink bg-white px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.08em] shadow-doodle-sm">
              {t('entrenar.game.score')} {solved.length}/{CARDS.length}
            </span>
            {done && (
              <motion.button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.08em] shadow-doodle-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2.75} />
                {t('entrenar.game.again')}
              </motion.button>
            )}
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-[1fr_1.2fr_1fr]">
            <BinBox
              bin="train"
              count={solved.filter((id) => CARDS.find((c) => c.id === id)?.answer === 'train').length}
              flashKey={flash.bin === 'train' ? flash.n : 0}
              boxRef={trainRef}
            />

            {/* the pile */}
            <div className="relative flex min-h-[260px] items-center justify-center">
              <AnimatePresence mode="popLayout">
                {current ? (
                  <motion.div
                    key={current.id}
                    className="relative z-10 w-full max-w-xs"
                    initial={{ y: 60, opacity: 0, rotate: -3 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    {/* stacked deck behind */}
                    {remaining > 1 && (
                      <div aria-hidden="true" className="absolute inset-0 translate-y-2 rotate-2 rounded-blob-3 border-[3px] border-ink bg-paper-deep shadow-doodle-sm" />
                    )}
                    {remaining > 2 && (
                      <div aria-hidden="true" className="absolute inset-0 translate-y-1 -rotate-1 rounded-blob-3 border-[3px] border-ink bg-paper shadow-doodle-sm" />
                    )}
                    <motion.div
                      drag
                      dragSnapToOrigin
                      dragElastic={0.4}
                      whileDrag={{ scale: 1.06, rotate: 2, boxShadow: '10px 12px 0 #26233F', zIndex: 50, cursor: 'grabbing' }}
                      animate={cardControls}
                      onDragEnd={(_, info) => {
                        const bin = hitBin(info.point.x, info.point.y);
                        if (bin) judge(bin);
                      }}
                      className="relative cursor-grab rounded-blob-3 border-[3px] border-ink bg-white p-6 text-center shadow-doodle"
                    >
                      <p className="font-display text-lg font-extrabold leading-snug text-ink">
                        "{current.text}"
                      </p>
                      <p className="mt-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
                        {t('entrenar.game.dragHint')}
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="summary"
                    className="doodle-card w-full max-w-xs p-6 text-center"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                  >
                    <img src="/preguntin-fiesta.svg" alt={t('entrenar.game.mascotAlt')} className="mx-auto h-20 w-20" />
                    <p className="mt-2 font-display text-2xl font-extrabold text-ink">
                      {CARDS.length}/{CARDS.length}
                    </p>
                    <p className="mt-1 font-semibold text-ink-soft">
                      {t('entrenar.game.doneText')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <BinBox
              bin="infer"
              count={solved.filter((id) => CARDS.find((c) => c.id === id)?.answer === 'infer').length}
              flashKey={flash.bin === 'infer' ? flash.n : 0}
              boxRef={inferRef}
            />
          </div>

          {/* A/B buttons (mobile + accessibility) */}
          {current && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={() => judge('train')}
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-lilac px-6 py-3 font-display text-base font-extrabold text-white shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
                whileTap={{ scale: 0.96 }}
              >
                <GraduationCap className="h-5 w-5" strokeWidth={2.75} />
                {t('entrenar.game.binTrain')}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => judge('infer')}
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-6 py-3 font-display text-base font-extrabold text-white shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
                whileTap={{ scale: 0.96 }}
              >
                <ChefHat className="h-5 w-5" strokeWidth={2.75} />
                {t('entrenar.game.binInfer')}
              </motion.button>
            </div>
          )}

          {/* hint bubble */}
          <div className="mt-8 flex min-h-[90px] justify-center">
            <AnimatePresence>
              {showHint && !done && (
                <SpeechBubble mascot="preguntin-pensando" tail="bottom-left">
                  {t('entrenar.game.hintBefore')}
                  <strong>{t('entrenar.game.hintStrong1')}</strong>
                  {t('entrenar.game.hintMiddle')}
                  <strong>{t('entrenar.game.hintStrong2')}</strong>
                  {t('entrenar.game.hintAfter')}
                </SpeechBubble>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

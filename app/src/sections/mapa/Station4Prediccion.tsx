import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MousePointerClick, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpeechBubble, SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import StationShell from './StationShell';
import ConfettiBurst from './ConfettiBurst';

interface Candidate {
  word: string;
  prob: number;
}

interface Round {
  /** sentence prefix shown before the gap */
  prefix: string;
  candidates: Candidate[];
}

/** candidate probabilities (words come from the dictionaries) */
const ROUND_PROBS = [
  [72, 19, 0.4],
  [64, 21, 8],
  [58, 30, 3],
  [69, 22, 2],
] as const;

/** animated 0 → target count-up, synced with the probability bars */
function CountUp({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased * 10) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className="font-mono text-[0.75rem] font-bold text-lilac">
      {Number.isInteger(display) ? display : display.toFixed(1)}
      {suffix}
    </span>
  );
}

interface Station4Props {
  completed: boolean;
  onComplete: () => void;
  onAnswer: (sentence: string) => void;
}

export default function Station4Prediccion({ completed, onComplete, onAnswer }: Station4Props) {
  const { t } = useLanguage();
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [silly, setSilly] = useState(false);
  const [turbo, setTurbo] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const finishedRef = useRef(false);
  const turboTimer = useRef<number | null>(null);

  const ROUNDS: Round[] = [
    {
      prefix: t('mapa.s4.r1Prefix'),
      candidates: [
        { word: t('mapa.s4.r1w1'), prob: ROUND_PROBS[0][0] },
        { word: t('mapa.s4.r1w2'), prob: ROUND_PROBS[0][1] },
        { word: t('mapa.s4.r1w3'), prob: ROUND_PROBS[0][2] },
      ],
    },
    {
      prefix: t('mapa.s4.r2Prefix'),
      candidates: [
        { word: t('mapa.s4.r2w1'), prob: ROUND_PROBS[1][0] },
        { word: t('mapa.s4.r2w2'), prob: ROUND_PROBS[1][1] },
        { word: t('mapa.s4.r2w3'), prob: ROUND_PROBS[1][2] },
      ],
    },
    {
      prefix: t('mapa.s4.r3Prefix'),
      candidates: [
        { word: t('mapa.s4.r3w1'), prob: ROUND_PROBS[2][0] },
        { word: t('mapa.s4.r3w2'), prob: ROUND_PROBS[2][1] },
        { word: t('mapa.s4.r3w3'), prob: ROUND_PROBS[2][2] },
      ],
    },
    {
      prefix: t('mapa.s4.r4Prefix'),
      candidates: [
        { word: t('mapa.s4.r4w1'), prob: ROUND_PROBS[3][0] },
        { word: t('mapa.s4.r4w2'), prob: ROUND_PROBS[3][1] },
        { word: t('mapa.s4.r4w3'), prob: ROUND_PROBS[3][2] },
      ],
    },
  ];

  /** connectors joining each chosen word after the first one */
  const JOINS = [t('mapa.s4.join2'), t('mapa.s4.join3'), t('mapa.s4.join4')];

  const done = round >= ROUNDS.length;

  function buildSentence(words: string[]): string {
    if (words.length === 0) return '';
    let s = `${ROUNDS[0].prefix} ${words[0]}`;
    if (words.length > 1) s += `${JOINS[0]}${words[1]}`;
    if (words.length > 2) s += `${JOINS[1]}${words[2]}`;
    if (words.length > 3) s += `${JOINS[2]}${words[3]}.`;
    return s;
  }

  const finish = (words: string[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onAnswer(buildSentence(words));
    setConfetti((n) => n + 1);
    window.setTimeout(onComplete, 600);
  };

  const pick = (c: Candidate) => {
    if (done || turbo) return;
    const next = [...chosen, c.word];
    if (c.prob < 5) setSilly(true);
    setChosen(next);
    if (next.length >= ROUNDS.length) {
      setRound(ROUNDS.length);
      finish(next);
    } else {
      setRound(next.length);
    }
  };

  const pickBest = () => {
    const best = [...ROUNDS[round].candidates].sort((a, b) => b.prob - a.prob)[0];
    pick(best);
  };

  const runTurbo = () => {
    if (done || turbo) return;
    setTurbo(true);
    let current = chosen.length;
    const step = () => {
      if (current >= ROUNDS.length) {
        setTurbo(false);
        return;
      }
      const best = [...ROUNDS[current].candidates].sort((a, b) => b.prob - a.prob)[0];
      setChosen((prev) => {
        const next = [...prev, best.word];
        if (next.length >= ROUNDS.length) finish(next);
        return next;
      });
      current += 1;
      setRound(current);
      if (current < ROUNDS.length) {
        turboTimer.current = window.setTimeout(step, 500);
      } else {
        setTurbo(false);
      }
    };
    turboTimer.current = window.setTimeout(step, 350);
  };

  const reset = () => {
    if (turboTimer.current) window.clearTimeout(turboTimer.current);
    finishedRef.current = false;
    setTurbo(false);
    setChosen([]);
    setRound(0);
    setSilly(false);
  };

  useEffect(
    () => () => {
      if (turboTimer.current) window.clearTimeout(turboTimer.current);
    },
    [],
  );

  const currentRound = done ? null : ROUNDS[round];

  const demo = (
    <div className="relative flex flex-col gap-4">
      <ConfettiBurst trigger={confetti} count={6} />

      {/* sentence being built */}
      <div className="min-h-[96px] rounded-2xl border-[3px] border-ink bg-paper p-4 shadow-doodle-sm">
        <p className="text-[1.05rem] font-bold leading-relaxed text-ink">
          {chosen.map((w, i) => (
            <span key={i}>
              {i === 0 ? `${ROUNDS[0].prefix} ` : JOINS[i - 1]}
              <motion.span
                className="inline-block rounded-md bg-lilac/20 px-1.5 text-lilac"
                initial={{ scale: 0, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
          {!done && currentRound && (
            <span className="text-ink/60">
              {chosen.length === 0 ? `${currentRound.prefix} ` : ''}
              <span className="mx-1 inline-block min-w-[3rem] rounded-md border-b-4 border-lilac bg-lilac/10 px-2 text-center">
                <span className="animate-caret-blink text-lilac">?</span>
              </span>
            </span>
          )}
          {done && <span className="text-ink">.</span>}
        </p>
        <p className="mt-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
          {t('mapa.s4.roundLabel')
            .replace('{current}', String(Math.min(round + 1, ROUNDS.length)))
            .replace('{total}', String(ROUNDS.length))}
        </p>
      </div>

      {/* candidates */}
      <AnimatePresence mode="wait">
        {!done && currentRound && (
          <motion.div
            key={`round-${round}`}
            className="grid gap-2.5 sm:grid-cols-3"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.95 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            {currentRound.candidates.map((c) => {
              const isTop = c.prob === Math.max(...currentRound.candidates.map((x) => x.prob));
              return (
                <motion.button
                  key={c.word}
                  type="button"
                  onClick={() => pick(c)}
                  disabled={turbo}
                  variants={{ hidden: { y: 50, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-xl border-[3px] border-ink bg-white p-3 text-left shadow-doodle-sm disabled:opacity-70',
                    isTop && 'bg-lilac/10',
                  )}
                >
                  <span className="font-display text-[1rem] font-extrabold leading-tight text-ink">
                    “{c.word}”
                  </span>
                  <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
                    <motion.div
                      className="h-full rounded-full bg-lilac"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(c.prob, 2)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <CountUp value={c.prob} />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* actions */}
      {!done ? (
        <div className="flex flex-wrap justify-center gap-2.5">
          <motion.button
            type="button"
            onClick={pickBest}
            disabled={turbo}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-lilac px-5 py-2 font-display text-[0.9rem] font-extrabold text-white shadow-doodle-sm disabled:opacity-60"
          >
            <Bot className="h-4 w-4" strokeWidth={2.75} />
            {t('mapa.s4.letAiChoose')}
          </motion.button>
          <motion.button
            type="button"
            onClick={runTurbo}
            disabled={turbo}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-5 py-2 font-display text-[0.9rem] font-extrabold text-ink shadow-doodle-sm disabled:opacity-60"
          >
            <Zap className="h-4 w-4" strokeWidth={2.75} />
            {turbo ? t('mapa.s4.generating') : t('mapa.s4.generate')}
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-4 py-1.5 font-mono text-[0.78rem] font-bold uppercase tracking-[0.08em] shadow-doodle-sm">
            <Star className="h-4 w-4 fill-ink" strokeWidth={2} />
            {t('mapa.s4.unlocked')}
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-white px-5 py-2 font-display text-[0.9rem] font-extrabold text-ink shadow-doodle-sm transition-transform hover:scale-[1.03]"
          >
            <MousePointerClick className="h-4 w-4" strokeWidth={2.75} />
            {t('mapa.s4.tryAgain')}
          </button>
        </motion.div>
      )}

      {/* Preguntín reacts to silly picks */}
      <AnimatePresence>
        {silly && !done && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border-2 border-dashed border-lilac bg-lilac/10 p-3"
          >
            <p className="text-[0.85rem] font-bold leading-snug text-ink">
              {t('mapa.s4.silly').replace('{word}', chosen[chosen.length - 1])}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {completed && done && (
        <p className="text-center font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
          {t('mapa.s4.stampDone')}
        </p>
      )}
    </div>
  );

  return (
    <StationShell
      id="estacion-4"
      number={4}
      color="lilac"
      sticker={t('mapa.s4.sticker')}
      title={
        <>
          {t('mapa.s4.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.s4.titleHighlight')}
            <SquiggleUnderline color="lilac" className="absolute -bottom-1 left-0" />
          </span>
        </>
      }
      dato={t('mapa.s4.dato')}
      machineLabel={t('mapa.s4.machineLabel')}
      bgTint="#F4F0FD"
      demo={demo}
      aside={
        <SpeechBubble mascot="preguntin" tail="bottom-left">
          {t('mapa.s4.bubble')}
        </SpeechBubble>
      }
    >
      <p>
        {t('mapa.s4.p1Before')}
        <strong className="text-ink">{t('mapa.s4.p1Strong')}</strong>
        {t('mapa.s4.p1After')}
      </p>
      <p>{t('mapa.s4.p2')}</p>
    </StationShell>
  );
}

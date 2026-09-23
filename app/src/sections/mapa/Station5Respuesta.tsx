import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, RotateCcw, Timer, Zap } from 'lucide-react';
import { SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import StationShell from './StationShell';
import ConfettiBurst from './ConfettiBurst';

interface Station5Props {
  answer: string | null;
  completed: boolean;
  onComplete: () => void;
}

export default function Station5Respuesta({ answer, completed, onComplete }: Station5Props) {
  const { t } = useLanguage();
  const fullText = answer ?? t('mapa.s5.defaultAnswer');
  const [typed, setTyped] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { once: true, margin: '-30% 0px' });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    // live chronometer
    const chrono = window.setInterval(() => {
      setElapsed(Math.round((performance.now() - start) / 100) / 10);
    }, 100);
    timers.current.push(chrono);
    // car arrives, then typewriter starts
    const begin = window.setTimeout(() => {
      for (let i = 1; i <= fullText.length; i += 1) {
        timers.current.push(
          window.setTimeout(() => {
            setTyped(fullText.slice(0, i));
            if (i === fullText.length) {
              window.clearInterval(chrono);
              setElapsed(Math.round((performance.now() - start) / 100) / 10);
              setFinished(true);
              setConfetti((n) => n + 1);
              window.setTimeout(onComplete, 400);
            }
          }, 18 * i),
        );
      }
    }, 900);
    timers.current.push(begin);
    return () => {
      timers.current.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, fullText]);

  const repeat = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const demo = (
    <div ref={boxRef} className="relative flex flex-col gap-4">
      <ConfettiBurst trigger={confetti} count={30} />

      {/* the car comes back along a mini dotted road */}
      <div className="relative h-16 overflow-visible rounded-2xl border-[3px] border-dashed border-ink/25 bg-paper">
        <svg viewBox="0 0 320 60" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M300 34 C 240 50, 90 50, 24 30"
            stroke="#26233F"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="10 12"
            opacity={0.35}
          />
        </svg>
        <motion.img
          src="/cochecito.svg"
          alt={t('mapa.s5.carAlt')}
          className="absolute top-1 h-12 w-[72px] -scale-x-100"
          initial={{ left: '78%', opacity: 0 }}
          animate={inView ? { left: '2%', opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.div
          className="absolute left-6 top-6 flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink bg-pink font-display text-sm font-extrabold text-white shadow-doodle-sm"
          initial={{ x: 230, y: -6, opacity: 0 }}
          animate={inView ? { x: 0, y: -6, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
        >
          {t('mapa.s5.packetGlyph')}
        </motion.div>
      </div>

      {/* chat card with typewriter */}
      <div className="rounded-blob-3 border-[3px] border-ink bg-white p-4 shadow-doodle-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.08em] text-pink">
            {t('mapa.s5.screenLabel')}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] font-bold text-ink-soft">
            <Timer className="h-3.5 w-3.5" strokeWidth={2.75} />
            {elapsed.toFixed(1)}s
          </span>
        </div>
        <p className="min-h-[5.5rem] text-[1.02rem] font-semibold leading-relaxed text-ink">
          {typed}
          {!finished && typed.length > 0 && <span className="animate-caret-blink text-pink">|</span>}
          {!finished && typed.length === 0 && (
            <span className="text-ink/40">{t('mapa.s5.arriving')}</span>
          )}
        </p>
      </div>

      {finished && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <img src="/preguntin-fiesta.svg" alt={t('mapa.s5.mascotAlt')} className="h-24 w-24" />
          <p className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-4 py-1.5 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] shadow-doodle-sm">
            <Zap className="h-4 w-4" strokeWidth={2.75} />
            {t('mapa.s5.realLife')}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={repeat}
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-white px-5 py-2 font-display text-[0.9rem] font-extrabold text-ink shadow-doodle-sm transition-transform hover:scale-[1.03]"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.75} />
              {t('mapa.s5.repeat')}
            </button>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-pink px-5 py-2 font-display text-[0.9rem] font-extrabold text-white shadow-doodle-sm transition-transform hover:scale-[1.03]"
            >
              <GraduationCap className="h-4 w-4" strokeWidth={2.75} />
              {t('mapa.s5.quiz')}
            </Link>
          </div>
          {completed && (
            <p className="font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
              {t('mapa.s5.passportComplete')}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );

  return (
    <StationShell
      id="estacion-5"
      number={5}
      color="pink"
      sticker={t('mapa.s5.sticker')}
      title={
        <>
          {t('mapa.s5.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.s5.titleHighlight')}
            <SquiggleUnderline color="pink" className="absolute -bottom-1 left-0" />
          </span>
        </>
      }
      dato={t('mapa.s5.dato')}
      machineLabel={t('mapa.s5.machineLabel')}
      bgTint="#FDF0F6"
      demo={demo}
    >
      <p>
        {t('mapa.s5.p1Before')}
        <strong className="text-ink">{t('mapa.s5.p1Strong')}</strong>
        {t('mapa.s5.p1After')}
      </p>
      <p>{t('mapa.s5.p2')}</p>
    </StationShell>
  );
}

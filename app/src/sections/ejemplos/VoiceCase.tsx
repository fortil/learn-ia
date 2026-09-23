import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudRain, Mic, Music, Timer, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TokenChip from '@/components/doodle/TokenChip';
import CaseShell from './CaseShell';
import { useLanguage } from '@/i18n/useLanguage';

type Phase = 'idle' | 'waves' | 'typing' | 'tokens' | 'intent' | 'result';

interface Phrase {
  text: string;
  tokens: string[];
  intent: string;
  intentIcon: typeof Timer;
  result: string;
  isTimer?: boolean;
}

const WAVE_COLORS = ['#FF6B4A', '#14B8A6', '#FFC53D', '#8B5CF6', '#F472B6'];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function VoiceCase() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [typedChars, setTypedChars] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const timers = useRef<number[]>([]);

  const PHRASES: Phrase[] = [
    {
      text: t('ejemplos.voice.ph1Text'),
      tokens: t('ejemplos.voice.ph1Tokens').split(' '),
      intent: t('ejemplos.voice.ph1Intent'),
      intentIcon: Timer,
      result: t('ejemplos.voice.ph1Result'),
      isTimer: true,
    },
    {
      text: t('ejemplos.voice.ph2Text'),
      tokens: t('ejemplos.voice.ph2Tokens').split(' '),
      intent: t('ejemplos.voice.ph2Intent'),
      intentIcon: CloudRain,
      result: t('ejemplos.voice.ph2Result'),
    },
    {
      text: t('ejemplos.voice.ph3Text'),
      tokens: t('ejemplos.voice.ph3Tokens').split(' '),
      intent: t('ejemplos.voice.ph3Intent'),
      intentIcon: Music,
      result: t('ejemplos.voice.ph3Result'),
    },
  ];

  const phrase = selected !== null ? PHRASES[selected] : null;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const pick = (i: number) => {
    clearTimers();
    setSelected(i);
    setTypedChars(0);
    setSecondsLeft(600);
    setPhase('waves');
    const text = PHRASES[i].text;
    // waves -> typing
    timers.current.push(window.setTimeout(() => setPhase('typing'), 800));
    // typing -> tokens (35ms per char + margin)
    timers.current.push(window.setTimeout(() => setPhase('tokens'), 800 + text.length * 35 + 300));
    // tokens -> intent
    timers.current.push(
      window.setTimeout(() => setPhase('intent'), 800 + text.length * 35 + 300 + PHRASES[i].tokens.length * 120 + 500),
    );
    // intent -> result
    timers.current.push(
      window.setTimeout(() => setPhase('result'), 800 + text.length * 35 + 300 + PHRASES[i].tokens.length * 120 + 1800),
    );
  };

  // typewriter
  useEffect(() => {
    if (phase !== 'typing' || !phrase) return;
    const id = window.setInterval(() => {
      setTypedChars((n) => Math.min(n + 1, phrase.text.length));
    }, 35);
    return () => window.clearInterval(id);
  }, [phase, phrase]);

  // toy countdown (accelerated, stops after a few ticks)
  useEffect(() => {
    if (phase !== 'result' || !phrase?.isTimer) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 600 - 8 ? s - 1 : s));
    }, 180);
    return () => window.clearInterval(id);
  }, [phase, phrase]);

  const phaseDone = (p: Phase) => {
    const order: Phase[] = ['waves', 'typing', 'tokens', 'intent', 'result'];
    return order.indexOf(phase) > order.indexOf(p);
  };

  return (
    <CaseShell
      caseNumber={4}
      color="lilac"
      icon={Mic}
      timeSticker={t('ejemplos.voice.time')}
      title={t('ejemplos.voice.title')}
      text={t('ejemplos.voice.text')}
      image="/ejemplo-voz.png"
      imageAlt={t('ejemplos.voice.imageAlt')}
      reverse
      bg="bg-peach"
      stops={[
        t('ejemplos.voice.stop1'),
        t('ejemplos.voice.stop2'),
        t('ejemplos.voice.stop3'),
        t('ejemplos.voice.stop4'),
        t('ejemplos.voice.stop5'),
      ]}
    >
      <div className="doodle-card p-6 md:p-8">
        <h4 className="mb-5 flex items-center gap-2 font-display text-xl font-extrabold text-ink">
          <Wand2 className="h-5 w-5 text-lilac" strokeWidth={2.75} />
          {t('ejemplos.voice.header')}
        </h4>

        {/* phrase chips */}
        <div className="flex flex-wrap gap-2">
          {PHRASES.map((p, i) => (
            <button
              key={p.text}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={selected === i}
              className={cn(
                'rounded-full border-[3px] border-ink px-4 py-2 font-display text-sm font-extrabold shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                selected === i ? 'bg-lilac text-white' : 'bg-white text-ink',
              )}
            >
              "{p.text}"
            </button>
          ))}
        </div>

        {/* the chain */}
        <div className="mt-8 min-h-[220px]">
          <AnimatePresence mode="wait">
            {phrase && (
              <motion.div
                key={phrase.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* 1. voice waves */}
                {(phase === 'waves' || phaseDone('waves')) && (
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                      {t('ejemplos.voice.yourVoice')}
                    </span>
                    <div className="flex h-10 items-center gap-1.5">
                      {WAVE_COLORS.map((c, i) => (
                        <motion.span
                          key={c}
                          className="w-2 rounded-full border border-ink"
                          style={{ backgroundColor: c }}
                          animate={{ height: [10, 34 - i * 3, 10] }}
                          transition={{
                            duration: 0.6,
                            repeat: phase === 'waves' ? Infinity : 0,
                            delay: i * 0.08,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                    {phaseDone('waves') && (
                      <motion.span
                        className="font-mono text-xs font-bold text-teal-deep"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {t('ejemplos.voice.toText')}
                      </motion.span>
                    )}
                  </div>
                )}

                {/* 2. typewriter */}
                {(phase === 'typing' || phaseDone('typing')) && (
                  <p className="rounded-xl border-2 border-ink bg-white px-4 py-2.5 font-mono text-base font-bold text-ink shadow-doodle-sm">
                    {phrase.text.slice(0, phaseDone('typing') ? undefined : typedChars)}
                    {!phaseDone('typing') && <span className="animate-caret-blink">▌</span>}
                  </p>
                )}

                {/* 3. tokens */}
                {(phase === 'tokens' || phaseDone('tokens')) && (
                  <div className="flex flex-wrap gap-2">
                    {phrase.tokens.map((t, i) => (
                      <motion.span
                        key={t + i}
                        initial={{ y: 16, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12, type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        <TokenChip label={t} color={i % 2 === 0 ? 'lilac' : 'mint'} />
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* 4. intent bubble */}
                {(phase === 'intent' || phase === 'result') && (
                  <motion.div
                    className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-lilac px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-[0.06em] text-white shadow-doodle"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                    style={{ boxShadow: '5px 5px 0 #26233F, 0 0 24px rgba(139,92,246,0.45)' }}
                  >
                    <phrase.intentIcon className="h-5 w-5" strokeWidth={2.75} />
                    {phrase.intent}
                  </motion.div>
                )}

                {/* 5. result / countdown */}
                {phase === 'result' && (
                  <motion.div
                    className="flex flex-wrap items-center gap-4"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {phrase.isTimer && (
                      <span className="rounded-2xl border-[3px] border-ink bg-ink px-5 py-2 font-mono text-3xl font-bold text-sun shadow-doodle-sm">
                        {formatTime(secondsLeft)}
                      </span>
                    )}
                    <p className="max-w-md font-semibold text-ink">{phrase.result}</p>
                    <p className="w-full rounded-blob-3 border-[3px] border-ink bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft shadow-doodle-sm">
                      {t('ejemplos.voice.coopBefore')}
                      <strong className="text-ink">{t('ejemplos.voice.coopStrong1')}</strong>
                      {t('ejemplos.voice.coopMid1')}
                      <strong className="text-ink">{t('ejemplos.voice.coopStrong2')}</strong>
                      {t('ejemplos.voice.coopMid2')}
                      <strong className="text-ink">{t('ejemplos.voice.coopStrong3')}</strong>
                      {t('ejemplos.voice.coopAfter')}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!phrase && (
            <p className="flex h-full items-center justify-center pt-10 text-center font-semibold text-ink-soft">
              {t('ejemplos.voice.emptyHint')}
            </p>
          )}
        </div>
      </div>
    </CaseShell>
  );
}

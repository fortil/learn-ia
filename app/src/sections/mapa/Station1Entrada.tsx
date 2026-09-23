import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Mic, Pencil, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import StationShell from './StationShell';
import ConfettiBurst from './ConfettiBurst';

type InputKind = 'texto' | 'voz' | 'foto';

/** Little animated equalizer used in the "Voz" mode. */
function VoiceWaves() {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden="true">
      {[14, 26, 36, 22, 32, 16, 28].map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-coral"
          animate={{ height: [h * 0.4, h, h * 0.5, h] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

interface Station1Props {
  question: string;
  completed: boolean;
  onComplete: () => void;
}

export default function Station1Entrada({ question, completed, onComplete }: Station1Props) {
  const { t } = useLanguage();
  const [kind, setKind] = useState<InputKind>('texto');
  const [typed, setTyped] = useState('');
  const [sent, setSent] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const timers = useRef<number[]>([]);

  // typewriter for voice mode
  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (kind !== 'voz' || sent) return;
    const text = question;
    for (let i = 0; i <= text.length; i += 1) {
      timers.current.push(window.setTimeout(() => setTyped(text.slice(0, i)), 24 * i));
    }
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [kind, question, sent]);

  const KINDS: { id: InputKind; label: string; icon: typeof Pencil }[] = [
    { id: 'texto', label: t('mapa.s1.kindTexto'), icon: Pencil },
    { id: 'voz', label: t('mapa.s1.kindVoz'), icon: Mic },
    { id: 'foto', label: t('mapa.s1.kindFoto'), icon: Camera },
  ];

  const PHOTO_TAGS = [t('mapa.s1.photoTag1'), t('mapa.s1.photoTag2'), t('mapa.s1.photoTag3')];

  const send = () => {
    if (sent) return;
    setSent(true);
    setConfetti((n) => n + 1);
    window.setTimeout(onComplete, 500);
  };

  const demo = (
    <div className="relative flex flex-col gap-4">
      <ConfettiBurst trigger={confetti} />

      {/* ticket window */}
      <div className="rounded-2xl border-[3px] border-dashed border-ink/30 bg-paper p-4">
        <p className="mb-3 text-center font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
          {t('mapa.s1.windowLabel')}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {KINDS.map(({ id, label, icon: Icon }) => {
            const selected = kind === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => {
                  setKind(id);
                  setSent(false);
                }}
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 rounded-xl border-[3px] px-2 py-3 font-display text-sm font-extrabold shadow-doodle-sm transition-colors',
                  selected ? 'border-coral-deep bg-peach text-ink' : 'border-ink bg-white text-ink-soft hover:text-ink',
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
                {label}
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-coral text-white"
                      initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* what the machine receives */}
        <div className="mt-4 min-h-[120px]">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="paquete"
                className="flex flex-col items-center gap-2 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-lg border-[3px] border-ink bg-sun font-display text-2xl font-extrabold text-ink shadow-doodle-sm"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: [1, 0.6, 1.1, 1], y: [0, 10, -6, 0], rotate: [0, -6, 4, 0] }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                  ?
                </motion.div>
                <motion.img
                  src="/cochecito.svg"
                  alt={t('mapa.s1.sentCarAlt')}
                  className="h-12 w-[72px]"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 90, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, ease: 'easeIn' }}
                />
                <p className="font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
                  {t('mapa.s1.sentLabel')}
                </p>
              </motion.div>
            ) : kind === 'texto' ? (
              <motion.div
                key="texto"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="relative mx-auto max-w-[320px] rounded-blob-3 border-[3px] border-ink bg-white px-4 py-3 shadow-doodle-sm"
              >
                <p className="text-center font-semibold text-ink">“{question}”</p>
              </motion.div>
            ) : kind === 'voz' ? (
              <motion.div
                key="voz"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <VoiceWaves />
                <p className="min-h-[2.5rem] max-w-[320px] text-center font-mono text-[0.9rem] font-bold text-ink">
                  {typed}
                  <span className="animate-caret-blink">|</span>
                </p>
                <p className="text-[0.8rem] font-semibold text-ink-soft">{t('mapa.s1.voiceNote')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="foto"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex h-20 w-28 items-center justify-center rounded-xl border-[3px] border-ink bg-gradient-to-br from-sun/60 via-peach to-pink/40 shadow-doodle-sm">
                  <Camera className="h-8 w-8 text-ink/50" strokeWidth={2} />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {PHOTO_TAGS.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 300, damping: 16 }}
                      className="rounded-full border-2 border-ink bg-mint px-2.5 py-0.5 font-mono text-[0.78rem] font-bold shadow-doodle-sm"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
                <p className="text-[0.8rem] font-semibold text-ink-soft">{t('mapa.s1.photoNote')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={send}
        disabled={sent}
        whileHover={sent ? {} : { scale: 1.04, rotate: 1 }}
        whileTap={sent ? {} : { scale: 0.95 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 self-center rounded-full border-[3px] border-ink px-6 py-2.5 font-display font-extrabold shadow-doodle-sm transition-colors',
          sent || completed ? 'bg-teal text-white' : 'bg-coral text-white hover:bg-coral-deep',
        )}
      >
        {sent || completed ? <Check className="h-5 w-5" strokeWidth={3} /> : <Send className="h-5 w-5" strokeWidth={2.75} />}
        {sent || completed ? t('mapa.s1.sendDone') : t('mapa.s1.sendIdle')}
      </motion.button>
    </div>
  );

  return (
    <StationShell
      id="estacion-1"
      number={1}
      color="coral"
      sticker={t('mapa.s1.sticker')}
      title={
        <>
          {t('mapa.s1.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.s1.titleHighlight')}
            <SquiggleUnderline color="coral" className="absolute -bottom-1 left-0" />
          </span>
        </>
      }
      dato={t('mapa.s1.dato')}
      machineLabel={t('mapa.s1.machineLabel')}
      bgTint="#FFF6E9"
      demo={demo}
    >
      <p>
        {t('mapa.s1.p1Before')}
        <strong className="text-ink">{t('mapa.s1.p1Strong')}</strong>
        {t('mapa.s1.p1Mid')}
        <em>{t('mapa.s1.p1Em')}</em>
        {t('mapa.s1.p1Tail')}
      </p>
      <p>{t('mapa.s1.p2')}</p>
    </StationShell>
  );
}

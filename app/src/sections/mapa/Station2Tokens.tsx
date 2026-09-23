import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, RotateCcw, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import StationShell from './StationShell';
import ConfettiBurst from './ConfettiBurst';
import { tokenize, type SimToken } from './tokenizer';

const CHIP_BG = ['bg-mint', 'bg-peach', 'bg-sun', 'bg-lilac/25', 'bg-pink/30'] as const;

function DraggableChip({ token, index, revealed, onToggle }: {
  token: SimToken;
  index: number;
  revealed: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  return (
    <motion.button
      type="button"
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.12, zIndex: 30, boxShadow: '10px 10px 0 #26233F' }}
      whileHover={{ y: -6 }}
      onClick={onToggle}
      title={t('mapa.s2.chipTitle')}
      initial={{ y: -34, scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: ((index * 47) % 17) - 8,
      }}
      transition={{ delay: 0.15 + index * 0.09, type: 'spring', stiffness: 320, damping: 17 }}
      className={cn(
        'relative cursor-grab touch-none select-none rounded-lg border-2 border-ink px-2.5 py-1 font-mono text-[0.85rem] font-bold shadow-doodle-sm active:cursor-grabbing',
        CHIP_BG[index % CHIP_BG.length],
      )}
    >
      {revealed ? (
        <span className="inline-flex items-center gap-1 text-teal-deep">
          <Hash className="h-3 w-3" strokeWidth={3} />
          {token.id}
        </span>
      ) : (
        token.text
      )}
    </motion.button>
  );
}

interface Station2Props {
  question: string;
  completed: boolean;
  onComplete: () => void;
}

export default function Station2Tokens({ question, completed, onComplete }: Station2Props) {
  const { t } = useLanguage();
  const [source, setSource] = useState(question);
  const [draft, setDraft] = useState('');
  const [tokens, setTokens] = useState<SimToken[] | null>(null);
  const [cutKey, setCutKey] = useState(0);
  const [bladeDown, setBladeDown] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [confetti, setConfetti] = useState(0);
  const cutCount = useRef(0);

  const displaySource = source;

  const cut = (text: string) => {
    const clean = text.trim().slice(0, 80);
    if (!clean) return;
    setSource(clean);
    setRevealed({});
    setTokens(null);
    setBladeDown(true);
    cutCount.current += 1;
    const isFirst = cutCount.current === 1;
    window.setTimeout(() => {
      setTokens(tokenize(clean));
      setCutKey((k) => k + 1);
      setBladeDown(false);
      if (isFirst) {
        setConfetti((n) => n + 1);
        window.setTimeout(onComplete, 700);
      }
    }, 420);
  };

  const demo = (
    <div className="relative flex flex-col gap-4">
      <ConfettiBurst trigger={confetti} />

      {/* machine bar with the phrase and the blade */}
      <div className="relative overflow-hidden rounded-2xl border-[3px] border-ink bg-paper px-4 pb-4 pt-8 shadow-doodle-sm">
        {/* blade */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center"
          animate={bladeDown ? { y: [0, 26, 18, 22] } : { y: 0 }}
          transition={{ duration: 0.38, ease: 'easeIn' }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 rounded-b-xl border-x-[3px] border-b-[3px] border-ink bg-ink px-6 py-1">
            <Scissors className="h-4 w-4 text-sun" strokeWidth={2.5} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tokens === null ? (
            <motion.p
              key={`bar-${displaySource}`}
              className="text-center font-semibold text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: bladeDown ? [1, 0.4, 1] : 1 }}
              exit={{ opacity: 0, scaleY: 0.4 }}
              transition={{ duration: 0.3 }}
            >
              “{displaySource}”
            </motion.p>
          ) : (
            <motion.div
              key={`chips-${cutKey}`}
              className="flex min-h-[88px] flex-wrap items-center justify-center gap-2 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {tokens.map((t, i) => (
                <DraggableChip
                  key={`${cutKey}-${i}`}
                  token={t}
                  index={i}
                  revealed={!!revealed[i]}
                  onToggle={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* counter + main action */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {tokens !== null && (
          <motion.span
            key={`count-${cutKey}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] shadow-doodle-sm"
          >
            {tokens.length} {t('mapa.s2.tokensUnit')}
          </motion.span>
        )}
        <motion.button
          type="button"
          onClick={() => cut(source)}
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.94 }}
          className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-6 py-2.5 font-display font-extrabold text-ink shadow-doodle-sm transition-transform"
        >
          <Scissors className="h-5 w-5" strokeWidth={2.75} />
          {t('mapa.s2.cut')}
        </motion.button>
      </div>

      {/* free phrase */}
      <div className="flex flex-col gap-2 border-t-2 border-dashed border-ink/20 pt-3 sm:flex-row">
        <input
          type="text"
          value={draft}
          maxLength={80}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && draft.trim() && cut(draft)}
          placeholder={t('mapa.s2.placeholder')}
          className="min-w-0 flex-1 rounded-xl border-[3px] border-ink bg-paper px-3 py-2 text-[0.9rem] font-semibold outline-none placeholder:text-ink/40 focus:shadow-doodle-sm"
        />
        <motion.button
          type="button"
          onClick={() => cut(draft)}
          disabled={!draft.trim()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-white px-4 py-2 font-display text-[0.9rem] font-extrabold text-ink shadow-doodle-sm disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.75} />
          {t('mapa.s2.cutOther')}
        </motion.button>
      </div>
      <p className="text-center text-[0.78rem] font-semibold text-ink-soft">
        {t('mapa.s2.hint')}
      </p>
      {completed && (
        <p className="text-center font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal-deep">
          {t('mapa.s2.stampDone')}
        </p>
      )}
    </div>
  );

  return (
    <StationShell
      id="estacion-2"
      number={2}
      color="sun"
      sticker={t('mapa.s2.sticker')}
      title={
        <>
          {t('mapa.s2.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.s2.titleHighlight')}
            <SquiggleUnderline color="sun" className="absolute -bottom-1 left-0" />
          </span>
        </>
      }
      dato={t('mapa.s2.dato')}
      machineLabel={t('mapa.s2.machineLabel')}
      bgTint="#FDF3DF"
      demo={demo}
    >
      <p>
        {t('mapa.s2.p1Before')}
        <strong className="text-ink">{t('mapa.s2.p1Strong')}</strong>
        {t('mapa.s2.p1After')}
      </p>
      <p>{t('mapa.s2.p2')}</p>
    </StationShell>
  );
}

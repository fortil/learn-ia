import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sticker, SpeechBubble, SquiggleUnderline } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';

interface MapaHeaderProps {
  question: string;
  onQuestionChange: (q: string) => void;
}

/** Page header + question selector card ("carga tu pregunta en el cochecito"). */
export default function MapaHeader({ question, onQuestionChange }: MapaHeaderProps) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(question);
  const [loaded, setLoaded] = useState(0);

  const suggestions = [t('mapa.header.s1'), t('mapa.header.s2'), t('mapa.header.s3')];

  const confirm = (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    setDraft(clean);
    onQuestionChange(clean);
    setLoaded((n) => n + 1);
  };

  return (
    <header className="notebook-dots relative overflow-hidden border-b-[3px] border-ink/10 bg-paper px-4 pb-16 pt-14 md:pt-20">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <Sticker color="coral" rotate={-3} pop>
          {t('mapa.header.sticker')}
        </Sticker>
        <h1 className="text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.05] text-ink">
          {t('mapa.header.titleBefore')}
          <span className="relative inline-block">
            {t('mapa.header.titleHighlight')}
            <SquiggleUnderline color="coral" className="absolute -bottom-1 left-0" />
          </span>
        </h1>
        <p className="max-w-xl text-xl font-bold text-ink-soft">
          {t('mapa.header.subtitle')}
        </p>

        {/* question selector */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: 'easeOut' }}
          className="relative mt-4 w-full rounded-blob-2 border-[3px] border-ink bg-white p-5 text-left shadow-doodle md:p-6"
        >
          <p className="mb-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] text-coral-deep">
            {t('mapa.header.selectorLabel')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={draft}
              maxLength={80}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirm(draft)}
              placeholder={t('mapa.header.placeholder')}
              className="min-w-0 flex-1 rounded-xl border-[3px] border-ink bg-paper px-4 py-2.5 font-semibold text-ink outline-none transition-shadow placeholder:text-ink/40 focus:shadow-doodle-sm"
            />
            <motion.button
              type="button"
              onClick={() => confirm(draft)}
              whileHover={{ scale: 1.04, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-coral px-5 py-2.5 font-display font-extrabold text-white shadow-doodle-sm transition-colors hover:bg-coral-deep"
            >
              <Send className="h-4 w-4" strokeWidth={2.75} />
              {t('mapa.header.load')}
            </motion.button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                type="button"
                onClick={() => confirm(s)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'rounded-full border-2 border-ink px-3 py-1 font-mono text-[0.78rem] font-bold shadow-doodle-sm transition-colors',
                  question === s ? 'bg-sun text-ink' : 'bg-paper-deep text-ink hover:bg-sun/60',
                  i % 2 === 0 ? '-rotate-1' : 'rotate-1',
                )}
              >
                {s}
              </motion.button>
            ))}
          </div>

          {/* packet loading animation into the little car */}
          <div className="mt-5 flex items-center gap-4 border-t-2 border-dashed border-ink/20 pt-4">
            <div className="relative h-12 w-20 shrink-0">
              <img src="/cochecito.svg" alt={t('mapa.header.carAlt')} className="absolute bottom-0 left-0 h-12 w-[72px]" />
              <AnimatePresence>
                {loaded > 0 && (
                  <motion.div
                    key={loaded}
                    className="absolute left-5 top-0 flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink bg-sun font-display text-sm font-extrabold text-ink shadow-doodle-sm"
                    initial={{ y: -46, scale: 0.4, opacity: 0, rotate: -14 }}
                    animate={{ y: 0, scale: [0.4, 1.15, 1], opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  >
                    ?
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-[0.9rem] font-semibold leading-snug text-ink-soft">
              <AnimatePresence mode="wait">
                <motion.span
                  key={question}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4 text-teal-deep" strokeWidth={3} />
                  {t('mapa.header.loadedPrefix')}“{question}”
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
        </motion.div>

        <SpeechBubble mascot="preguntin" tail="bottom-left" delay={0.35}>
          {t('mapa.header.bubble')}
        </SpeechBubble>
      </div>
    </header>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

const TYPE_MS = 60;
const ERASE_MS = 25;
const PAUSE_MS = 1600;

/** Rotating everyday questions typed and erased, Space Mono, with a flying packet. */
export default function TypewriterCard() {
  const { t } = useLanguage();
  const questions = useMemo(
    () => [
      t('home.hero.typewriter.q1'),
      t('home.hero.typewriter.q2'),
      t('home.hero.typewriter.q3'),
    ],
    [t],
  );
  const [text, setText] = useState('');
  const [sent, setSent] = useState(0);

  useEffect(() => {
    let q = 0;
    let i = 0;
    let phase: 'typing' | 'pausing' | 'erasing' = 'typing';
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const current = questions[q];
      if (phase === 'typing') {
        i += 1;
        setText(current.slice(0, i));
        if (i >= current.length) {
          phase = 'pausing';
          setSent((s) => s + 1);
          timer = setTimeout(step, PAUSE_MS);
        } else {
          timer = setTimeout(step, TYPE_MS);
        }
      } else if (phase === 'pausing') {
        phase = 'erasing';
        timer = setTimeout(step, ERASE_MS);
      } else {
        i -= 1;
        setText(current.slice(0, i));
        if (i <= 0) {
          q = (q + 1) % questions.length;
          phase = 'typing';
          timer = setTimeout(step, 350);
        } else {
          timer = setTimeout(step, ERASE_MS);
        }
      }
    };
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, [questions]);

  return (
    <div className="doodle-card relative max-w-md px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint">
          <MessageCircle className="h-5 w-5 text-ink" strokeWidth={2.5} />
        </span>
        <p className="min-h-[1.6em] font-mono text-[0.95rem] font-bold text-ink">
          {text}
          <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-caret-blink bg-coral" />
        </p>
      </div>
      {/* little packet flying off towards the illustration */}
      <AnimatePresence>
        {sent > 0 && (
          <motion.span
            key={sent}
            className="absolute right-4 top-1/2 text-coral"
            initial={{ x: 0, y: '-50%', opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: 90, y: -90, opacity: 0, rotate: 25, scale: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeIn' }}
          >
            <Send className="h-5 w-5" strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

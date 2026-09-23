import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Map, RotateCcw, Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveColor } from '@/components/doodle/colors';
import { useLanguage } from '@/i18n/useLanguage';
import ConfettiBurst from './ConfettiBurst';
import type { QuizQuestion } from './quizData';

function titleFor(score: number, total: number, t: (key: string) => string): string {
  if (score === total) return t('quiz.result.titlePerfect');
  if (score >= 3) return t('quiz.result.titleGood');
  return t('quiz.result.titleLow');
}

interface QuizResultProps {
  /** questions in the order they were played */
  questions: QuizQuestion[];
  /** questionId -> chosen option index */
  answers: Record<number, number>;
  score: number;
  onRestart: () => void;
}

/** Result screen: badge celebration, answer review accordions, CTAs. */
export default function QuizResult({ questions, answers, score, onRestart }: QuizResultProps) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const share = async () => {
    const text = `${t('quiz.result.shareTextBefore')}${score}/${questions.length}${t('quiz.result.shareTextAfter')}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-peach px-4 py-20 md:py-28">
      <ConfettiBurst count={30} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.img
          src="/quiz-badge.png"
          alt={t('quiz.result.badgeAlt')}
          className="h-44 w-44 md:h-56 md:w-56"
          initial={{ rotate: -360, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
        />
        <motion.img
          src="/preguntin-fiesta.svg"
          alt=""
          className="-mt-4 h-20 w-20 md:h-24 md:w-24"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 16 }}
        />

        <motion.h1
          className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.08] text-ink"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.55, ease: 'easeOut' }}
        >
          {titleFor(score, questions.length, t)}
        </motion.h1>
        <motion.p
          className="mt-3 max-w-lg text-lg font-semibold text-ink-soft"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        >
          {t('quiz.result.scoreBefore')}{score}{t('quiz.result.scoreOf')}{questions.length}{t('quiz.result.scoreAfter')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5, ease: 'easeOut' }}
        >
          <motion.button
            type="button"
            onClick={onRestart}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-coral px-7 py-3.5 font-display text-lg font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2.75} />
            {t('quiz.result.restart')}
          </motion.button>
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-white px-7 py-3.5 font-display text-lg font-extrabold text-ink shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
          >
            <Map className="h-5 w-5" strokeWidth={2.75} />
            {t('quiz.result.revisitMap')}
          </Link>
          <span className="relative">
            <motion.button
              type="button"
              onClick={share}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-sun px-7 py-3.5 font-display text-lg font-extrabold text-ink shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
            >
              <Share2 className="h-5 w-5" strokeWidth={2.75} />
              {t('quiz.result.share')}
            </motion.button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ y: 8, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-[3px] border-ink bg-ink px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-paper shadow-doodle-sm"
                >
                  {t('quiz.result.copied')}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.div>

        {/* answer review */}
        <div className="mt-14 w-full text-left">
          <h2 className="mb-5 text-center font-display text-2xl font-extrabold text-ink md:text-3xl">
            {t('quiz.review.title')}
          </h2>
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const chosen = answers[q.id];
              const good = chosen === q.correct;
              const open = openId === q.id;
              return (
                <motion.div
                  key={q.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                  className="doodle-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : q.id)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] text-white',
                        good ? 'border-teal-deep bg-teal' : 'border-coral-deep bg-coral',
                      )}
                    >
                      {good ? (
                        <Check className="h-5 w-5" strokeWidth={3.5} />
                      ) : (
                        <X className="h-5 w-5" strokeWidth={3.5} />
                      )}
                    </span>
                    <span className="flex-1 font-display text-base font-bold leading-snug text-ink md:text-lg">
                      {q.question}
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink"
                      style={{ backgroundColor: resolveColor(q.color) }}
                      aria-hidden="true"
                    />
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-ink-soft"
                    >
                      <ChevronDown className="h-5 w-5" strokeWidth={2.75} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 border-t-[3px] border-dashed border-ink/30 px-5 py-4">
                          <p className="flex items-start gap-2 text-[0.95rem] font-semibold text-ink">
                            {good ? (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" strokeWidth={3.5} />
                            ) : (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-coral-deep" strokeWidth={3.5} />
                            )}
                            <span>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                                {t('quiz.review.yourAnswer')}{' '}
                              </span>
                              {chosen !== undefined ? q.options[chosen] : '—'}
                            </span>
                          </p>
                          {!good && (
                            <p className="flex items-start gap-2 text-[0.95rem] font-semibold text-ink">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" strokeWidth={3.5} />
                              <span>
                                <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                                  {t('quiz.review.correctAnswer')}{' '}
                                </span>
                                {q.options[q.correct]}
                              </span>
                            </p>
                          )}
                          <p className="text-[0.95rem] font-semibold text-ink-soft">{q.why}</p>
                          <Link
                            to={q.ref.to}
                            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-coral-deep underline decoration-wavy underline-offset-4 hover:text-coral"
                          >
                            {t('quiz.review.reviewAt')} {q.ref.label}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

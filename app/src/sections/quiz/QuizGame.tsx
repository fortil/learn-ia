import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Award, Check, Lightbulb, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveColor } from '@/components/doodle/colors';
import { useLanguage } from '@/i18n/useLanguage';
import { LETTERS } from './quizData';
import type { QuizQuestion } from './quizData';

interface QuizGameProps {
  /** questions in play order (shuffled per run) */
  questions: QuizQuestion[];
  current: number;
  /** questionId -> chosen option index */
  answers: Record<number, number>;
  onAnswer: (questionId: number, optionIndex: number) => void;
  onNext: () => void;
}

/** Quiz play state: segmented progress, question card, instant feedback. */
export default function QuizGame({ questions, current, answers, onAnswer, onNext }: QuizGameProps) {
  const { t } = useLanguage();
  const q = questions[current];
  const selected = answers[q.id];
  const answered = selected !== undefined;
  const isLast = current === questions.length - 1;

  return (
    <section className="notebook-lines bg-paper px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[720px]">
        {/* progress header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
            <span>
              {t('quiz.game.questionWord')} {current + 1} {t('quiz.game.of')} {questions.length}
            </span>
            <span style={{ color: resolveColor(q.color) }}>{q.ref.label}</span>
          </div>
          <div className="flex gap-1.5">
            {questions.map((sq, i) => {
              const filled = i < current || (i === current && answered);
              return (
                <div
                  key={sq.id}
                  className="h-4 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-doodle-sm"
                >
                  <motion.div
                    className="h-full w-full origin-left"
                    style={{ backgroundColor: resolveColor(sq.color) }}
                    initial={false}
                    animate={{ scaleX: filled ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* question card with slide-rotate transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ x: 120, opacity: 0, rotate: 4 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -120, opacity: 0, rotate: -4 }}
            transition={{
              x: { type: 'spring', stiffness: 260, damping: 26 },
              opacity: { duration: 0.3 },
              rotate: { type: 'spring', stiffness: 260, damping: 26 },
            }}
          >
            <div className="doodle-card p-6 md:p-8">
              <h2 className="font-display text-[1.45rem] font-extrabold leading-snug text-ink md:text-[1.65rem]">
                {q.question}
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {q.options.map((option, oi) => {
                  const isCorrect = oi === q.correct;
                  const isChosen = oi === selected;
                  const showCorrect = answered && isCorrect;
                  const showWrong = answered && isChosen && !isCorrect;
                  return (
                    <motion.button
                      key={oi}
                      type="button"
                      disabled={answered}
                      onClick={() => onAnswer(q.id, oi)}
                      whileHover={!answered ? { scale: 1.02, rotate: oi % 2 === 0 ? -0.5 : 0.5 } : undefined}
                      whileTap={!answered ? { scale: 0.97 } : undefined}
                      animate={showWrong ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
                      transition={showWrong ? { duration: 0.3 } : { duration: 0.2 }}
                      className={cn(
                        'relative flex items-center gap-3 rounded-blob-3 border-[3px] border-ink px-4 py-3.5 text-left font-semibold shadow-doodle-sm transition-colors',
                        showCorrect && 'bg-mint text-ink',
                        showWrong && 'bg-peach text-ink',
                        answered && !showCorrect && !showWrong && 'bg-white text-ink-soft opacity-60',
                        !answered && 'bg-white text-ink hover:bg-paper-deep',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink font-mono text-sm font-bold',
                          showCorrect ? 'bg-teal text-white' : showWrong ? 'bg-coral text-white' : 'bg-paper text-ink',
                        )}
                      >
                        {LETTERS[oi]}
                      </span>
                      <span className="flex-1 text-[0.98rem] leading-snug">{option}</span>
                      {showCorrect && (
                        <motion.span
                          initial={{ scale: 2.5, opacity: 0, rotate: -10 }}
                          animate={{ scale: 1, opacity: 1, rotate: -10 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 15 }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-teal-deep bg-white text-teal-deep"
                        >
                          <Check className="h-5 w-5" strokeWidth={3.5} />
                        </motion.span>
                      )}
                      {showWrong && (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-coral-deep bg-white text-coral-deep">
                          <X className="h-5 w-5" strokeWidth={3.5} />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* instant educational feedback */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
                      className="mt-5 rounded-blob-3 border-[3px] border-ink bg-sun/25 px-5 py-4"
                    >
                      <p className="flex items-start gap-2.5 text-[0.98rem] font-semibold leading-relaxed text-ink">
                        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-sun" strokeWidth={2.75} fill="#FFC53D" />
                        <span>
                          <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                            {t('quiz.game.why')}{' '}
                          </span>
                          {q.why}
                        </span>
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 pl-[30px] font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.75} />
                        {t('quiz.game.seenAt')}{' '}
                        <Link to={q.ref.to} className="text-coral-deep underline decoration-wavy underline-offset-4 hover:text-coral">
                          {q.ref.label}
                        </Link>
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* next button appears with the feedback */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  className="mt-6 flex justify-end"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <motion.button
                    type="button"
                    onClick={onNext}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-coral px-7 py-3.5 font-display text-lg font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
                  >
                    {isLast ? (
                      <>
                        {t('quiz.game.seeBadge')}
                        <Award className="h-5 w-5" strokeWidth={2.75} />
                      </>
                    ) : (
                      <>
                        {t('quiz.game.next')}
                        <ArrowRight className="h-5 w-5" strokeWidth={3} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

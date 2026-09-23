import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox, Mail, ShieldCheck, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CaseShell from './CaseShell';
import { useLanguage } from '@/i18n/useLanguage';

type Verdict = 'inbox' | 'spam';

interface Envelope {
  id: number;
  subject: string;
  from: string;
  truth: Verdict;
  suspicion: number;
  reasons: string[];
}

export default function SpamCase() {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, Verdict>>({});
  const [revealed, setRevealed] = useState(false);

  const ENVELOPES: Envelope[] = [
    {
      id: 1,
      subject: t('ejemplos.spam.e1Subject'),
      from: t('ejemplos.spam.e1From'),
      truth: 'spam',
      suspicion: 99,
      reasons: [t('ejemplos.spam.e1R1'), t('ejemplos.spam.e1R2'), t('ejemplos.spam.e1R3')],
    },
    {
      id: 2,
      subject: t('ejemplos.spam.e2Subject'),
      from: t('ejemplos.spam.e2From'),
      truth: 'inbox',
      suspicion: 4,
      reasons: [t('ejemplos.spam.e2R1'), t('ejemplos.spam.e2R2')],
    },
    {
      id: 3,
      subject: t('ejemplos.spam.e3Subject'),
      from: t('ejemplos.spam.e3From'),
      truth: 'spam',
      suspicion: 97,
      reasons: [t('ejemplos.spam.e3R1'), t('ejemplos.spam.e3R2'), t('ejemplos.spam.e3R3')],
    },
    {
      id: 4,
      subject: t('ejemplos.spam.e4Subject'),
      from: t('ejemplos.spam.e4From'),
      truth: 'inbox',
      suspicion: 6,
      reasons: [t('ejemplos.spam.e4R1'), t('ejemplos.spam.e4R2')],
    },
    {
      id: 5,
      subject: t('ejemplos.spam.e5Subject'),
      from: t('ejemplos.spam.e5From'),
      truth: 'spam',
      suspicion: 91,
      reasons: [t('ejemplos.spam.e5R1'), t('ejemplos.spam.e5R2')],
    },
  ];

  const answeredAll = Object.keys(answers).length === ENVELOPES.length;
  const userScore = ENVELOPES.filter((e) => answers[e.id] === e.truth).length;

  return (
    <CaseShell
      caseNumber={2}
      color="sun"
      icon={Mail}
      timeSticker={t('ejemplos.spam.time')}
      title={t('ejemplos.spam.title')}
      text={t('ejemplos.spam.text')}
      image="/ejemplo-spam.png"
      imageAlt={t('ejemplos.spam.imageAlt')}
      reverse
      bg="bg-paper-deep"
      stops={[
        t('ejemplos.spam.stop1'),
        t('ejemplos.spam.stop2'),
        t('ejemplos.spam.stop3'),
        t('ejemplos.spam.stop4'),
        t('ejemplos.spam.stop5'),
      ]}
    >
      <div className="doodle-card p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
            <ShieldCheck className="h-5 w-5 text-sun" strokeWidth={2.75} />
            {t('ejemplos.spam.gameTitle')}
          </h4>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
            {t('ejemplos.spam.gameCounter')}
          </span>
        </div>

        <div className="space-y-3">
          {ENVELOPES.map((e, i) => {
            const answer = answers[e.id];
            return (
              <motion.div
                key={e.id}
                className={cn(
                  'rounded-xl border-[3px] border-ink bg-white p-4 shadow-doodle-sm',
                  revealed &&
                    (answer === e.truth ? 'ring-4 ring-teal/50' : 'ring-4 ring-coral/50'),
                )}
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-extrabold text-ink">
                      {e.subject}
                    </p>
                    <p className="truncate font-mono text-xs text-ink-soft">{e.from}</p>
                  </div>
                  {!revealed ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [e.id]: 'inbox' }))}
                        aria-pressed={answer === 'inbox'}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                          answer === 'inbox' ? 'bg-teal text-white' : 'bg-mint text-ink',
                        )}
                      >
                        <Inbox className="h-3.5 w-3.5" strokeWidth={2.75} />
                        {t('ejemplos.spam.inbox')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [e.id]: 'spam' }))}
                        aria-pressed={answer === 'spam'}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                          answer === 'spam' ? 'bg-coral text-white' : 'bg-peach text-ink',
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.75} />
                        {t('ejemplos.spam.spamBtn')}
                      </button>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        'rounded-full border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase',
                        answer === e.truth ? 'bg-teal text-white' : 'bg-coral text-white',
                      )}
                    >
                      {answer === e.truth
                        ? t('ejemplos.spam.correct')
                        : t(e.truth === 'spam' ? 'ejemplos.spam.wasSpam' : 'ejemplos.spam.wasGood')}
                    </span>
                  )}
                </div>

                {/* AI verdict */}
                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold uppercase text-ink-soft">
                          {t('ejemplos.spam.suspicion')}
                        </span>
                        <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper-deep">
                          <motion.div
                            className={cn('h-full', e.suspicion > 50 ? 'bg-coral' : 'bg-teal')}
                            initial={{ width: 0 }}
                            animate={{ width: `${e.suspicion}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs font-bold text-ink">
                          {e.suspicion}%
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {e.reasons.map((r, j) => (
                          <motion.span
                            key={r}
                            className="rounded-full border-2 border-ink bg-sun/50 px-2.5 py-0.5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 + j * 0.07, type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            {r}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            disabled={!answeredAll || revealed}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-6 py-3 font-display text-base font-extrabold shadow-doodle transition-all',
              answeredAll && !revealed
                ? 'bg-sun text-ink hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed'
                : 'cursor-not-allowed bg-paper-deep text-ink-soft',
            )}
          >
            <ShieldCheck className="h-5 w-5" strokeWidth={2.75} />
            {t('ejemplos.spam.verdict')}
          </button>
          {revealed && (
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setRevealed(false);
              }}
              className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              {t('ejemplos.spam.playAgain')}
            </button>
          )}
          <AnimatePresence>
            {revealed && (
              <motion.span
                className="rounded-full border-[3px] border-ink bg-white px-4 py-2 font-display text-base font-extrabold text-ink shadow-doodle-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.9 }}
              >
                {t('ejemplos.spam.scoreYou')} {userScore}/5 · {t('ejemplos.spam.scoreAi')} 5/5 {t('ejemplos.spam.scoreTail')}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CaseShell>
  );
}

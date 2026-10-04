import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

/** Static hero: no confetti, no video. Loads fast; the first video arrives
 *  with the anecdota below. */
export default function FomoHero() {
  const { t, language } = useLanguage();
  const chips = [1, 2, 3, 4, 5].map((n) => ({
    n,
    label: t(`fomo.hero.chip${n}`),
    to: `#habito-${n}`,
  }));
  const otherLang = language === 'es' ? 'en' : 'es';

  return (
    <section className="relative overflow-hidden bg-peach/40 px-4 pb-16 pt-24 text-center md:pb-20 md:pt-28">
      <img
        src="/preguntin.svg"
        alt=""
        className="pointer-events-none absolute right-6 top-24 hidden h-20 w-20 -rotate-6 opacity-90 md:block"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
        <Sticker color="coral" rotate={-3} pop>
          {t('fomo.hero.sticker')}
        </Sticker>
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.05] text-ink">
          {t('fomo.hero.title').split(' ').map((word, i, all) => (
            /* the separating space lives in the h1 flow, not inside the
               inline-block span (a trailing space there collapses) */
            <span key={i}>
              <span className="inline-block">
                {word === 'FOMO' ? (
                  <span className="relative inline-block">
                    {word}
                    <SquiggleUnderline
                      color="coral"
                      strokeWidth={6}
                      className="absolute -bottom-1 left-0"
                      delay={0.6}
                    />
                  </span>
                ) : (
                  word
                )}
              </span>
              {i < all.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
        <motion.p
          className="max-w-xl text-xl font-bold leading-relaxed text-ink-soft"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
        >
          {t('fomo.hero.lead')}
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        >
          {chips.map((c, i) => (
            <Link
              key={c.n}
              to={c.to}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink px-3.5 py-1.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.06em] shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                CHIP_CLASSES[i % CHIP_CLASSES.length],
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-ink bg-white text-[0.65rem] text-ink">
                {c.n}
              </span>
              {c.label}
            </Link>
          ))}
        </motion.div>
        {/* always-visible language switch: ?lang links are shared from
            LinkedIn/X (en) and TikTok (es) */}
        <a
          href={`/fomo?lang=${otherLang}`}
          className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-coral-deep underline decoration-wavy underline-offset-4 hover:text-coral"
        >
          {t('fomo.hero.langLink')}
        </a>
      </div>
    </section>
  );
}

const CHIP_CLASSES = [
  'bg-coral text-white',
  'bg-teal text-white',
  'bg-sun text-ink',
  'bg-lilac text-white',
  'bg-pink text-ink',
];

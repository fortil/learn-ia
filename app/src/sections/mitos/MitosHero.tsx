import { motion } from 'framer-motion';
import Sticker from '@/components/doodle/Sticker';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import { useLanguage } from '@/i18n/useLanguage';
import FallingConfetti from './FallingConfetti';

export default function MitosHero() {
  const { t } = useLanguage();
  const titleWords = t('mitos.hero.title').split(' ');
  const underlineWord = t('mitos.hero.underlineWord');
  return (
    <section className="relative overflow-hidden bg-pink/15 px-4 pb-20 pt-24 text-center md:pb-28 md:pt-32">
      {/* static doodle confetti backdrop */}
      <svg
        viewBox="0 0 1200 500"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx="120" cy="90" r="9" fill="#FF6B4A" />
        <rect x="1020" y="70" width="16" height="16" rx="3" fill="#FFC53D" transform="rotate(18 1028 78)" />
        <path d="M250 400 l14 24 h-28 z" fill="#14B8A6" />
        <circle cx="1080" cy="360" r="8" fill="#8B5CF6" />
        <rect x="180" y="220" width="13" height="13" rx="3" fill="#F472B6" transform="rotate(-14 186 226)" />
        <path d="M880 430 l12 20 h-24 z" fill="#FF6B4A" />
        <circle cx="620" cy="60" r="7" fill="#14B8A6" />
        <rect x="720" y="450" width="12" height="12" rx="3" fill="#8B5CF6" transform="rotate(22 726 456)" />
      </svg>

      {/* one-shot confetti rain on load */}
      <FallingConfetti count={20} fall={640} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
        <Sticker color="pink" rotate={-3} pop>
          {t('mitos.hero.sticker')}
        </Sticker>
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.05] text-ink">
          {titleWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.55, ease: 'easeOut' }}
              >
                {word === underlineWord ? (
                  <span className="relative inline-block">
                    {word}
                    <SquiggleUnderline
                      color="pink"
                      strokeWidth={6}
                      className="absolute -bottom-0.5 left-0"
                      delay={0.6}
                    />
                  </span>
                ) : (
                  word
                )}
                {i < titleWords.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="max-w-xl text-xl font-bold text-ink-soft"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.55, ease: 'easeOut' }}
        >
          {t('mitos.hero.subtitle')}
        </motion.p>
      </div>
    </section>
  );
}

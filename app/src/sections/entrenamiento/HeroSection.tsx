import { motion } from 'framer-motion';
import Sticker from '@/components/doodle/Sticker';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import { useLanguage } from '@/i18n/useLanguage';

const wordAnim = (i: number) => ({
  initial: { y: 50, rotate: 4, opacity: 0 },
  animate: { y: 0, rotate: 0, opacity: 1 },
  transition: {
    delay: 0.15 + i * 0.06,
    type: 'spring' as const,
    stiffness: 260,
    damping: 16,
  },
});

export default function HeroSection() {
  const { t } = useLanguage();
  const wordsBefore = t('entrenar.hero.titleBefore').split(' ');
  const wordsAfter = t('entrenar.hero.titleAfter').split(' ');

  return (
    <section className="notebook-dots relative overflow-hidden bg-paper px-4 py-20 text-center md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 320, damping: 15 }}
        >
          <Sticker color="lilac" rotate={-3}>
            {t('entrenar.hero.sticker')}
          </Sticker>
        </motion.div>

        <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.05] text-ink">
          {wordsBefore.map((w, i) => (
            <motion.span key={w + i} className="inline-block" {...wordAnim(i)}>
              {w}
              {'\u00A0'}
            </motion.span>
          ))}
          <motion.span
            className="inline-block font-mono text-[0.7em] text-coral"
            {...wordAnim(wordsBefore.length)}
          >
            ≠{'\u00A0'}
          </motion.span>
          {wordsAfter.map((w, i) => (
            <motion.span
              key={w + i}
              className="inline-block"
              {...wordAnim(wordsBefore.length + 1 + i)}
            >
              {i === 1 ? (
                <span className="relative inline-block">
                  {w}
                  <SquiggleUnderline color="coral" className="absolute -bottom-1 left-0" />
                  {'\u00A0'}
                </span>
              ) : (
                `${w}\u00A0`
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="max-w-2xl text-xl font-bold leading-relaxed text-ink-soft"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        >
          {t('entrenar.hero.sub1Before')}
          <span className="marker-highlight font-extrabold text-ink">{t('entrenar.hero.sub1Strong1')}</span>
          {t('entrenar.hero.sub1Middle')}
          <span className="marker-highlight font-extrabold text-ink">{t('entrenar.hero.sub1Strong2')}</span>
          {t('entrenar.hero.sub1After')}
        </motion.p>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

const wordAnim = (i: number) => ({
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay: 0.1 + i * 0.05, duration: 0.6, ease: 'easeOut' as const },
});

export default function HeroSection() {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(numRef, { once: true, margin: '-20% 0px' });

  const wordsBefore = t('ejemplos.hero.titleBefore').split(' ');
  const wordsAfter = t('ejemplos.hero.titleAfter').split(' ');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, 30, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView]);

  return (
    <section className="notebook-dots relative overflow-hidden bg-paper px-4 py-20 text-center md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 320, damping: 15 }}
        >
          <Sticker color="teal" rotate={3}>
            {t('ejemplos.hero.sticker')}
          </Sticker>
        </motion.div>

        <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.08] text-ink">
          {wordsBefore.map((w, i) => (
            <motion.span key={w} className="inline-block" {...wordAnim(i)}>
              {w}
              {'\u00A0'}
            </motion.span>
          ))}
          <motion.span
            ref={numRef}
            className="marker-highlight inline-block font-mono text-[1.1em] text-ink"
            {...wordAnim(wordsBefore.length)}
          >
            {count}
          </motion.span>
          {'\u00A0'}
          {wordsAfter.map((w, i) => (
            <motion.span key={w} className="inline-block" {...wordAnim(wordsBefore.length + 1 + i)}>
              {w}
              {'\u00A0'}
            </motion.span>
          ))}
          <motion.span
            className="inline-block text-[0.6em] font-bold text-ink-soft"
            {...wordAnim(wordsBefore.length + wordsAfter.length + 1)}
          >
            {t('ejemplos.hero.titleSuffix')}
          </motion.span>
        </h1>

        <motion.p
          className="max-w-2xl text-xl font-bold leading-relaxed text-ink-soft"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
          {t('ejemplos.hero.subtitleBefore')}
          <span className="text-coral">{t('ejemplos.hero.subtitleStrong')}</span>
          {t('ejemplos.hero.subtitleAfter')}
        </motion.p>
      </div>
    </section>
  );
}

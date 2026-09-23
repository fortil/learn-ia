import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import SpeechBubble from '@/components/doodle/SpeechBubble';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

interface GlowWordProps {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: ReactNode;
}

/** Single word whose opacity is scrubbed by scroll (0.15 → 1). */
function GlowWord({ progress, index, total, children }: GlowWordProps) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** Hand-drawn strike-through that draws itself over "no piensa". */
function StrikeThrough({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30% 0px' });
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-[0.28em] w-full -translate-y-1/2 overflow-visible"
      >
        <motion.path
          d="M2 8 C 22 4, 40 11, 62 7 S 102 4, 118 8"
          fill="none"
          stroke="#FF6B4A"
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        />
      </svg>
    </span>
  );
}

export default function GoldenIdea() {
  const { t } = useLanguage();
  const words = t('mitos.golden.phrase').split(' ');
  const strikeA = t('mitos.golden.strikeA');
  const strikeB = t('mitos.golden.strikeB');
  const highlight = t('mitos.golden.highlight');
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: phraseRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          className="rounded-blob border-[3px] border-sun bg-ink px-6 py-12 text-center md:px-14 md:py-16"
          style={{ boxShadow: '6px 6px 0 #FFC53D' }}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Sticker color="sun" rotate={-2} pop>
            {t('mitos.golden.sticker')}
          </Sticker>
          <h2 className="mt-6 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold text-paper/80">
            {t('mitos.golden.heading')}
          </h2>
          <p
            ref={phraseRef}
            className="mt-6 font-display text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold leading-[1.2] text-paper"
          >
            {words.map((word, i) => {
              const space = i < words.length - 1 ? ' ' : '';
              if (word === strikeA || word === strikeB) {
                return (
                  <GlowWord key={i} progress={scrollYProgress} index={i} total={words.length}>
                    <StrikeThrough>{word}</StrikeThrough>
                    {space}
                  </GlowWord>
                );
              }
              if (word === highlight) {
                return (
                  <GlowWord key={i} progress={scrollYProgress} index={i} total={words.length}>
                    <span className="marker-highlight text-ink">{word}</span>
                    {space}
                  </GlowWord>
                );
              }
              return (
                <GlowWord key={i} progress={scrollYProgress} index={i} total={words.length}>
                  {word}
                  {space}
                </GlowWord>
              );
            })}
          </p>
          <div className="mt-10 flex justify-center">
            <SpeechBubble mascot="preguntin" tail="bottom-left" delay={0.15}>
              {t('mitos.golden.bubble')}
            </SpeechBubble>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

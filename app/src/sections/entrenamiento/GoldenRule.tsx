import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import SpeechBubble from '@/components/doodle/SpeechBubble';
import { useLanguage } from '@/i18n/useLanguage';

interface WordSpec {
  text: string;
  highlight?: 'sun' | 'teal';
}

function LitWord({
  spec,
  index,
  total,
  progress,
}: {
  spec: WordSpec;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const color =
    spec.highlight === 'sun' ? 'text-sun' : spec.highlight === 'teal' ? 'text-teal' : 'text-paper';
  return (
    <motion.span style={{ opacity }} className={`inline-block ${color}`}>
      {spec.text}
      {'\u00A0'}
    </motion.span>
  );
}

export default function GoldenRule() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  });

  const SENTENCE: WordSpec[] = [
    ...t('entrenar.rule.part1Plain').split(' ').map((text) => ({ text })),
    ...t('entrenar.rule.part1Highlight')
      .split(' ')
      .map((text) => ({ text, highlight: 'sun' as const })),
    ...t('entrenar.rule.part2Plain').split(' ').map((text) => ({ text })),
    ...t('entrenar.rule.part2Highlight')
      .split(' ')
      .map((text) => ({ text, highlight: 'teal' as const })),
  ];

  return (
    <section className="border-y-[3px] border-ink bg-ink py-24 text-paper md:py-32">
      <div ref={ref} className="mx-auto flex max-w-4xl flex-col items-center gap-12 px-4 text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
          {t('entrenar.rule.label')}
        </span>
        <p className="font-display text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold leading-[1.25]">
          {SENTENCE.map((spec, i) => (
            <LitWord
              key={i}
              spec={spec}
              index={i}
              total={SENTENCE.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
        <SpeechBubble mascot="preguntin" tail="bottom-left" delay={0.1}>
          {t('entrenar.rule.bubbleBefore')}
          <strong>{t('entrenar.rule.bubbleStrong')}</strong>
          {t('entrenar.rule.bubbleAfter')}
        </SpeechBubble>
      </div>
    </section>
  );
}

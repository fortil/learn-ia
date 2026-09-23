import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChefHat, GraduationCap, Snowflake, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/doodle/SectionHeading';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

type Kind = 'train' | 'infer' | 'freeze';

interface Milestone {
  when: string;
  text: string;
  kind: Kind;
  sticker?: string;
}

export default function Timeline() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.6'],
  });
  const hScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const vScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const MILESTONES: Milestone[] = [
    {
      when: t('entrenar.timeline.m1When'),
      text: t('entrenar.timeline.m1Text'),
      kind: 'train',
    },
    {
      when: t('entrenar.timeline.m2When'),
      text: t('entrenar.timeline.m2Text'),
      kind: 'freeze',
      sticker: t('entrenar.timeline.m2Sticker'),
    },
    {
      when: t('entrenar.timeline.m3When'),
      text: t('entrenar.timeline.m3Text'),
      kind: 'infer',
    },
    {
      when: t('entrenar.timeline.m4When'),
      text: t('entrenar.timeline.m4Text'),
      kind: 'infer',
    },
    {
      when: t('entrenar.timeline.m5When'),
      text: t('entrenar.timeline.m5Text'),
      kind: 'train',
    },
  ];

  const KIND_STYLE: Record<Kind, { chip: string; icon: typeof GraduationCap; label: string }> = {
    train: { chip: 'bg-lilac text-white', icon: GraduationCap, label: t('entrenar.timeline.kindTrain') },
    infer: { chip: 'bg-coral text-white', icon: ChefHat, label: t('entrenar.timeline.kindInfer') },
    freeze: { chip: 'bg-teal text-white', icon: Unlock, label: t('entrenar.timeline.kindFreeze') },
  };

  return (
    <section className="notebook-lines bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          sticker={t('entrenar.timeline.sticker')}
          stickerColor="mint"
          title={t('entrenar.timeline.title')}
          underlineWord={t('entrenar.timeline.underlineWord')}
          underlineColor="coral"
          subtitle={t('entrenar.timeline.subtitle')}
        />

        <div ref={ref} className="relative">
          {/* horizontal progress line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden md:block" aria-hidden="true">
            <div className="h-1 w-full rounded-full border-2 border-dashed border-ink/25" />
            <motion.div
              className="absolute inset-x-0 top-0 h-1 origin-left rounded-full bg-ink"
              style={{ scaleX: hScale }}
            />
          </div>
          {/* vertical progress line (mobile) */}
          <div className="absolute bottom-4 left-7 top-4 md:hidden" aria-hidden="true">
            <div className="h-full w-1 rounded-full border-2 border-dashed border-ink/25" />
            <motion.div
              className="absolute inset-y-0 left-0 w-1 origin-top rounded-full bg-ink"
              style={{ scaleY: vScale }}
            />
          </div>

          <ol className="relative flex flex-col gap-10 pl-16 md:flex-row md:gap-6 md:pl-0">
            {MILESTONES.map((m, i) => {
              const s = KIND_STYLE[m.kind];
              const Icon = s.icon;
              const isInfer = m.kind === 'infer';
              return (
                <motion.li
                  key={m.when}
                  className="relative flex-1"
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={
                    isInfer
                      ? { scale: [0.7, 1.06, 1], opacity: 1 }
                      : { scale: 1, opacity: 1 }
                  }
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={
                    isInfer
                      ? { times: [0, 0.7, 1], duration: 0.8, delay: i * 0.12, ease: 'easeOut' }
                      : { delay: i * 0.12, type: 'spring', stiffness: 300, damping: 18 }
                  }
                >
                  {/* node on the line */}
                  <span
                    className={cn(
                      'absolute -left-9 top-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink shadow-doodle-sm md:-left-0 md:top-0 md:h-14 md:w-14',
                      s.chip,
                    )}
                  >
                    {m.kind === 'freeze' ? (
                      <Snowflake className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.75} />
                    ) : (
                      <Icon className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.75} />
                    )}
                  </span>

                  <div className="doodle-card doodle-card-hover p-4 md:mt-20">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em]', s.chip)}>
                        {s.label}
                      </span>
                      {m.sticker && (
                        <Sticker color="mint" rotate={4} className="!px-2.5 !py-0.5 !text-[0.7rem]">
                          {m.sticker} ❄
                        </Sticker>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-extrabold text-ink">{m.when}</h3>
                    <p className="mt-1 text-[0.95rem] font-semibold leading-snug text-ink-soft">{m.text}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

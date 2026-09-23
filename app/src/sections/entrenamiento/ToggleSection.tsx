import { useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import {
  BookOpen,
  CalendarCheck,
  ChefHat,
  GraduationCap,
  PiggyBank,
  Repeat,
  Timer,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/doodle/SectionHeading';
import { useLanguage } from '@/i18n/useLanguage';

type Side = 'aprender' | 'cocinar';

interface SideContent {
  title: string;
  image: string;
  imageAlt: string;
  accentBg: string;
  icon: typeof GraduationCap;
  points: { icon: typeof BookOpen; text: string }[];
  tag: string;
}

export default function ToggleSection() {
  const { t } = useLanguage();
  const [side, setSide] = useState<Side>('aprender');
  const shake = useAnimationControls();

  const CONTENT: Record<Side, SideContent> = {
    aprender: {
      title: t('entrenar.toggle.trainTitle'),
      image: '/chef-aprendiz.png',
      imageAlt: t('entrenar.toggle.trainImageAlt'),
      accentBg: 'bg-lilac/15',
      icon: GraduationCap,
      points: [
        { icon: CalendarCheck, text: t('entrenar.toggle.trainP1') },
        { icon: BookOpen, text: t('entrenar.toggle.trainP2') },
        { icon: PiggyBank, text: t('entrenar.toggle.trainP3') },
        { icon: ChefHat, text: t('entrenar.toggle.trainP4') },
      ],
      tag: t('entrenar.toggle.trainTag'),
    },
    cocinar: {
      title: t('entrenar.toggle.inferTitle'),
      image: '/chef-cocinando.png',
      imageAlt: t('entrenar.toggle.inferImageAlt'),
      accentBg: 'bg-peach',
      icon: ChefHat,
      points: [
        { icon: Repeat, text: t('entrenar.toggle.inferP1') },
        { icon: BookOpen, text: t('entrenar.toggle.inferP2') },
        { icon: Timer, text: t('entrenar.toggle.inferP3') },
        { icon: UtensilsCrossed, text: t('entrenar.toggle.inferP4') },
      ],
      tag: t('entrenar.toggle.inferTag'),
    },
  };

  const OPTIONS: { id: Side; label: string; sub: string; icon: typeof GraduationCap }[] = [
    { id: 'aprender', label: t('entrenar.toggle.learnLabel'), sub: t('entrenar.toggle.learnSub'), icon: GraduationCap },
    { id: 'cocinar', label: t('entrenar.toggle.cookLabel'), sub: t('entrenar.toggle.cookSub'), icon: ChefHat },
  ];

  const c = CONTENT[side];

  const pick = (s: Side) => {
    if (s === side) return;
    setSide(s);
    // the switch "creaks" visually
    shake.start({ x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.15 } });
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* crossfading split background */}
      <motion.div
        className="absolute inset-0 bg-lilac/15"
        animate={{ opacity: side === 'aprender' ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 bg-peach"
        animate={{ opacity: side === 'cocinar' ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4">
        <SectionHeading
          sticker={t('entrenar.toggle.sticker')}
          stickerColor="peach"
          title={t('entrenar.toggle.title')}
          underlineWord={t('entrenar.toggle.underlineWord')}
          underlineColor="lilac"
          subtitle={t('entrenar.toggle.subtitle')}
        />

        {/* hand-drawn switch */}
        <motion.div animate={shake} className="mb-12 flex justify-center">
          <div
            role="tablist"
            aria-label={t('entrenar.toggle.switchAria')}
            className="relative inline-flex rounded-full border-[3px] border-ink bg-white p-1.5 shadow-doodle"
          >
            {OPTIONS.map(({ id, label, sub, icon: Icon }) => {
              const activeOption = side === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeOption}
                  onClick={() => pick(id)}
                  className={cn(
                    'relative z-10 flex items-center gap-2 rounded-full px-5 py-3 font-display text-base font-extrabold transition-colors md:px-8 md:text-lg',
                    activeOption ? 'text-white' : 'text-ink-soft hover:text-ink',
                  )}
                >
                  {activeOption && (
                    <motion.span
                      layoutId="chef-toggle-pill"
                      className={cn(
                        'absolute inset-0 -z-10 rounded-full border-[3px] border-ink',
                        id === 'aprender' ? 'bg-lilac' : 'bg-coral',
                      )}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon className="h-5 w-5" strokeWidth={2.75} />
                  <span className="flex flex-col items-start leading-none">
                    {label}
                    <span
                      className={cn(
                        'mt-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.08em]',
                        activeOption ? 'text-white/80' : 'text-ink-soft/70',
                      )}
                    >
                      {sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* flipping card */}
        <div className="[perspective:1600px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={side}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="doodle-card grid gap-8 p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-10"
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center rounded-blob-2 border-[3px] border-ink p-4',
                  c.accentBg,
                )}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              >
                <img src={c.image} alt={c.imageAlt} className="w-full max-w-xs" loading="lazy" />
              </motion.div>

              <div>
                <h3 className="flex items-center gap-3 font-display text-2xl font-extrabold text-ink md:text-3xl">
                  <span
                    className={cn(
                      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-white shadow-doodle-sm',
                      side === 'aprender' ? 'bg-lilac' : 'bg-coral',
                    )}
                  >
                    <c.icon className="h-5 w-5" strokeWidth={2.75} />
                  </span>
                  {c.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {c.points.map(({ icon: Icon, text }, i) => (
                    <motion.li
                      key={text}
                      className="flex items-start gap-3"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-sun/60">
                        <Icon className="h-4 w-4 text-ink" strokeWidth={2.75} />
                      </span>
                      <span className="font-semibold leading-snug text-ink">{text}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.p
                  className="mt-6 inline-block rounded-lg border-2 border-ink bg-paper-deep px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  {c.tag}
                </motion.p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, ArrowDown } from 'lucide-react';
import Sticker from '@/components/doodle/Sticker';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import { useLanguage } from '@/i18n/useLanguage';
import HeroParticles from './HeroParticles';
import TypewriterCard from './TypewriterCard';

const wordAnim = (i: number) => ({
  initial: { y: 60, rotate: 6, opacity: 0 },
  animate: { y: 0, rotate: 0, opacity: 1 },
  transition: {
    delay: 0.15 + i * 0.06,
    duration: 0.8,
    ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
});

function DoodleCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 46 C 4 46, 2 30, 14 28 C 16 14, 34 8, 46 16 C 54 4, 76 4, 84 16 C 98 10, 114 20, 110 34 C 118 38, 114 46, 104 46 Z"
        fill="#FFFFFF"
        stroke="#26233F"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const cloudY1 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const cloudY2 = useTransform(scrollYProgress, [0, 1], [0, 20]);

  let wordIndex = 0;
  const next = () => wordIndex++;
  const titleBefore = t('home.hero.titleBefore').split(' ');
  const titleAfter = t('home.hero.titleAfter').split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-16 md:py-24"
    >
      <HeroParticles />
      {/* parallax doodle clouds */}
      <motion.div style={{ y: cloudY1 }} className="pointer-events-none absolute right-[6%] top-10 z-0 hidden md:block">
        <DoodleCloud className="h-16 w-32 opacity-80" />
      </motion.div>
      <motion.div style={{ y: cloudY2 }} className="pointer-events-none absolute left-[4%] top-24 z-0 hidden md:block">
        <DoodleCloud className="h-12 w-24 opacity-60" />
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[55%_45%]">
        <div className="flex flex-col items-start gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 320, damping: 16 }}
          >
            <Sticker color="sun" rotate={-4}>
              {t('home.hero.sticker')}
            </Sticker>
          </motion.div>

          <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.02] text-ink">
            {titleBefore.map((w) => (
              <motion.span key={w} className="mr-[0.22em] inline-block" {...wordAnim(next())}>
                {w}
              </motion.span>
            ))}
            <motion.span className="mr-[0.22em] inline-block" {...wordAnim(next())}>
              <span className="relative inline-block">
                {t('home.hero.titleHighlight')}
                <SquiggleUnderline color="coral" strokeWidth={7} className="absolute -bottom-2 left-0" delay={0.9} />
              </span>
            </motion.span>
            {titleAfter.map((w) => (
              <motion.span key={w} className="mr-[0.22em] inline-block" {...wordAnim(next())}>
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="max-w-xl text-xl font-bold leading-relaxed text-ink-soft"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.62, duration: 0.6, ease: 'easeOut' }}
          >
            <TypewriterCard />
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.74, duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div whileHover={{ scale: 1.03, rotate: -1 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-coral px-7 py-3.5 font-display text-lg font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
              >
                <Compass className="h-5 w-5" strokeWidth={2.75} />
                {t('home.hero.ctaStart')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, rotate: 1 }} whileTap={{ scale: 0.96 }}>
              <a
                href="#lo-basico"
                className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-white px-7 py-3.5 font-display text-lg font-extrabold text-ink shadow-doodle transition-colors hover:bg-paper-deep"
              >
                <ArrowDown className="h-5 w-5" strokeWidth={2.75} />
                {t('home.hero.ctaBasics')}
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Illustration with looping car */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        >
          <motion.p
            className="pointer-events-none absolute -top-10 right-2 z-10 -rotate-2 font-mono text-sm font-bold tracking-wide text-ink-soft md:-top-12 md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
          >
            {t('home.hero.authorPrefix')} <span className="text-ink">{t('home.hero.authorName')}</span>
          </motion.p>
          <img
            src="/hero-illustration.png"
            alt={t('home.hero.illustrationAlt')}
            className="w-full rounded-blob border-[3px] border-ink shadow-doodle"
            width={1600}
            height={1000}
          />
          <motion.img
            src="/cochecito.svg"
            alt=""
            className="absolute -bottom-6 left-2 w-20 md:w-24"
            animate={{ x: [0, 110, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}

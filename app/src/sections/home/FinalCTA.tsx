import { memo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

const CONFETTI_COLORS = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6', '#26233F'];
const SHAPES = ['circle', 'star', 'triangle'] as const;

/** Perpetual bobbing mascot — isolated + memoized so it never resets. */
const BobbingMascot = memo(function BobbingMascot() {
  const { t } = useLanguage();
  return (
    <motion.img
      src="/preguntin-fiesta.svg"
      alt={t('home.finalCta.mascotAlt')}
      className="h-28 w-28 md:h-36 md:w-36"
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

function ConfettiBurst() {
  const pieces = Array.from({ length: 12 });
  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 90 + (i % 3) * 30;
        const shape = SHAPES[i % SHAPES.length];
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 30,
              scale: 1,
              opacity: 0,
              rotate: 160,
            }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            {shape === 'circle' && (
              <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            )}
            {shape === 'triangle' && (
              <span
                className="block h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent"
                style={{ borderBottomColor: color }}
              />
            )}
            {shape === 'star' && (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={color}>
                <path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 16.9 6.4 20.5 8 13.7 3 9.3l6.4-.7z" />
              </svg>
            )}
          </motion.span>
        );
      })}
    </span>
  );
}

export default function FinalCTA() {
  const { t } = useLanguage();
  const titleWords = t('home.finalCta.title').split(' ');
  const navigate = useNavigate();
  const [burst, setBurst] = useState(0);
  const [hovered, setHovered] = useState(false);
  const navigating = useRef(false);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;
    setBurst((b) => b + 1);
    window.setTimeout(() => navigate('/mapa'), 550);
  };

  return (
    <section className="bg-peach py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center md:px-6">
        <BobbingMascot />
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
          {titleWords.map((w, i) => (
            <motion.span
              key={w}
              className="mr-[0.22em] inline-block"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
            >
              {w}
            </motion.span>
          ))}
        </h2>
        <motion.p
          className="text-xl font-bold text-ink-soft"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {t('home.finalCta.subtitle')}
        </motion.p>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <motion.a
            href="/mapa"
            onClick={handleStart}
            onHoverStart={() => setHovered(true)}
            className="relative inline-flex items-center gap-3 rounded-full border-[3px] border-ink bg-coral px-10 py-5 font-display text-2xl font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
            animate={hovered ? { scale: 1 } : { scale: [1, 1.04, 1] }}
            transition={
              hovered
                ? { duration: 0.15 }
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
            }
            whileTap={{ scale: 0.96 }}
          >
            <Compass className="h-6 w-6" strokeWidth={2.75} />
            {t('home.finalCta.cta')}
            {burst > 0 && <ConfettiBurst key={burst} />}
          </motion.a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/ejemplos"
            className="text-sm font-bold text-ink-soft underline decoration-wavy underline-offset-4 transition-colors hover:text-ink"
          >
            {t('home.finalCta.alt')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

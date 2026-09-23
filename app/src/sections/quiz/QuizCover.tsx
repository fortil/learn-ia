import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Sticker from '@/components/doodle/Sticker';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import { useLanguage } from '@/i18n/useLanguage';

/** Preguntín fiesta with a perpetual gentle bob — isolated + memoized. */
const BobbingMascot = memo(function BobbingMascot() {
  const { t } = useLanguage();
  return (
    <motion.img
      src="/preguntin-fiesta.svg"
      alt={t('quiz.cover.mascotAlt')}
      className="h-36 w-36 md:h-48 md:w-48"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

/** Giant start button with a perpetual heartbeat — isolated + memoized. */
const PulsingStart = memo(function PulsingStart({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.button
        type="button"
        onClick={onStart}
        whileHover={{ scale: 1.04, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 rounded-full border-[3px] border-ink bg-coral px-10 py-5 font-display text-2xl font-extrabold text-white shadow-doodle transition-colors hover:bg-coral-deep"
      >
        <Play className="h-6 w-6" strokeWidth={3} fill="currentColor" />
        {t('quiz.cover.cta')}
      </motion.button>
    </motion.div>
  );
});

interface QuizCoverProps {
  onStart: () => void;
}

/** Quiz cover (initial state): big doodle card + Preguntín fiesta. */
export default function QuizCover({ onStart }: QuizCoverProps) {
  const { t } = useLanguage();
  return (
    <section className="notebook-dots relative overflow-hidden bg-sun/20 px-4 py-24 md:py-32">
      {/* decorative dotted path */}
      <svg
        viewBox="0 0 1200 400"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-25"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 320 C 180 260, 300 380, 480 320 S 780 240, 960 300 S 1140 360, 1200 320"
          stroke="#26233F"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="12 14"
          fill="none"
        />
      </svg>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        <motion.div
          className="doodle-card flex flex-1 flex-col items-center gap-5 p-8 text-center md:p-12"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <Sticker color="sun" rotate={-3}>
            {t('quiz.cover.sticker')}
          </Sticker>
          <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] text-ink">
            {t('quiz.cover.titleBefore')}
            <span className="relative inline-block">
              {t('quiz.cover.titleHighlight')}
              <SquiggleUnderline color="coral" strokeWidth={6} className="absolute -bottom-1 left-0" />
            </span>
            {t('quiz.cover.titleAfter')}
          </h1>
          <p className="max-w-md text-lg font-semibold text-ink-soft">
            {t('quiz.cover.subtitle')}
          </p>
          <PulsingStart onStart={onStart} />
        </motion.div>
        <motion.div
          initial={{ x: 60, opacity: 0, rotate: 6 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 16 }}
        >
          <BobbingMascot />
        </motion.div>
      </div>
    </section>
  );
}

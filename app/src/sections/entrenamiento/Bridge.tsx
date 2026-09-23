import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import DoodleArrow from '@/components/doodle/DoodleArrow';
import { useLanguage } from '@/i18n/useLanguage';

function LoopingArrow() {
  return (
    <svg viewBox="0 0 120 60" fill="none" aria-hidden="true" className="h-12 w-24 -rotate-12">
      <motion.path
        d="M6 12 C 34 44, 70 52, 104 34"
        stroke="#E04E2D"
        strokeWidth={4.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.6, times: [0, 0.25, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M92 22 L106 35 L88 42"
        stroke="#E04E2D"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.6, times: [0, 0.2, 0.32, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function Bridge() {
  const { t } = useLanguage();
  return (
    <section className="notebook-dots bg-peach py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center">
        <motion.h2
          className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] text-ink"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {t('entrenar.bridge.titleBefore')}
          <span className="marker-highlight">{t('entrenar.bridge.titleHighlight')}</span>
        </motion.h2>

        <div className="flex flex-col items-center gap-1">
          <LoopingArrow />
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-8 py-4 font-display text-xl font-extrabold text-white shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-coral-deep hover:shadow-doodle-pressed"
            >
              <Compass className="h-5 w-5" strokeWidth={2.75} />
              {t('entrenar.bridge.cta')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DoodleArrow color="ink" flip bow="up" className="!h-8 !w-16" />
          <Link
            to="/ejemplos"
            className="font-display text-lg font-extrabold text-ink underline decoration-wavy decoration-2 underline-offset-4 transition-colors hover:text-coral-deep"
          >
            {t('entrenar.bridge.alt')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

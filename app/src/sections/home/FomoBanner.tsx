import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

/** Home card linking to /fomo. Style follows sections/ejemplos/Bridges. */
export default function FomoBanner() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={{ rotateX: 3, rotateY: -3 }}
      style={{ transformPerspective: 800 }}
      className="mx-auto max-w-5xl px-4"
    >
      <Link
        to="/fomo"
        className="group flex items-center gap-6 rounded-blob-2 border-[3px] border-ink bg-peach/60 p-6 shadow-doodle transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[10px_10px_0_#26233F] md:p-8"
      >
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-coral text-white shadow-doodle-sm">
          <Flame className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <span className="flex flex-1 flex-col gap-1">
          <span className="font-display text-xl font-extrabold leading-tight text-ink md:text-2xl">
            {t('fomo.banner.title')}
          </span>
          <span className="font-semibold leading-relaxed text-ink-soft">{t('fomo.banner.text')}</span>
        </span>
        <span className="hidden shrink-0 items-center gap-2 font-display text-lg font-extrabold text-ink sm:inline-flex">
          {t('fomo.banner.cta')}
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1.5"
            strokeWidth={2.75}
          />
        </span>
      </Link>
    </motion.div>
  );
}

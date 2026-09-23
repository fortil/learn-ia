import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle, Stamp } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

export default function Bridges() {
  const { t } = useLanguage();

  const CARDS = [
    {
      to: '/mitos',
      title: t('ejemplos.bridges.b1Title'),
      text: t('ejemplos.bridges.b1Text'),
      bg: 'bg-pink/30',
      accent: 'bg-pink',
      icon: Stamp,
      cta: t('ejemplos.bridges.b1Cta'),
    },
    {
      to: '/quiz',
      title: t('ejemplos.bridges.b2Title'),
      text: t('ejemplos.bridges.b2Text'),
      bg: 'bg-sun/30',
      accent: 'bg-sun',
      icon: HelpCircle,
      cta: t('ejemplos.bridges.b2Cta'),
    },
  ];

  return (
    <section className="notebook-lines bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ delay: i * 0.12, duration: 0.55, ease: 'easeOut' }}
            whileHover={{ rotateX: 3, rotateY: i === 0 ? -3 : 3 }}
            style={{ transformPerspective: 800 }}
          >
            <Link
              to={c.to}
              className={`group flex h-full flex-col gap-4 rounded-blob-2 border-[3px] border-ink p-8 shadow-doodle transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[10px_10px_0_#26233F] ${c.bg}`}
            >
              <span
                className={`inline-flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink text-ink shadow-doodle-sm ${c.accent}`}
              >
                <c.icon className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <h3 className="font-display text-2xl font-extrabold leading-tight text-ink md:text-3xl">
                {c.title}
              </h3>
              <p className="font-semibold leading-relaxed text-ink-soft">{c.text}</p>
              <span className="mt-auto inline-flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                {c.cta}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1.5"
                  strokeWidth={2.75}
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

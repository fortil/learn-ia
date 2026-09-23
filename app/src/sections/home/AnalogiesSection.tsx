import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChefHat, Smartphone, LibraryBig, Music, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/doodle/SectionHeading';
import FlipCard from '@/components/doodle/FlipCard';
import { useLanguage } from '@/i18n/useLanguage';

export default function AnalogiesSection() {
  const { t } = useLanguage();

  const analogies = [
    {
      icon: ChefHat,
      front: t('home.analogies.a1Front'),
      back: (
        <>
          {t('home.analogies.a1Back1')}
          <strong>{t('home.analogies.a1Strong1')}</strong>
          {t('home.analogies.a1Back2')}
          <strong>{t('home.analogies.a1Strong2')}</strong>
          {t('home.analogies.a1Back3')}
          <Link
            to="/entrenamiento-vs-inferencia"
            className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-coral-deep underline decoration-wavy underline-offset-4"
          >
            {t('home.analogies.a1Link')}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
          </Link>
        </>
      ),
      backColor: 'peach' as const,
    },
    {
      icon: Smartphone,
      front: t('home.analogies.a2Front'),
      back: (
        <>
          {t('home.analogies.a2Back1')}
          <strong>{t('home.analogies.a2Strong')}</strong>
          {t('home.analogies.a2Back2')}
        </>
      ),
      backColor: '#E9E3FD' as const,
    },
    {
      icon: LibraryBig,
      front: t('home.analogies.a3Front'),
      back: (
        <>
          {t('home.analogies.a3Back1')}
          <strong>{t('home.analogies.a3Strong')}</strong>
          {t('home.analogies.a3Back2')}
        </>
      ),
      backColor: 'mint' as const,
    },
    {
      icon: Music,
      front: t('home.analogies.a4Front'),
      back: (
        <>
          {t('home.analogies.a4Back1')}
          <strong>{t('home.analogies.a4Strong')}</strong>
          {t('home.analogies.a4Back2')}
        </>
      ),
      backColor: '#FCE3F1' as const,
    },
  ];

  return (
    <section className="bg-mint/50 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading
          sticker={t('home.analogies.sticker')}
          stickerColor="peach"
          title={t('home.analogies.title')}
        />
        <div className="grid gap-8 sm:grid-cols-2">
          {analogies.map((a, i) => (
            <motion.div
              key={a.front}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
            >
              <FlipCard
                backColor={a.backColor}
                hint={t('common.flipHint')}
                front={
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-sun shadow-doodle-sm">
                      <a.icon className="h-8 w-8 text-ink" strokeWidth={2.25} />
                    </span>
                    <span className="font-display text-2xl font-bold text-ink">{a.front}</span>
                  </>
                }
                back={<p className="max-w-xs text-[1.05rem] font-semibold leading-relaxed text-ink">{a.back}</p>}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

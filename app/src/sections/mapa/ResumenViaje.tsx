import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, ChefHat } from 'lucide-react';
import { SectionHeading, StationDot } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import { STATION_META } from './stations';

/** Final recap: the 5 stations on a connecting line + onward CTAs. */
export default function ResumenViaje() {
  const { t } = useLanguage();

  const summaries = [
    t('mapa.resumen.s1'),
    t('mapa.resumen.s2'),
    t('mapa.resumen.s3'),
    t('mapa.resumen.s4'),
    t('mapa.resumen.s5'),
  ];

  return (
    <section className="notebook-lines relative border-t-[3px] border-ink/10 bg-paper px-4 py-24">
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionHeading
          sticker={t('mapa.resumen.sticker')}
          stickerColor="mint"
          title={t('mapa.resumen.title')}
          subtitle={t('mapa.resumen.subtitle')}
        />

        <ol className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-4">
          {/* connecting line */}
          <motion.span
            className="absolute left-7 top-0 h-full w-1 rounded-full bg-ink/20 md:left-0 md:top-7 md:h-1 md:w-full"
            initial={{ scaleY: 0, scaleX: 0 }}
            whileInView={{ scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top left' }}
            aria-hidden="true"
          />
          {summaries.map((text, i) => (
            <motion.li
              key={text}
              className="relative flex items-start gap-4 md:w-40 md:flex-col md:items-center md:gap-3 md:text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ delay: 0.12 * i, duration: 0.5, ease: 'easeOut' }}
            >
              <span className="relative z-10 shrink-0">
                <StationDot number={i + 1} color={STATION_META[i].color} />
              </span>
              <div>
                <p className="font-display text-[1.05rem] font-extrabold text-ink">
                  {t(STATION_META[i].nameKey)}
                </p>
                <p className="text-[0.92rem] font-semibold leading-snug text-ink-soft">{text}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            to="/ejemplos"
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-6 py-3 font-display font-extrabold text-white shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-coral-deep hover:shadow-doodle-pressed"
          >
            {t('mapa.resumen.ctaExamples')}
            <ArrowRight className="h-5 w-5" strokeWidth={2.75} />
          </Link>
          <Link
            to="/entrenamiento-vs-inferencia"
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-white px-6 py-3 font-display font-extrabold text-ink shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed"
          >
            <ChefHat className="h-5 w-5" strokeWidth={2.75} />
            {t('mapa.resumen.ctaTrain')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

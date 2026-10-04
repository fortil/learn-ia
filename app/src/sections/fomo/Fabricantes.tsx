import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

/** Section 2: the six FOMO makers as chips, plus the Ahrefs data chip. */
export default function Fabricantes() {
  const { t } = useLanguage();

  const makers = [1, 2, 3, 4, 5, 6].map((i) => ({
    name: t(`fomo.fabricantes.f${i}n`),
    example: t(`fomo.fabricantes.f${i}e`),
  }));

  return (
    <section id="fabricantes" className="notebook-lines bg-paper-deep px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight text-ink">
            {t('fomo.fabricantes.heading')}
          </h2>
          <p className="mt-4 text-[1.125rem] leading-[1.7] text-ink">
            {t('fomo.fabricantes.intro')}
          </p>
        </motion.div>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {makers.map((m, i) => (
            <motion.li
              key={m.name}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
            >
              <span
                className={cn(
                  'inline-flex flex-col gap-0.5 rounded-blob-3 border-[3px] border-ink px-4 py-2.5 shadow-doodle-sm',
                  MAKER_CLASSES[i % MAKER_CLASSES.length],
                )}
              >
                <span className="font-display text-[1.05rem] font-extrabold leading-tight">
                  {m.name}
                </span>
                <span className="font-mono text-[0.8rem] font-semibold leading-tight opacity-80">
                  {m.example}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-8 flex flex-col items-start gap-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Sticker color="teal" rotate={-2}>
            {t('fomo.fabricantes.dataChip')}
          </Sticker>
          <Link
            to="#habito-4"
            className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-coral-deep underline decoration-wavy underline-offset-4 hover:text-coral"
          >
            {t('fomo.fabricantes.link')} ↓
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const MAKER_CLASSES = [
  'bg-sun text-ink',
  'bg-peach text-ink',
  'bg-mint text-ink',
  'bg-white text-ink',
  'bg-lilac/30 text-ink',
  'bg-pink/30 text-ink',
];

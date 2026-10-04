import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import MythStamp from '@/components/doodle/MythStamp';
import VideoCard from './VideoCard';
import { SECTION_VIDEOS } from './fomoData';
import { useLanguage } from '@/i18n/useLanguage';

/** Sección 1: la anécdota de la cuenta de drones, con la apuesta y sello. */
export default function Anecdota() {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const placeBet = () => {
    if (revealed) return;
    timer.current = window.setTimeout(() => setRevealed(true), 450);
  };

  const video = SECTION_VIDEOS[0];

  return (
    <section id="anecdota" className="bg-paper px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight text-ink">
            {t('fomo.anecdota.heading')}
          </h2>
          <div className="mt-5 space-y-4 text-[1.125rem] leading-[1.7] text-ink">
            <p>{t('fomo.anecdota.p1')}</p>
            <p>{t('fomo.anecdota.p2')}</p>
            <p>{t('fomo.anecdota.p3')}</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <VideoCard
            src={video.src}
            poster={video.poster}
            title={t('fomo.anecdota.heading')}
            viendo={t('fomo.anecdota.video.viendo')}
            notar={t('fomo.anecdota.video.notar')}
          />
        </motion.div>

        <div className="relative mt-10 [perspective:1200px]">
          <motion.div
            className="relative [transform-style:preserve-3d]"
            animate={{ rotateY: revealed ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            {/* front: the bet */}
            <div
              className={cn(
                'doodle-card flex min-h-[180px] flex-col items-center justify-center gap-5 p-6 text-center [backface-visibility:hidden]',
                revealed && 'pointer-events-none',
              )}
            >
              <motion.button
                type="button"
                onClick={placeBet}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-6 py-3 font-display text-lg font-extrabold text-white shadow-doodle-sm"
              >
                {t('fomo.anecdota.bet')}
              </motion.button>
            </div>
            {/* back: the stamp */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-blob-3 border-[3px] border-ink bg-peach p-6 text-center shadow-doodle [backface-visibility:hidden] [transform:rotateY(180deg)]"
              aria-hidden={!revealed}
            >
              {revealed && (
                <MythStamp variant="mito" rotate={-14} delay={0.2} className="bg-paper/70 text-2xl">
                  {t('fomo.anecdota.stamp')}
                </MythStamp>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

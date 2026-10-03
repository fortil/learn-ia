import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import SquiggleUnderline from '@/components/doodle/SquiggleUnderline';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';
import type { TipMeta } from './fomoData';
import { H4_CHAPTER_STARTS, SECTION_VIDEOS } from './fomoData';
import TipInteraction from './TipInteraction';
import VideoCard, { type VideoChapter } from './VideoCard';

/**
 * Fixed anatomy of a habit, in order: kicker + title, the idea in one line,
 * the example video, the sourced data, the tap interaction, the weekly task.
 */
export default function TipSection({ tip, index }: { tip: TipMeta; index: number }) {
  const { t } = useLanguage();
  const ns = `fomo.tips.t${tip.n}`;
  const video = SECTION_VIDEOS[tip.n]; // fomo-0 is the anecdota

  const chapters: VideoChapter[] | undefined =
    tip.interaction === 'chapters'
      ? H4_CHAPTER_STARTS.map((start, i) => ({
          start,
          label: t(`fomo.tips.t4.c${i + 1}l`),
          line: t(`fomo.tips.t4.c${i + 1}t`),
        }))
      : undefined;

  // t() returns the raw key when missing, so absent optionals are filtered by
  // comparing against their own key path
  const rawKey = (k: string) => `${ns}.${k}`;
  const present = (k: string) => t(rawKey(k)) !== rawKey(k);
  const paragraphs = (['p1', 'p2'] as const)
    .filter((k) => present(k))
    .map((k) => t(rawKey(k)));

  return (
    <section
      id={tip.anchor}
      className={cn('scroll-mt-24 px-4 py-16 md:py-20', index % 2 === 0 ? 'bg-paper' : 'bg-paper-deep')}
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Sticker color="paper" rotate={-3} className={cn('border-ink', tip.stickerClass)}>
            {t(`${ns}.kicker`)}
          </Sticker>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight text-ink">
            <span className="relative inline-block">
              {t(`${ns}.title`)}
              <SquiggleUnderline color="coral" className="absolute -bottom-1 left-0" />
            </span>
          </h2>
          <p className="mt-5 text-[1.25rem] font-bold leading-snug text-ink">
            {t(`${ns}.idea`)}
          </p>
          <div className="mt-4 space-y-4 text-[1.125rem] leading-[1.7] text-ink">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <VideoCard
            src={video.src}
            poster={video.poster}
            title={`${t(`${ns}.kicker`)} · ${t(`${ns}.title`)}`}
            viendo={t(`${ns}.video.viendo`)}
            notar={t(`${ns}.video.notar`)}
            chapters={chapters}
          />
        </motion.div>

        <motion.div
          className="mt-10 space-y-5"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {tip.bars && (
            <div className="rounded-blob-3 border-[3px] border-ink bg-white p-5 shadow-doodle-sm">
              <div className="space-y-3">
                {tip.bars.map((bar, i) => (
                  <div key={i}>
                    <p className="mb-1 text-[0.9rem] font-bold leading-tight text-ink">
                      {t(`${ns}.b${i + 1}Label`)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
                        <motion.div
                          className={cn('h-full rounded-full', tip.barClass)}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.pct}%` }}
                          viewport={{ once: true, margin: '-15% 0px' }}
                          transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    {present(`b${i + 1}Source`) && (
                      <p className="mt-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-soft">
                        {t(rawKey(`b${i + 1}Source`))}
                      </p>
                    )}
                  </div>
                ))}
                {present('barsSource') && (
                  <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-soft">
                    {t(rawKey('barsSource'))}
                  </p>
                )}
              </div>
            </div>
          )}

          {present('dataChip') && (
            <Sticker color="sun" rotate={-2}>
              {t(rawKey('dataChip'))}
            </Sticker>
          )}
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <TipInteraction kind={tip.interaction} n={tip.n} />
        </motion.div>

        <motion.p
          className="mt-8 flex items-start gap-2.5 rounded-blob-3 border-[3px] border-dashed border-ink bg-sun/20 px-4 py-3 text-[1rem] font-semibold leading-snug text-ink"
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={2.75} />
          {t(`${ns}.task`)}
        </motion.p>
      </div>
    </section>
  );
}

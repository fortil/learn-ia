import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sticker from '@/components/doodle/Sticker';
import { useLanguage } from '@/i18n/useLanguage';

export interface VideoChapter {
  /** seconds into the final cut */
  start: number;
  label: string;
  line: string;
}

interface VideoCardProps {
  /** final mp4 path or null while the clip is not produced yet */
  src: string | null;
  poster: string | null;
  /** accessible name of the player (section title) */
  title: string;
  viendo: string;
  notar: string;
  chapters?: VideoChapter[];
}

/** One player at a time: the last video that started pauses the previous.
 *  The mutable state lives inside a module-level closure, outside component
 *  bodies (react-hooks/globals and immutability rules). */
const playback = (() => {
  let active: HTMLVideoElement | null = null;
  return {
    claim(el: HTMLVideoElement) {
      if (active && active !== el) active.pause();
      active = el;
    },
  };
})();

/**
 * Vertical example player for the /fomo page. In rest it is a button over the
 * poster; the <video> is rendered WITHOUT src so the browser cannot request
 * the mp4. The src is assigned imperatively inside the tap handler (React
 * re-assigning src would restart the load and abort playback). Never place
 * this component inside a rotated or preserve-3d ancestor: tilted frames go
 * on sibling wrappers.
 */
export default function VideoCard({ src, poster, title, viendo, notar, chapters }: VideoCardProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);

  const unavailable = !src || failed;

  const claimActive = () => {
    const el = videoRef.current;
    if (el) playback.claim(el);
  };

  const handleTap = () => {
    const el = videoRef.current;
    if (!el || !src) return;
    if (!el.src) el.src = src;
    claimActive();
    el.play().catch(() => setFailed(true));
    setStarted(true);
  };

  const activeChapter = chapters
    ? chapters.reduce((acc, ch, i) => (time >= ch.start ? i : acc), -1)
    : -1;

  const jumpTo = (start: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = start;
    if (el.paused) {
      claimActive();
      void el.play();
    }
  };

  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <div className="relative">
        {/* tilted sibling frame: decoration never wraps the video itself */}
        <div className="absolute inset-0 rotate-2 rounded-blob-3 border-[3px] border-ink bg-sun/40 shadow-doodle" aria-hidden="true" />

        {unavailable ? (
          <div
            className="relative flex aspect-[9/16] max-h-[70vh] flex-col items-center justify-center gap-4 rounded-blob-3 border-[3px] border-dashed border-ink bg-paper-deep p-6 text-center"
            role="img"
            aria-label={`${title}. ${t('fomo.ui.pendiente')}`}
          >
            <img src="/preguntin.svg" alt="" className="h-24 w-24 opacity-80" />
            <Sticker color="sun" rotate={-3}>
              {t('fomo.ui.pendiente')}
            </Sticker>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-blob-3 border-[3px] border-ink bg-ink shadow-doodle">
            <video
              ref={videoRef}
              className="aspect-[9/16] max-h-[70vh] w-full bg-ink"
              preload="none"
              playsInline
              controls={started}
              poster={poster ?? undefined}
              onPlay={claimActive}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onError={() => setFailed(true)}
            />
            {!started && (
              <button
                type="button"
                onClick={handleTap}
                aria-label={`${title}. ${t('fomo.ui.play')}`}
                className="group absolute inset-0 flex items-center justify-center bg-ink/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-sun/70"
              >
                {poster && (
                  <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-sun text-ink shadow-doodle-sm transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7" strokeWidth={2.75} fill="#26233F" />
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* the two feet: what you are watching / what to notice */}
      <figcaption className="mt-4 space-y-1.5 text-left">
        <p className="text-[0.95rem] leading-relaxed text-ink">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            {t('fomo.ui.viendoLabel')}:{' '}
          </span>
          {viendo}
        </p>
        <p className="text-[0.95rem] leading-relaxed text-ink">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            {t('fomo.ui.notarLabel')}:{' '}
          </span>
          {notar}
        </p>
      </figcaption>

      {chapters && chapters.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
            {t('fomo.ui.chaptersCaption')}
          </p>
          <div className="flex flex-wrap gap-2">
            {chapters.map((ch, i) => (
              <button
                key={ch.start}
                type="button"
                onClick={() => jumpTo(ch.start)}
                aria-pressed={activeChapter === i}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.06em] shadow-doodle-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-doodle-pressed',
                  i % 4 === 0 && 'bg-coral text-white',
                  i % 4 === 1 && 'bg-teal text-white',
                  i % 4 === 2 && 'bg-sun text-ink',
                  i % 4 === 3 && 'bg-lilac text-white',
                  activeChapter === i && 'ring-2 ring-ink ring-offset-2 ring-offset-paper',
                )}
              >
                {ch.label}
              </button>
            ))}
          </div>
          <div className="mt-3 min-h-[56px]">
            <AnimatePresence mode="wait">
              {activeChapter >= 0 && (
                <motion.p
                  key={activeChapter}
                  className="inline-block rounded-blob-3 border-[3px] border-ink bg-white px-4 py-2.5 text-[0.95rem] font-semibold leading-snug text-ink shadow-doodle-sm"
                  initial={{ y: 10, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -6, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {chapters[activeChapter].line}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </figure>
  );
}

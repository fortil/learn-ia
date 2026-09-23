import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  /** back-face background color */
  backColor?: DoodleColor | string;
  className?: string;
  /** small caption under the card, e.g. "Toca para girar" */
  hint?: string;
}

/** Card that flips 180° on click/tap (Framer Motion rotateY, soft spring). */
export default function FlipCard({ front, back, backColor = 'mint', className, hint }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="block w-full cursor-pointer [perspective:1200px] focus:outline-none focus-visible:ring-4 focus-visible:ring-sun/70 rounded-blob-3"
      >
        <motion.div
          className="relative w-full [transform-style:preserve-3d]"
          style={{ aspectRatio: '4 / 3' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="doodle-card absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center [backface-visibility:hidden]">
            {front}
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-blob-3 border-[3px] border-ink p-6 text-center shadow-doodle [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: resolveColor(backColor) }}
          >
            {back}
          </div>
        </motion.div>
      </button>
      {hint && (
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
          {hint}
        </span>
      )}
    </div>
  );
}

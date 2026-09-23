import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLORS = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6'];
type Shape = 'circle' | 'square' | 'triangle';

interface Piece {
  left: number;
  size: number;
  color: string;
  shape: Shape;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
}

interface FallingConfettiProps {
  count?: number;
  /** vertical fall distance in px (roughly the container height) */
  fall?: number;
  className?: string;
}

/**
 * One-shot confetti rain: pieces fall once with soft gravity and fade out.
 * Memoized so parent re-renders never restart the fall.
 */
function FallingConfetti({ count = 20, fall = 720, className }: FallingConfettiProps) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 7 + Math.random() * 9,
        color: COLORS[i % COLORS.length],
        shape: (['circle', 'square', 'triangle'] as Shape[])[i % 3],
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 1.3,
        drift: -40 + Math.random() * 80,
        rotate: 180 + Math.random() * 360,
      })),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? 2 : 0,
            clipPath: p.shape === 'triangle' ? 'polygon(50% 0, 100% 100%, 0 100%)' : undefined,
          }}
          initial={{ y: -24, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: fall, x: p.drift, rotate: p.rotate, opacity: [1, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            times: [0, 0.75, 0.95, 1],
          }}
        />
      ))}
    </div>
  );
}

export default memo(FallingConfetti);

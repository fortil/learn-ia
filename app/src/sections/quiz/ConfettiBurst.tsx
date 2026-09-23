import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STATION_COLORS = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6'];
type Shape = 'circle' | 'star' | 'triangle';

interface Piece {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: Shape;
  delay: number;
  duration: number;
  rotate: number;
}

interface ConfettiBurstProps {
  count?: number;
  className?: string;
}

/**
 * One-shot celebration burst: geometric shapes (circles, stars, triangles in
 * the station palette) fly out from the top-center and rain down with gravity.
 */
function ConfettiBurst({ count = 30, className }: ConfettiBurstProps) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.PI * (0.15 + Math.random() * 0.7); // downward fan
        const power = 180 + Math.random() * 320;
        return {
          x: Math.cos(angle) * power * (Math.random() < 0.5 ? -1 : 1),
          y: Math.sin(angle) * power + 260,
          size: 8 + Math.random() * 10,
          color: STATION_COLORS[i % STATION_COLORS.length],
          shape: (['circle', 'star', 'triangle'] as Shape[])[i % 3],
          delay: Math.random() * 0.25,
          duration: 1.8 + Math.random() * 1.1,
          rotate: 200 + Math.random() * 400,
        };
      }),
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
          className="absolute left-1/2 top-0"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 0,
            clipPath:
              p.shape === 'triangle'
                ? 'polygon(50% 0, 100% 100%, 0 100%)'
                : p.shape === 'star'
                  ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  : undefined,
          }}
          initial={{ x: 0, y: -20, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 0.6, 0.6, 1],
            times: [0, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}

export default memo(ConfettiBurst);

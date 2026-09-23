import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PALETTE = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6'];
const SHAPES = ['rounded-full', 'rounded-[2px]', 'rotate-45 rounded-[2px]'] as const;

interface ConfettiBurstProps {
  /** bump this number to fire a new burst */
  trigger: number;
  /** how many pieces (max ~30) */
  count?: number;
  className?: string;
}

/**
 * Lightweight geometric confetti burst (circles, squares, diamonds in the
 * site palette). Renders inside a relative parent; fires on `trigger` change
 * and auto-hides after the animation.
 */
export default function ConfettiBurst({ trigger, count = 16, className }: ConfettiBurstProps) {
  const [hiddenFor, setHiddenFor] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    const t = window.setTimeout(() => setHiddenFor(trigger), 1400);
    return () => window.clearTimeout(t);
  }, [trigger]);

  const active = trigger > 0 && hiddenFor !== trigger;

  const pieces = Array.from({ length: Math.min(count, 30) }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.35;
    const dist = 70 + ((i * 37) % 60);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      color: PALETTE[i % PALETTE.length],
      shape: SHAPES[i % SHAPES.length],
      size: 7 + ((i * 13) % 7),
      rotate: (i * 53) % 360,
    };
  });

  return (
    <div className={cn('pointer-events-none absolute inset-0 z-20 overflow-visible', className)} aria-hidden="true">
      <AnimatePresence>
        {active &&
          pieces.map((p, i) => (
            <motion.span
              key={`${trigger}-${i}`}
              className={cn('absolute left-1/2 top-1/2 border-2 border-ink', p.shape)}
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

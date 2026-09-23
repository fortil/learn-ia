import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

interface DoodleArrowProps {
  color?: DoodleColor | string;
  className?: string;
  /** flip horizontally (point left instead of right) */
  flip?: boolean;
  /** curvature direction: arrow bows up or down */
  bow?: 'up' | 'down';
  /** animate draw-on when scrolled into view */
  drawOn?: boolean;
  delay?: number;
}

/** Curved hand-drawn arrow, re-colorable, with optional draw-on animation. */
export default function DoodleArrow({
  color = 'ink',
  className,
  flip = false,
  bow = 'down',
  drawOn = true,
  delay = 0,
}: DoodleArrowProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const stroke = resolveColor(color);
  // viewBox 120x60; curve from left to right with a hand-drawn wobble
  const curve =
    bow === 'down'
      ? 'M6 12 C 34 44, 70 52, 104 34'
      : 'M6 48 C 34 16, 70 8, 104 26';
  // arrowhead near the end (104,34) / (104,26)
  const head =
    bow === 'down' ? 'M92 22 L106 35 L88 42' : 'M92 38 L106 25 L88 18';
  const animate = drawOn ? { pathLength: inView ? 1 : 0 } : { pathLength: 1 };
  return (
    <svg
      ref={ref}
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden="true"
      className={cn('h-12 w-24 overflow-visible', className)}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <motion.path
        d={curve}
        stroke={stroke}
        strokeWidth={4.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={animate}
        transition={{ duration: 0.6, delay, ease: 'easeInOut' }}
      />
      <motion.path
        d={head}
        stroke={stroke}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animate}
        transition={{ duration: 0.3, delay: delay + 0.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

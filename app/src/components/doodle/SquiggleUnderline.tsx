import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

interface SquiggleUnderlineProps {
  color?: DoodleColor | string;
  className?: string;
  /** stroke width in px */
  strokeWidth?: number;
  delay?: number;
}

/** Hand-drawn wavy underline that draws itself when it enters the viewport. */
export default function SquiggleUnderline({
  color = 'coral',
  className,
  strokeWidth = 5,
  delay = 0.15,
}: SquiggleUnderlineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  // hand-drawn wavy path across a 120x14 viewbox
  const d = 'M3 9 C 12 3, 20 13, 30 8 S 46 3, 56 8 S 74 13, 84 7 S 104 3, 117 8';
  return (
    <svg
      ref={ref}
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('block h-[0.22em] w-full overflow-visible', className)}
    >
      <motion.path
        d={d}
        fill="none"
        stroke={resolveColor(color)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      />
    </svg>
  );
}

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

interface StationDotProps {
  number: number;
  color?: DoodleColor | string;
  /** active stations get a pulsing ring */
  active?: boolean;
  size?: number;
  className?: string;
}

/** Numbered station dot with its color; pulses while active. */
export default function StationDot({
  number,
  color = 'coral',
  active = false,
  size = 56,
  className,
}: StationDotProps) {
  const c = resolveColor(color);
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full border-4"
          style={{ borderColor: c }}
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
          transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
        />
      )}
      <span
        className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-ink font-display text-xl font-extrabold text-white shadow-doodle-sm"
        style={{ backgroundColor: c }}
      >
        {number}
      </span>
    </span>
  );
}

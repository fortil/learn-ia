import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

interface ProgressBarProps {
  /** 0..1 */
  value: number;
  color?: DoodleColor | string;
  className?: string;
  label?: string;
}

/** Quiz / passport progress bar with ink border and animated fill. */
export default function ProgressBar({ value, color = 'teal', className, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-5 w-full overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-doodle-sm"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: resolveColor(color) }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>
    </div>
  );
}

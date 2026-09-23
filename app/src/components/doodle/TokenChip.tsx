import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PASTELS = {
  mint: 'bg-mint',
  peach: 'bg-peach',
  sun: 'bg-sun',
  lilac: 'bg-lilac/25',
  pink: 'bg-pink/30',
  paper: 'bg-paper-deep',
} as const;

interface TokenChipProps {
  label: string;
  color?: keyof typeof PASTELS;
  className?: string;
}

/** Token chip: Space Mono, pastel background, ink border, hard shadow; jumps on hover. */
export default function TokenChip({ label, color = 'mint', className }: TokenChipProps) {
  return (
    <motion.span
      className={cn(
        'inline-block cursor-default rounded-lg border-2 border-ink px-2.5 py-1 font-mono text-[0.85rem] font-bold shadow-doodle-sm',
        PASTELS[color],
        className,
      )}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    >
      {label}
    </motion.span>
  );
}

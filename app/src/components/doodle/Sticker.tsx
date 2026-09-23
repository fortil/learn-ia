import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BG = {
  sun: 'bg-sun text-ink',
  pink: 'bg-pink text-ink',
  mint: 'bg-mint text-ink',
  peach: 'bg-peach text-ink',
  coral: 'bg-coral text-white',
  teal: 'bg-teal text-white',
  lilac: 'bg-lilac text-white',
  paper: 'bg-paper text-ink',
} as const;

interface StickerProps {
  children: ReactNode;
  color?: keyof typeof BG;
  /** degrees of rotation, -8..8 looks best */
  rotate?: number;
  className?: string;
  /** pop-in animation on mount/view */
  pop?: boolean;
  delay?: number;
}

/** Rotated badge with ink border and hard offset shadow (pegatina). */
export default function Sticker({
  children,
  color = 'sun',
  rotate = -4,
  className,
  pop = false,
  delay = 0,
}: StickerProps) {
  const inner = (
    <span
      className={cn(
        'inline-block rounded-full border-[3px] border-ink px-4 py-1.5 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] shadow-doodle-sm',
        BG[color],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
  if (!pop) return inner;
  return (
    <motion.span
      className="inline-block"
      initial={{ scale: 0, rotate: rotate * 2 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ type: 'spring', stiffness: 320, damping: 17, delay }}
    >
      {inner}
    </motion.span>
  );
}

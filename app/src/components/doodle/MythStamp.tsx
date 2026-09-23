import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const VARIANTS = {
  mito: 'border-coral-deep text-coral-deep',
  verdad: 'border-teal-deep text-teal-deep',
  neutral: 'border-ink text-ink',
} as const;

interface MythStampProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  rotate?: number;
  className?: string;
  delay?: number;
}

/** Circular rotated stamp ("MITO" / "VERDAD") that slams down with a mini-shake. */
export default function MythStamp({
  children,
  variant = 'mito',
  rotate = -12,
  className,
  delay = 0,
}: MythStampProps) {
  return (
    <motion.span
      className={cn(
        'inline-flex items-center justify-center rounded-full border-4 border-dashed px-5 py-2 font-mono text-sm font-bold uppercase tracking-[0.14em]',
        VARIANTS[variant],
        className,
      )}
      initial={{ scale: 3, opacity: 0, rotate: rotate * 2 }}
      whileInView={{
        scale: 1,
        opacity: 1,
        rotate,
        x: [0, -4, 4, -2, 0],
      }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{
        scale: { type: 'spring', stiffness: 380, damping: 16, delay },
        opacity: { duration: 0.15, delay },
        rotate: { type: 'spring', stiffness: 380, damping: 16, delay },
        x: { duration: 0.2, delay: delay + 0.25 },
      }}
    >
      {children}
    </motion.span>
  );
}

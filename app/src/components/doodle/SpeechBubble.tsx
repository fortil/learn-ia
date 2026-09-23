import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';

interface SpeechBubbleProps {
  children: ReactNode;
  /** which side the little tail points to */
  tail?: 'left' | 'right' | 'bottom-left' | 'bottom-right';
  /** Preguntín image variant shown next to the bubble (optional) */
  mascot?: 'preguntin' | 'preguntin-pensando' | 'preguntin-fiesta' | null;
  className?: string;
  delay?: number;
}

/** Preguntín speech bubble: doodle border + little tail, pops in with a spring. */
export default function SpeechBubble({
  children,
  tail = 'bottom-left',
  mascot = 'preguntin',
  className,
  delay = 0,
}: SpeechBubbleProps) {
  const { t } = useLanguage();
  const tailSvg = (
    <svg
      viewBox="0 0 30 26"
      aria-hidden="true"
      className={cn(
        'absolute h-6 w-7 text-white',
        tail === 'bottom-left' && '-bottom-[14px] left-8',
        tail === 'bottom-right' && '-bottom-[14px] right-8 -scale-x-100',
        tail === 'left' && '-left-[16px] top-1/2 -translate-y-1/2 -rotate-90',
        tail === 'right' && '-right-[16px] top-1/2 -translate-y-1/2 rotate-90',
      )}
    >
      <path
        d="M3 2 C 12 8, 18 14, 15 24 C 22 16, 26 10, 28 2"
        fill="currentColor"
        stroke="#26233F"
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <motion.div
      className={cn('flex items-end gap-3', className)}
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
    >
      {mascot && (
        <img
          src={`/${mascot}.svg`}
          alt={t('common.mascotAlt')}
          className="h-16 w-16 shrink-0 md:h-20 md:w-20"
        />
      )}
      <div className="relative rounded-blob-3 border-[3px] border-ink bg-white px-5 py-3.5 shadow-doodle-sm">
        <p className="text-[0.95rem] font-semibold leading-snug text-ink md:text-base">
          {children}
        </p>
        {tailSvg}
      </div>
    </motion.div>
  );
}

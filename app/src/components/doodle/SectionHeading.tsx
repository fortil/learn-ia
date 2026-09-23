import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Sticker from './Sticker';
import SquiggleUnderline from './SquiggleUnderline';
import type { DoodleColor } from './colors';

interface SectionHeadingProps {
  sticker: string;
  stickerColor?: 'sun' | 'pink' | 'mint' | 'peach' | 'coral' | 'teal' | 'lilac' | 'paper';
  title: ReactNode;
  /** word inside the title is underlined by parent; this prop underlines plain text */
  underlineWord?: string;
  underlineColor?: DoodleColor;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

/** Category sticker + H2 + subtitle, with optional squiggle under a key word. */
export default function SectionHeading({
  sticker,
  stickerColor = 'sun',
  title,
  underlineWord,
  underlineColor = 'coral',
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  let renderedTitle: ReactNode = title;
  if (underlineWord && typeof title === 'string' && title.includes(underlineWord)) {
    const [before, after] = title.split(underlineWord);
    renderedTitle = (
      <>
        {before}
        <span className="relative inline-block">
          {underlineWord}
          <SquiggleUnderline
            color={underlineColor}
            className="absolute -bottom-1 left-0"
          />
        </span>
        {after}
      </>
    );
  }
  return (
    <motion.div
      className={cn(
        'mb-12 flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Sticker color={stickerColor} rotate={-3} pop>
        {sticker}
      </Sticker>
      <h2 className="max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
        {renderedTitle}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-xl font-bold text-ink-soft">{subtitle}</p>
      )}
    </motion.div>
  );
}

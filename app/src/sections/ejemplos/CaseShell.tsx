import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sticker from '@/components/doodle/Sticker';
import StationDot from '@/components/doodle/StationDot';
import FiveStops from './FiveStops';

interface CaseShellProps {
  caseNumber: number;
  color: 'coral' | 'sun' | 'teal' | 'lilac';
  icon: LucideIcon;
  timeSticker: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  bg?: string;
  stops: string[];
  /** the mini-interaction card */
  children: ReactNode;
}

const ICON_BG: Record<CaseShellProps['color'], string> = {
  coral: 'bg-coral',
  sun: 'bg-sun',
  teal: 'bg-teal',
  lilac: 'bg-lilac',
};

/** Common layout for each of the 4 real-life cases. */
export default function CaseShell({
  caseNumber,
  color,
  icon: Icon,
  timeSticker,
  title,
  text,
  image,
  imageAlt,
  reverse = false,
  bg = 'bg-paper',
  stops,
  children,
}: CaseShellProps) {
  return (
    <section className={cn('py-20 md:py-28', bg)}>
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={cn(
            'grid items-start gap-10 lg:grid-cols-2 lg:gap-14',
          )}
        >
          {/* illustration column */}
          <motion.div
            className={cn(reverse && 'lg:order-2')}
            initial={{ y: 40, opacity: 0, rotate: reverse ? 2 : -2 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="doodle-card overflow-hidden p-3">
              <img src={image} alt={imageAlt} className="w-full rounded-2xl" loading="lazy" />
            </div>
          </motion.div>

          {/* content column */}
          <div className={cn(reverse && 'lg:order-1')}>
            <div className="flex flex-wrap items-center gap-4">
              <StationDot number={caseNumber} color={color} size={52} />
              <span
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink shadow-doodle-sm',
                  ICON_BG[color],
                  color === 'sun' ? 'text-ink' : 'text-white',
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.75} />
              </span>
              <Sticker color={color === 'sun' ? 'peach' : 'sun'} rotate={3} pop>
                {timeSticker}
              </Sticker>
            </div>
            <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink md:text-4xl">
              {title}
            </h3>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-ink-soft">{text}</p>

            <FiveStops stops={stops} />
          </div>
        </div>

        {/* mini-interaction */}
        <motion.div
          className="mt-12"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

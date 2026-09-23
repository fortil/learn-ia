import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StationDot, Sticker, resolveColor, type DoodleColor } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';

interface StationShellProps {
  id: string;
  number: number;
  color: DoodleColor;
  sticker: string;
  title: ReactNode;
  children: ReactNode;
  dato: string;
  /** extra content under the text column (Preguntín bubbles, etc.) */
  aside?: ReactNode;
  /** the interactive demo, rendered inside the "machine" frame */
  demo: ReactNode;
  machineLabel: string;
  bgTint: string;
}

/**
 * Shared layout for the 5 map stations: on desktop the inner grid stays
 * sticky while the section is ~165vh tall (pin-like feel); text on the left,
 * interactive "machine" (doodle frame with rivets in the station color)
 * on the right. Mobile stacks without pinning.
 */
export default function StationShell({
  id,
  number,
  color,
  sticker,
  title,
  children,
  dato,
  aside,
  demo,
  machineLabel,
  bgTint,
}: StationShellProps) {
  const { t } = useLanguage();
  const c = resolveColor(color);
  return (
    <section
      id={id}
      className="relative scroll-mt-20 transition-colors duration-700 lg:min-h-[165vh]"
      style={{ backgroundColor: bgTint }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:sticky lg:top-[72px] lg:z-10 lg:flex lg:min-h-[calc(100dvh-72px)] lg:items-center lg:py-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* text column */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3">
              <StationDot number={number} color={color} active />
              <Sticker color="paper" rotate={-3} className="bg-white">
                {sticker}
              </Sticker>
            </div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] text-ink">
              {title}
            </h2>
            <div className="space-y-3 text-[1.05rem] leading-[1.7] text-ink-soft">{children}</div>
            <div
              className="w-full rounded-2xl border-[3px] border-ink bg-white p-4 shadow-doodle-sm"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.08em]" style={{ color: c }}>
                {t('mapa.shell.datoLabel')}
              </p>
              <p className="mt-1 text-[0.95rem] font-semibold leading-snug text-ink">{dato}</p>
            </div>
            {aside}
          </motion.div>

          {/* machine column */}
          <motion.div
            initial={{ rotate: -3, scale: 0.92, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="relative"
          >
            <div className="rounded-blob border-[3px] border-ink bg-white shadow-doodle">
              {/* machine header band */}
              <div
                className="relative flex items-center justify-between gap-3 border-b-[3px] border-ink px-5 py-3"
                style={{ backgroundColor: c }}
              >
                <span className="font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white">
                  {machineLabel}
                </span>
                {/* rivets */}
                <span className="flex gap-2" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-3 w-3 rounded-full border-2 border-ink bg-paper" />
                  ))}
                </span>
              </div>
              <div className="relative p-5 md:p-6">{demo}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

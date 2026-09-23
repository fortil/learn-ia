import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { Award, Stamp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressBar, resolveColor } from '@/components/doodle';
import { useLanguage } from '@/i18n/useLanguage';
import { STATION_META } from './stations';

interface PassportProps {
  stamps: boolean[];
  /** bar = compact sticky bar (mobile), card = sticky passport card (desktop) */
  variant: 'bar' | 'card';
}

function StampSlot({ index, stamped, size = 'md' }: { index: number; stamped: boolean; size?: 'md' | 'sm' }) {
  const { t } = useLanguage();
  const meta = STATION_META[index];
  const c = resolveColor(meta.color);
  const dims = size === 'md' ? 'h-14 w-14' : 'h-9 w-9';
  const title = t('mapa.passport.stampTitle')
    .replace('{n}', String(index + 1))
    .replace('{name}', t(meta.nameKey));
  return (
    <div
      className={cn('relative flex items-center justify-center rounded-full border-[3px] border-dashed', dims)}
      style={{ borderColor: stamped ? c : 'rgba(38,35,63,0.3)' }}
      title={title}
    >
      <AnimatePresence>
        {stamped ? (
          <motion.div
            key="stamp"
            className="absolute inset-0 flex items-center justify-center rounded-full border-[3px] border-ink font-display text-lg font-extrabold text-white"
            style={{ backgroundColor: c }}
            initial={{ scale: 3, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {index + 1}
          </motion.div>
        ) : (
          <span className="font-mono text-xs font-bold text-ink/40">{index + 1}</span>
        )}
      </AnimatePresence>
    </div>
  );
}

function DiplomaButton({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.06, 1], opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to="/quiz"
        className={cn(
          'inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun font-display font-extrabold text-ink shadow-doodle-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed',
          compact ? 'px-3 py-1.5 text-[0.8rem]' : 'w-full justify-center px-4 py-2.5 text-[0.95rem]',
        )}
      >
        <Award className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2.75} />
        {t('mapa.passport.diploma')}
      </Link>
    </motion.div>
  );
}

/**
 * "Pasaporte del Viajero": sticky card on the right column (desktop) and a
 * compact sticky bar under the navbar (mobile). Collects the 5 station
 * stamps; reveals the diploma CTA when complete.
 */
export default function Passport({ stamps, variant }: PassportProps) {
  const { t } = useLanguage();
  const done = stamps.filter(Boolean).length;
  const complete = done === 5;

  if (variant === 'bar') {
    return (
      <div className="sticky top-[72px] z-40 border-b-[3px] border-ink bg-paper-deep/95 backdrop-blur-sm xl:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
            <Stamp className="h-4 w-4" strokeWidth={2.5} />
            {t('mapa.passport.barLabel')}
          </span>
          <div className="flex items-center gap-1.5">
            {STATION_META.map((_, i) => (
              <StampSlot key={i} index={i} stamped={stamps[i]} size="sm" />
            ))}
          </div>
          <span className="ml-auto font-mono text-[0.75rem] font-bold text-ink">{done}/5</span>
          {complete && <DiplomaButton compact />}
        </div>
      </div>
    );
  }

  return (
      <motion.aside
        className="sticky top-24 flex w-full max-w-[240px] flex-col gap-4 rounded-blob-2 border-[3px] border-ink bg-white p-5 shadow-doodle"
        animate={complete ? { rotate: [0, -1.5, 1.5, 0] } : {}}
        transition={{ duration: 0.5, repeat: complete ? 2 : 0 }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            {t('mapa.passport.line1')}
            <br />
            {t('mapa.passport.line2')}
          </p>
          <img src="/preguntin.svg" alt="" className="h-10 w-10" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {STATION_META.map((meta, i) => (
            <div key={meta.nameKey} className="flex flex-col items-center gap-1">
              <StampSlot index={i} stamped={stamps[i]} />
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wide text-ink-soft">
                {t(meta.nameKey)}
              </span>
            </div>
          ))}
        </div>

        <ProgressBar value={done / 5} color={complete ? 'sun' : 'teal'} label={`${done}/5 ${t('mapa.passport.stampsUnit')}`} />

        <AnimatePresence>
          {complete ? (
            <DiplomaButton key="diploma" />
          ) : (
            <p key="hint" className="text-center text-[0.8rem] font-semibold leading-snug text-ink-soft">
              {t('mapa.passport.hint')}
            </p>
          )}
        </AnimatePresence>
      </motion.aside>
  );
}

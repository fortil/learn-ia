import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import type { Language } from '@/i18n/translations';
import SquiggleUnderline from './doodle/SquiggleUnderline';

export const NAV_LINKS = [
  { to: '/', labelKey: 'nav.links.inicio' },
  { to: '/mapa', labelKey: 'nav.links.mapa' },
  { to: '/entrenamiento-vs-inferencia', labelKey: 'nav.links.entrenar' },
  { to: '/ejemplos', labelKey: 'nav.links.ejemplos' },
  { to: '/mitos', labelKey: 'nav.links.mitos' },
  { to: '/quiz', labelKey: 'nav.links.quiz' },
  { to: '/fomo', labelKey: 'fomo.nav.label' },
] as const;

const LINK_ROTATIONS = [-1.5, 1, -1, 1.5, -0.5, 1, 1.5];

const LANGUAGES: Language[] = ['es', 'en'];

/** Doodle-styled ES | EN pill switch. */
function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t('nav.languageLabel')}
      className={cn(
        'flex items-center rounded-full border-[3px] border-ink bg-white p-0.5 font-mono text-xs font-bold shadow-doodle-sm',
        className,
      )}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={cn(
            'rounded-full px-2.5 py-1 uppercase tracking-[0.08em] transition-colors',
            language === lang ? 'bg-sun text-ink' : 'text-ink-soft hover:text-ink',
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={t('nav.brandAria')}>
            <img src="/preguntin.svg" alt="" className="h-10 w-10" />
            <span className="font-display text-lg font-extrabold leading-none text-ink md:text-xl">
              El Viaje de
              <br className="hidden sm:block" /> tu Pregunta
            </span>
          </Link>

          <ul className="hidden items-center gap-5 lg:flex">
            {NAV_LINKS.map(({ to, labelKey }) => (
              /* the seventh link only fits the desktop bar from 1280px up */
              <li key={to} className={to === '/fomo' ? 'hidden xl:block' : undefined}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-block text-[0.95rem] font-bold transition-colors',
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(labelKey)}
                      {isActive && (
                        <SquiggleUnderline
                          color="coral"
                          strokeWidth={4}
                          className="absolute -bottom-1.5 left-0"
                          delay={0}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden sm:flex" />
            <Link
              to="/mapa"
              className="hidden items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-5 py-2 font-display text-[0.95rem] font-extrabold text-white shadow-doodle-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-coral-deep hover:shadow-doodle-pressed sm:inline-flex"
            >
              <Compass className="h-4 w-4" strokeWidth={2.75} />
              {t('nav.cta')}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t('nav.openMenu')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-ink bg-sun text-ink shadow-doodle-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-doodle-pressed lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2.75} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* decorative dotted path in background */}
            <svg
              viewBox="0 0 200 1000"
              className="pointer-events-none absolute left-1/2 top-0 h-full w-auto -translate-x-1/2 opacity-20"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M100 20 C 190 90, 20 170, 100 240 C 180 310, 20 390, 100 460 C 180 530, 20 610, 100 680 C 165 735, 60 800, 100 860 C 130 905, 100 940, 100 980"
                stroke="#26233F"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray="12 14"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </svg>
            <div className="flex h-[72px] items-center justify-between border-b-[3px] border-ink px-4 md:px-6">
              <span className="flex items-center gap-2.5">
                <img src="/preguntin.svg" alt="" className="h-10 w-10" />
                <span className="font-display text-xl font-extrabold text-ink">El Viaje de tu Pregunta</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('nav.closeMenu')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-ink bg-coral text-white shadow-doodle-sm"
              >
                <X className="h-5 w-5" strokeWidth={2.75} />
              </button>
            </div>
            <ul className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6">
              {NAV_LINKS.map(({ to, labelKey }, i) => (
                <motion.li
                  key={to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'inline-block font-display text-3xl font-extrabold md:text-4xl',
                      location.pathname === to ? 'text-coral' : 'text-ink',
                    )}
                    style={{ transform: `rotate(${LINK_ROTATIONS[i]}deg)` }}
                  >
                    {t(labelKey)}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + NAV_LINKS.length * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
              >
                <Link
                  to="/mapa"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral px-7 py-3 font-display text-xl font-extrabold text-white shadow-doodle"
                >
                  <Compass className="h-5 w-5" strokeWidth={2.75} />
                  {t('nav.cta')}
                </Link>
              </motion.li>
              <motion.li
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.22 + NAV_LINKS.length * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
              >
                <LanguageToggle className="mt-2" />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

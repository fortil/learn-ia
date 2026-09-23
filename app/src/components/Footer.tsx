import { Link } from 'react-router';
import { Linkedin, Github } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { NAV_LINKS } from './Navbar';

const GLOSSARY_KEYS = ['ia', 'modelo', 'inferencia'] as const;

const SOCIAL_LINKS = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/william-penagos/',
    Icon: Linkedin,
  },
  {
    key: 'github',
    href: 'https://github.com/fortil',
    Icon: Github,
  },
] as const;

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t-[3px] border-ink bg-ink text-paper">
      {/* decorative dotted path with the little car */}
      <svg
        viewBox="0 0 1200 60"
        className="absolute -top-[30px] left-0 h-[60px] w-full"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 C 150 10, 300 50, 450 30 S 750 10, 900 30 S 1150 50, 1200 30"
          stroke="#FFF6E9"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="10 14"
          opacity={0.5}
        />
      </svg>
      <img
        src="/cochecito.svg"
        alt=""
        className="absolute -top-[52px] left-[8%] h-14 w-auto"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <img src="/preguntin.svg" alt="" className="h-12 w-12" />
            <span className="font-display text-xl font-extrabold leading-tight">
              El Viaje de
              <br />
              tu Pregunta
            </span>
          </div>
          <p className="mt-4 text-sm text-paper/70">
            {t('footer.tagline')}
          </p>
          <p className="mt-3 font-mono text-xs font-bold tracking-wide text-paper/80">
            {t('footer.author')}
          </p>
          <div className="mt-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
              {t('footer.socialTitle')}
            </h3>
            <ul className="mt-3 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`footer.social.${key}`)}
                    title={t(`footer.social.${key}`)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-paper/40 text-paper/80 transition-all hover:-rotate-6 hover:border-sun hover:bg-sun hover:text-ink"
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav aria-label={t('footer.siteMapAria')}>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
            {t('footer.siteMapTitle')}
          </h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map(({ to, labelKey }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm font-semibold text-paper/80 transition-colors hover:text-sun"
                >
                  {t(labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-sun">
            {t('footer.glossaryTitle')}
          </h3>
          <dl className="mt-4 space-y-3">
            {GLOSSARY_KEYS.map((key) => (
              <div key={key}>
                <dt className="text-sm font-extrabold text-paper">{t(`footer.glossary.${key}.term`)}</dt>
                <dd className="text-sm text-paper/70">{t(`footer.glossary.${key}.def`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-paper/15 py-5 text-center text-xs text-paper/60">
        {t('footer.finalLine')}
      </div>
    </footer>
  );
}

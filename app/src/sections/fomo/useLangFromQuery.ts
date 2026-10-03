import { useLayoutEffect } from 'react';
import { useLanguage } from '@/i18n/useLanguage';

/**
 * Opens /fomo in the language of the link that brought the reader here:
 * /fomo?lang=en (LinkedIn, X) or ?lang=es (TikTok). Runs before paint, so
 * there is no Spanish flash on English links. Uses only the public
 * setLanguage from the i18n context; the provider persists the choice, and
 * the hero keeps a visible link to switch back.
 */
export function useLangFromQuery() {
  const { setLanguage } = useLanguage();
  useLayoutEffect(() => {
    const lang = new URLSearchParams(window.location.search).get('lang');
    if (lang === 'en' || lang === 'es') setLanguage(lang);
  }, [setLanguage]);
}

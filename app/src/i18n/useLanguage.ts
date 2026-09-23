import { createContext, useContext } from 'react';
import type { Language, TranslationDict } from './translations';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /**
   * Resolve a dot-key (e.g. 'home.hero.title') to a string in the active
   * language. Falls back to Spanish when the key is missing there, and to
   * the raw key when it is missing everywhere.
   */
  t: (key: string) => string;
}

/** Shared between <LanguageProvider> (LanguageContext.tsx) and useLanguage(). */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Resolve a dot-key against a dictionary; undefined when not found. */
export function resolveKey(dict: TranslationDict, key: string): string | undefined {
  let node: string | TranslationDict | undefined = dict;
  for (const part of key.split('.')) {
    if (node === undefined || typeof node === 'string') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return ctx;
}

import es from './es';
import en from './en';

export type Language = 'es' | 'en';

/**
 * Nested dictionary of translation strings. Leaves are strings; any
 * intermediate node is another TranslationDict. Word lists for per-word
 * animations are stored as single space-separated strings (split in the
 * component — see README.md).
 */
export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

/**
 * All translations, keyed by language. `es` is the source of truth and the
 * runtime fallback: any key missing in `en` resolves to Spanish.
 */
export const translations: Record<Language, TranslationDict> = { es, en };

import { useMemo } from 'react';
import { useLanguage } from '@/i18n/useLanguage';

export type Bet = 'mito' | 'verdad';

export interface Myth {
  id: number;
  statement: string;
  answer: Bet;
  /** small qualifier next to the stamp, e.g. "(casi siempre)" */
  note?: string;
  explanation: string;
  analogy: string;
}

/** Language-independent truth data for each myth card. */
const MYTH_META: ReadonlyArray<{ id: number; answer: Bet }> = [
  { id: 1, answer: 'mito' },
  { id: 2, answer: 'mito' },
  { id: 3, answer: 'mito' },
  { id: 4, answer: 'verdad' },
  { id: 5, answer: 'verdad' },
  { id: 6, answer: 'mito' },
];

export const TOTAL_MYTHS = MYTH_META.length;

/**
 * Myth cards with strings resolved from the active language's `mitos`
 * dictionary (`mitos.myths.m<N>.*`). Re-resolves on language switch.
 */
export function useMyths(): Myth[] {
  const { t } = useLanguage();
  return useMemo(
    () =>
      MYTH_META.map(({ id, answer }) => {
        const note = t(`mitos.myths.m${id}.note`);
        return {
          id,
          answer,
          statement: t(`mitos.myths.m${id}.statement`),
          explanation: t(`mitos.myths.m${id}.explanation`),
          analogy: t(`mitos.myths.m${id}.analogy`),
          ...(note ? { note } : {}),
        };
      }),
    [t],
  );
}

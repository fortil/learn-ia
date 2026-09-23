import { useMemo } from 'react';
import type { DoodleColor } from '@/components/doodle/colors';
import { useLanguage } from '@/i18n/useLanguage';

export interface QuizQuestion {
  id: number;
  question: string;
  /** station color token */
  color: DoodleColor;
  options: string[];
  /** index of the correct option */
  correct: number;
  why: string;
  ref: { label: string; to: string };
}

/** Language-independent truth data for each question. */
const QUESTION_META: ReadonlyArray<{
  id: number;
  color: DoodleColor;
  correct: number;
  refTo: string;
}> = [
  { id: 1, color: 'coral', correct: 1, refTo: '/mapa' },
  { id: 2, color: 'sun', correct: 1, refTo: '/mapa' },
  { id: 3, color: 'lilac', correct: 2, refTo: '/mapa' },
  { id: 4, color: 'teal', correct: 1, refTo: '/entrenamiento-vs-inferencia' },
  { id: 5, color: 'pink', correct: 2, refTo: '/ejemplos' },
];

export const TOTAL_QUESTIONS = QUESTION_META.length;

/**
 * Quiz questions with strings resolved from the active language's `quiz`
 * dictionary (`quiz.questions.q<N>.*`). Re-resolves on language switch.
 */
export function useQuestions(): QuizQuestion[] {
  const { t } = useLanguage();
  return useMemo(
    () =>
      QUESTION_META.map(({ id, color, correct, refTo }) => ({
        id,
        color,
        correct,
        question: t(`quiz.questions.q${id}.question`),
        options: [
          t(`quiz.questions.q${id}.o1`),
          t(`quiz.questions.q${id}.o2`),
          t(`quiz.questions.q${id}.o3`),
          t(`quiz.questions.q${id}.o4`),
        ],
        why: t(`quiz.questions.q${id}.why`),
        ref: { label: t(`quiz.questions.q${id}.refLabel`), to: refTo },
      })),
    [t],
  );
}

export const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Fisher–Yates shuffle. */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

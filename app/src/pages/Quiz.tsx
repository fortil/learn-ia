import { useCallback, useMemo, useState } from 'react';
import QuizCover from '@/sections/quiz/QuizCover';
import QuizGame from '@/sections/quiz/QuizGame';
import QuizResult from '@/sections/quiz/QuizResult';
import { TOTAL_QUESTIONS, shuffle, useQuestions } from '@/sections/quiz/quizData';

type Phase = 'cover' | 'playing' | 'result';

/**
 * Página "Mini-Quiz" (/quiz): 5 preguntas con feedback educativo inmediato,
 * barra de progreso por estaciones, insignia final según aciertos, revisión
 * en acordeones y reinicio con preguntas barajadas.
 */
export default function Quiz() {
  const allQuestions = useQuestions();
  const [phase, setPhase] = useState<Phase>('cover');
  const [order, setOrder] = useState<number[]>(() =>
    Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i),
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const questions = useMemo(() => order.map((i) => allQuestions[i]), [order, allQuestions]);
  const score = useMemo(
    () => allQuestions.filter((q) => answers[q.id] === q.correct).length,
    [answers, allQuestions],
  );

  const start = useCallback(() => {
    setOrder(shuffle(Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i)));
    setCurrent(0);
    setAnswers({});
    setPhase('playing');
  }, []);

  const handleAnswer = useCallback((questionId: number, optionIndex: number) => {
    setAnswers((prev) =>
      questionId in prev ? prev : { ...prev, [questionId]: optionIndex },
    );
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((c) => {
      if (c + 1 < TOTAL_QUESTIONS) return c + 1;
      setPhase('result');
      return c;
    });
  }, []);

  if (phase === 'cover') return <QuizCover onStart={start} />;
  if (phase === 'result') {
    return (
      <QuizResult
        questions={questions}
        answers={answers}
        score={score}
        onRestart={start}
      />
    );
  }
  return (
    <QuizGame
      questions={questions}
      current={current}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNext}
    />
  );
}

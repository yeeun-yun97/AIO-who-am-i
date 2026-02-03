'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { questions, TOTAL_QUESTIONS } from '@/data/questions';
import ProgressBar from '@/components/ui/ProgressBar';
import QuestionCard from '@/components/quiz/QuestionCard';
import Button from '@/components/ui/Button';

export default function QuizPage() {
  const router = useRouter();
  const { state, selectOption, nextQuestion, getCurrentAnswer } = useQuiz();
  const { currentIndex, isCompleted } = state;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = getCurrentAnswer();

  useEffect(() => {
    if (isCompleted) {
      router.push('/result');
    }
  }, [isCompleted, router]);

  const handleNext = () => {
    if (currentAnswer) {
      nextQuestion();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col px-4 py-8">
      <div className="w-full max-w-lg mx-auto mb-8">
        <ProgressBar current={currentIndex + 1} total={TOTAL_QUESTIONS} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <QuestionCard
          question={currentQuestion}
          selectedOptionKey={currentAnswer?.optionKey}
          onSelectOption={selectOption}
        />

        <div className="w-full max-w-lg mx-auto mt-8">
          <Button size="large" onClick={handleNext} disabled={!currentAnswer}>
            {currentIndex === TOTAL_QUESTIONS - 1 ? '결과 보기' : '다음'}
          </Button>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { CATEGORIES } from '@/types/quiz';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CategoryScore from '@/components/result/CategoryScore';

export default function ResultPage() {
  const { calculatePercentages, reset, state } = useQuiz();
  const [percentages, setPercentages] = useState<ReturnType<typeof calculatePercentages> | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (state.answers.length > 0) {
      setPercentages(calculatePercentages());
    }
  }, [state.answers, calculatePercentages]);

  if (!mounted) {
    return null;
  }

  if (state.answers.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-xl font-bold text-[#191F28] mb-4">아직 테스트를 완료하지 않았어요</h1>
          <p className="text-[#8B95A1] mb-8">테스트를 먼저 진행해주세요.</p>
          <Link href="/" onClick={reset}>
            <Button size="large">테스트 시작하기</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00C471]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#00C471]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] mb-2">테스트 완료!</h1>
          <p className="text-[#8B95A1]">나의 성향 분석 결과입니다</p>
        </div>

        <Card className="mb-8">
          <h2 className="text-lg font-bold text-[#191F28] mb-6">카테고리별 점수</h2>
          {percentages &&
            CATEGORIES.map((category, index) => (
              <CategoryScore
                key={category.id}
                category={category}
                percentage={percentages[category.id]}
                delay={index * 100}
              />
            ))}
        </Card>

        <Link href="/" onClick={reset}>
          <Button size="large" variant="secondary">
            다시 테스트하기
          </Button>
        </Link>
      </div>
    </main>
  );
}

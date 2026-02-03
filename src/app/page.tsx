'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useQuiz } from '@/contexts/QuizContext';

export default function Home() {
  const { reset } = useQuiz();

  const handleStart = () => {
    reset();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full text-center p-8 md:p-12">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3182F6]/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#3182F6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] mb-3">
            나를 알아가는 여정
          </h1>
          <p className="text-base text-[#8B95A1] leading-relaxed">
            20개의 질문으로 발견하는 나의 성향
          </p>
        </div>

        <div className="bg-[#F4F4F4] rounded-xl p-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-[#8B95A1]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">약 3-5분 소요</span>
          </div>
        </div>

        <Link href="/quiz" onClick={handleStart} className="block w-full">
          <Button size="large">시작하기</Button>
        </Link>

        <p className="mt-6 text-xs text-[#B0B8C1]">
          선택한 답변은 저장되지 않으며, 결과는 즉시 확인할 수 있습니다.
        </p>
      </Card>
    </main>
  );
}

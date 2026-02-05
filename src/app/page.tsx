'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DateSelect from '@/components/ui/DateSelect';
import ProgressBar from '@/components/ui/ProgressBar';
import QuestionCard from '@/components/quiz/QuestionCard';
import ResultClient from '@/components/result/ResultClient';
import { useQuiz } from '@/contexts/QuizContext';
import { findOrCreateSession } from '@/lib/supabase';
import { questions, TOTAL_QUESTIONS } from '@/data/questions';

type Phase = 'intro' | 'quiz' | 'result';

export default function Home() {
  const {
    reset,
    setUserInfo,
    setSessionId,
    setSavedResult,
    state,
    selectOption,
    nextQuestion,
    getCurrentAnswer,
  } = useQuiz();

  const [phase, setPhase] = useState<Phase>('intro');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim() !== '' && birthDate !== '';

  // 퀴즈 관련 변수
  const { currentIndex, isCompleted } = state;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = getCurrentAnswer();

  // 퀴즈 완료 시 결과 화면으로 전환
  useEffect(() => {
    if (isCompleted && phase === 'quiz') {
      window.history.replaceState(null, '', '/');
      setPhase('result');
    }
  }, [isCompleted, phase]);

  // 퀴즈/결과 화면에서 뒤로가기 방지
  useEffect(() => {
    if (phase !== 'intro') {
      const handlePopState = () => {
        window.history.pushState(null, '', '/');
      };

      window.history.pushState(null, '', '/');
      window.addEventListener('popstate', handlePopState);

      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [phase]);

  const handleStart = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    try {
      // Supabase에서 세션 확인/생성
      const { session, existingResult } = await findOrCreateSession(
        name.trim(),
        birthDate
      );

      // 세션 ID 저장
      setSessionId(session.id);

      // 사용자 정보 설정
      setUserInfo({
        name: name.trim(),
        birthDate,
      });

      // 기존 결과가 있으면 결과 화면으로 이동
      if (existingResult && existingResult.mbti_result) {
        setSavedResult({
          mbti_result: existingResult.mbti_result,
          saju_result: existingResult.saju_result as Record<string, unknown>,
          tci_scores: existingResult.tci_scores as Record<string, unknown>,
          value_scores: existingResult.value_scores as Record<string, unknown>,
        });
        setPhase('result');
      } else {
        // 새로 시작
        reset();
        setSessionId(session.id);
        setUserInfo({
          name: name.trim(),
          birthDate,
        });
        setPhase('quiz');
      }
    } catch (error) {
      console.error('세션 생성 실패:', error);
      // 에러 시에도 로컬로 진행
      reset();
      setUserInfo({
        name: name.trim(),
        birthDate,
      });
      setPhase('quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentAnswer) {
      nextQuestion();
    }
  };

  // 결과 화면
  if (phase === 'result') {
    return <ResultClient />;
  }

  // 퀴즈 화면
  if (phase === 'quiz') {
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

  // 시작 화면 (intro)
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 md:p-12">
        <div className="text-center mb-8">
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
            45개의 질문으로 알아보는 MBTI와 기질
          </p>
        </div>

        {/* 사용자 정보 입력 폼 */}
        <div className="space-y-4 mb-8">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#191F28] mb-2">
              이름 <span className="text-[#F04452]">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 bg-[#F4F4F4] border-2 border-transparent rounded-xl text-[#191F28] placeholder-[#B0B8C1] focus:bg-white focus:border-[#3182F6] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-2">
              생년월일 <span className="text-[#F04452]">*</span>
            </label>
            <DateSelect value={birthDate} onChange={setBirthDate} />
          </div>

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
            <span className="text-sm">약 5-7분 소요</span>
          </div>
        </div>

        <Button size="large" onClick={handleStart} disabled={!isFormValid || isLoading}>
          {isLoading ? '확인 중...' : '시작하기'}
        </Button>

        <p className="mt-6 text-xs text-[#B0B8C1] text-center">
          이미 테스트한 적이 있다면 결과를 바로 확인할 수 있습니다.
        </p>
      </Card>
    </main>
  );
}

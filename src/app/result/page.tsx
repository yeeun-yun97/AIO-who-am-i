'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { MBTIResult, TCIResult, MBTI_DIMENSIONS, TCI_DIMENSIONS } from '@/types/quiz';
import { calculateSaju, SajuResult } from '@/lib/saju';
import { saveQuizResult } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TCIScore from '@/components/result/TCIScore';
import SajuCard from '@/components/result/SajuCard';

export default function ResultPage() {
  const { calculateMBTI, calculateTCI, reset, state } = useQuiz();
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [tciResult, setTciResult] = useState<TCIResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const savedRef = useRef(false);

  // 사주 계산
  const sajuResult = useMemo<SajuResult | null>(() => {
    if (state.userInfo?.birthDate) {
      return calculateSaju(state.userInfo.birthDate, state.userInfo.birthTime);
    }
    return null;
  }, [state.userInfo]);

  // 저장된 결과가 있으면 사용
  useEffect(() => {
    setMounted(true);

    // 저장된 결과가 있으면 복원
    if (state.savedResult) {
      // MBTI 결과 복원
      const savedMbti = state.savedResult.mbti_result;
      const savedTci = state.savedResult.tci_scores as unknown as TCIResult;

      if (savedMbti) {
        // 간단하게 타입만 표시 (상세 점수는 저장된 게 없으면 기본값)
        setMbtiResult({
          type: savedMbti,
          scores: { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 },
          dimensions: {
            IE: { dominant: savedMbti[0] as 'E' | 'I' | 'Ambivert', percentage: 75 },
            NS: { dominant: savedMbti[1] as 'N' | 'S' | '중간', percentage: 75 },
            TF: { dominant: savedMbti[2] as 'T' | 'F' | '중간', percentage: 75 },
            JP: { dominant: savedMbti[3] as 'J' | 'P' | '중간', percentage: 75 },
          },
        });
      }

      if (savedTci) {
        setTciResult(savedTci);
      }
      return;
    }

    // 새로 계산
    if (state.answers.length > 0) {
      const mbti = calculateMBTI();
      const tci = calculateTCI();
      setMbtiResult(mbti);
      setTciResult(tci);

      // 결과 저장 (한 번만)
      if (state.sessionId && !savedRef.current) {
        savedRef.current = true;
        const saju = state.userInfo?.birthDate
          ? calculateSaju(state.userInfo.birthDate, state.userInfo.birthTime)
          : null;

        saveQuizResult(
          state.sessionId,
          mbti.type,
          saju as unknown as Record<string, unknown>,
          tci as unknown as Record<string, unknown>
        ).catch((err) => console.error('결과 저장 실패:', err));
      }
    }
  }, [state.answers, state.savedResult, state.sessionId, state.userInfo, calculateMBTI, calculateTCI]);

  if (!mounted) {
    return null;
  }

  // 테스트 완료 안 했고, 저장된 결과도 없는 경우
  if (state.answers.length === 0 && !state.savedResult) {
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

  const getDimensionLabel = (dimension: string, mbti: MBTIResult) => {
    switch (dimension) {
      case 'IE':
        return {
          left: 'I (내향)',
          right: 'E (외향)',
          dominant: mbti.dimensions.IE.dominant,
          percentage: mbti.dimensions.IE.percentage,
        };
      case 'NS':
        return {
          left: 'S (감각)',
          right: 'N (직관)',
          dominant: mbti.dimensions.NS.dominant,
          percentage: mbti.dimensions.NS.percentage,
        };
      case 'TF':
        return {
          left: 'F (감정)',
          right: 'T (사고)',
          dominant: mbti.dimensions.TF.dominant,
          percentage: mbti.dimensions.TF.percentage,
        };
      case 'JP':
        return {
          left: 'P (인식)',
          right: 'J (판단)',
          dominant: mbti.dimensions.JP.dominant,
          percentage: mbti.dimensions.JP.percentage,
        };
      default:
        return { left: '', right: '', dominant: '', percentage: 50 };
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* 헤더 */}
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
          {state.userInfo && (
            <p className="text-lg font-semibold text-[#3182F6] mb-2">{state.userInfo.name}님의 결과</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] mb-2">테스트 완료!</h1>
          {state.userInfo && (
            <p className="text-sm text-[#8B95A1]">
              {state.userInfo.birthDate.replace(/-/g, '.')}
              {state.userInfo.birthTime && ` ${state.userInfo.birthTime}`}
              {state.userInfo.birthTime === null && ' (시간 미상)'}
            </p>
          )}
        </div>

        {/* 사주 정보 */}
        {sajuResult && <SajuCard saju={sajuResult} />}

        {/* MBTI 결과 */}
        {mbtiResult && (
          <Card className="mb-6">
            <div className="text-center mb-6">
              <p className="text-sm text-[#8B95A1] mb-2">나의 MBTI 유형</p>
              <h2 className="text-4xl font-bold text-[#3182F6]">{mbtiResult.type}</h2>
            </div>

            <div className="space-y-4">
              {MBTI_DIMENSIONS.map((dim, index) => {
                const labels = getDimensionLabel(dim.id, mbtiResult);
                const isRight = ['E', 'N', 'T', 'J'].includes(labels.dominant as string);

                return (
                  <div key={dim.id} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[#191F28]">{dim.name}</span>
                      <span className="text-sm font-bold text-[#3182F6]">
                        {labels.dominant === 'Ambivert' || labels.dominant === '중간'
                          ? labels.dominant
                          : `${labels.dominant} (${labels.percentage}%)`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8B95A1] w-16 text-right">{labels.left}</span>
                      <div className="flex-1 h-2 bg-[#F4F4F4] rounded-full overflow-hidden relative">
                        <div
                          className="absolute top-0 h-full bg-[#3182F6] rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${labels.percentage}%`,
                            left: isRight ? 'auto' : 0,
                            right: isRight ? 0 : 'auto',
                            transitionDelay: `${index * 100}ms`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[#8B95A1] w-16">{labels.right}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* TCI 결과 */}
        {tciResult && (
          <Card className="mb-8">
            <h2 className="text-lg font-bold text-[#191F28] mb-6">기질 성향 (TCI)</h2>
            {TCI_DIMENSIONS.map((dim, index) => {
              const result = tciResult[dim.id as keyof TCIResult];
              return (
                <TCIScore
                  key={dim.id}
                  name={dim.name}
                  level={result.level}
                  description={result.description}
                  delay={index * 100 + 400}
                />
              );
            })}
          </Card>
        )}

        <Link href="/" onClick={reset} className="block w-full">
          <Button size="large" variant="secondary">
            다시 테스트하기
          </Button>
        </Link>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { MBTIResult, TCIResult, ValueResult, MBTI_DIMENSIONS, TCI_DIMENSIONS } from '@/types/quiz';
import { calculateSaju, SajuResult } from '@/lib/saju';
import { saveQuizResult, saveSharedResult, SharedResult } from '@/lib/supabase';
import { maskName } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TCIScore from '@/components/result/TCIScore';
import SajuCard from '@/components/result/SajuCard';
import ZodiacCard from '@/components/result/ZodiacCard';
import StarSignCard from '@/components/result/StarSignCard';
import ValueCard from '@/components/result/ValueCard';
import results from '@/data/results.json';
import MBTIScore from '@/components/result/MBTIScore';

interface ResultClientProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
}

export default function ResultClient({ sharedResult, sharedSessionId }: ResultClientProps) {
  const { calculateMBTI, calculateTCI, calculateValue, reset, state } = useQuiz();
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [tciResult, setTciResult] = useState<TCIResult | null>(null);
  const [valueResult, setValueResult] = useState<ValueResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');
  const [sharedResultId, setSharedResultId] = useState<string | null>(null);
  const savedRef = useRef(false);

  // 공유된 결과인지 확인
  const isSharedView = !!sharedResult;

  // 사주 계산 (공유 결과면 공유 데이터에서, 아니면 state에서)
  const sajuResult = useMemo<SajuResult | null>(() => {
    if (isSharedView && sharedResult?.sajuResult) {
      return sharedResult.sajuResult as unknown as SajuResult;
    }
    if (state.userInfo?.birthDate) {
      return calculateSaju(state.userInfo.birthDate, null);
    }
    return null;
  }, [isSharedView, sharedResult, state.userInfo]);

  // 사용자 정보 (공유 결과면 공유 데이터에서)
  const displayUserInfo = useMemo(() => {
    if (isSharedView && sharedResult) {
      return {
        name: sharedResult.userName,
        birthDate: sharedResult.birthDate,
      };
    }
    return state.userInfo;
  }, [isSharedView, sharedResult, state.userInfo]);

  // 공유할 세션 ID
  const sessionIdForShare = sharedSessionId || state.sessionId;

  // 저장된 결과가 있으면 사용
  useEffect(() => {
    setMounted(true);

    // 공유된 결과 표시
    if (isSharedView && sharedResult) {
      if (sharedResult.mbtiResult) {
        setMbtiResult({
          type: sharedResult.mbtiResult,
          scores: { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 },
          dimensions: {
            IE: { dominant: sharedResult.mbtiResult[0] as 'E' | 'I' | 'Ambivert', percentage: 75 },
            NS: { dominant: sharedResult.mbtiResult[1] as 'N' | 'S' | '중간', percentage: 75 },
            TF: { dominant: sharedResult.mbtiResult[2] as 'T' | 'F' | '중간', percentage: 75 },
            JP: { dominant: sharedResult.mbtiResult[3] as 'J' | 'P' | '중간', percentage: 75 },
          },
        });
      }
      if (sharedResult.tciScores) {
        setTciResult(sharedResult.tciScores as unknown as TCIResult);
      }
      if (sharedResult.valueScores) {
        setValueResult(sharedResult.valueScores as unknown as ValueResult);
      }
      return;
    }

    // 저장된 결과가 있으면 복원
    if (state.savedResult) {
      const savedMbti = state.savedResult.mbti_result;
      const savedTci = state.savedResult.tci_scores as unknown as TCIResult;
      const savedValue = state.savedResult.value_scores as unknown as ValueResult;

      if (savedMbti) {
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

      if (savedValue) {
        setValueResult(savedValue);
      }
      return;
    }

    // 새로 계산
    if (state.answers.length > 0) {
      const mbti = calculateMBTI();
      const tci = calculateTCI();
      const value = calculateValue();
      setMbtiResult(mbti);
      setTciResult(tci);
      setValueResult(value);

      // 결과 저장 (한 번만)
      if (state.sessionId && !savedRef.current) {
        savedRef.current = true;
        const saju = state.userInfo?.birthDate
          ? calculateSaju(state.userInfo.birthDate, null)
          : null;

        saveQuizResult(
          state.sessionId,
          mbti.type,
          saju as unknown as Record<string, unknown>,
          tci as unknown as Record<string, unknown>,
          value as unknown as Record<string, unknown>
        )
          .then((quizResult) => {
            // 공유 결과 저장
            const userName = state.userInfo?.name || '익명';
            const maskedName = maskName(userName);
            const title = '풍부한 감성과 깊은 사고력의 소유자!';
            const description = `${userName}님은 내면의 풍부한 감성과 깊은 사고력을 가진 분입니다. 새로운 아이디어와 가능성에 열려 있으면서도, 중요한 결정을 내릴 때는 신중하게 여러 각도에서 검토하는 성향을 보입니다.`;

            return saveSharedResult(
              quizResult.id,
              maskedName,
              title,
              description
            );
          })
          .then((sharedResult) => {
            if (sharedResult) {
              setSharedResultId(sharedResult.id);
            }
          })
          .catch((err) => console.error('결과 저장 실패:', err));
      }
    }
  }, [state.answers, state.savedResult, state.sessionId, state.userInfo, calculateMBTI, calculateTCI, calculateValue, isSharedView, sharedResult]);

  // 공유하기 버튼 핸들러
  const handleShare = async () => {
    const idForShare = sharedResultId || sessionIdForShare;
    if (!idForShare) return;

    const shareUrl = `${window.location.origin}/results?id=${idForShare}`;

    // Web Share API 지원 시 사용
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayUserInfo?.name}님의 심리테스트 결과`,
          text: mbtiResult ? `MBTI: ${mbtiResult.type}` : '심리테스트 결과를 확인해보세요!',
          url: shareUrl,
        });
        return;
      } catch {
        // 사용자가 취소하거나 실패하면 클립보드 복사로 폴백
      }
    }

    // 클립보드 복사
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  if (!mounted) {
    return null;
  }

  // 공유 링크로 들어왔는데 결과가 없는 경우
  if (isSharedView && !sharedResult) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-xl font-bold text-[#191F28] mb-4">결과를 찾을 수 없어요</h1>
          <p className="text-[#8B95A1] mb-8">링크가 잘못되었거나 결과가 삭제되었어요.</p>
          <Link href="/" onClick={reset}>
            <Button size="large">테스트 시작하기</Button>
          </Link>
        </Card>
      </main>
    );
  }

  // 테스트 완료 안 했고, 저장된 결과도 없고, 공유 결과도 없는 경우
  if (state.answers.length === 0 && !state.savedResult && !isSharedView) {
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
        {/* 헤더 + 탭 */}
        <div className="flex items-center justify-between mb-6">
          {displayUserInfo && (
            <h1 className="text-2xl font-bold text-[#191F28] flex items-center gap-2">
              <span className="text-[#3182F6]">✦</span>
              {displayUserInfo.name}님의 결과
            </h1>
          )}

          {/* 탭 - iOS 스타일 세그먼트 컨트롤 */}
          <div className="inline-flex bg-[#F2F2F7] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-1.5 px-3 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'summary'
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
              }`}
            >
              분석
              <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
                activeTab === 'summary'
                  ? 'bg-[#3182F6] text-white'
                  : 'bg-[#B0B8C1] text-white'
              }`}>AI</span>
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                activeTab === 'detail'
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
              }`}
            >
              상세
            </button>
          </div>
        </div>

        {/* 요약 탭 */}
        {activeTab === 'summary' && (
          <div className="mb-6">
          {/* 이미지 - 전체 너비 */}
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-2xl mb-4 flex items-center justify-center">
            <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* 분석 텍스트 */}
          <div className="bg-[#FAFAFA] rounded-2xl p-5 mb-4">
            <h3 className="text-lg font-bold text-[#191F28] mb-3">
              풍부한 감성과 깊은 사고력의 소유자!
            </h3>
            <p className="text-[#333D4B] leading-7 text-base">
              {displayUserInfo?.name}님은 내면의 풍부한 감성과 깊은 사고력을 가진 분입니다.
              새로운 아이디어와 가능성에 열려 있으면서도, 중요한 결정을 내릴 때는 신중하게
              여러 각도에서 검토하는 성향을 보입니다.
            </p>
            <p className="text-[#333D4B] leading-7 text-base mt-4">
              타인의 감정에 공감하는 능력이 뛰어나며, 조화로운 관계를 중시합니다.
              창의적인 문제 해결 능력과 직관력이 강점이며, 의미 있는 일에 깊이 몰입할 때
              가장 큰 만족감을 느낍니다.
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <Link
              href="/results"
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#4E5968] bg-[#F4F4F4] hover:bg-[#E5E8EB] transition-colors text-center"
            >
              다른 결과 구경하기
            </Link>
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#3182F6] hover:bg-[#1B64DA] transition-colors"
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  공유하기
                </span>
              )}
            </button>
          </div>
          </div>
        )}

        {/* 자세히 탭 */}
        {activeTab === 'detail' && (
          <>
            {/* 동물띠 */}
            {sajuResult && <ZodiacCard coloredZodiac={sajuResult.coloredZodiac} />}

        {/* 별자리 */}
        {sajuResult?.zodiacSign && <StarSignCard zodiacSign={sajuResult.zodiacSign} />}

        {/* 사주 팔자 */}
        {sajuResult && <SajuCard saju={sajuResult} />}

        {/* MBTI 결과 */}
        {mbtiResult && (
          <Card className="mb-6">
            <h2 className="text-lg font-bold text-[#191F28] mb-4">MBTI</h2>
            <p className="text-2xl font-bold text-[#3182F6] mb-3">{mbtiResult.type}</p>
            {results.mbti[mbtiResult.type as keyof typeof results.mbti] && (
              <p className="text-sm text-[#4E5968] mb-6 leading-relaxed">
                {results.mbti[mbtiResult.type as keyof typeof results.mbti]}
              </p>
            )}

            {MBTI_DIMENSIONS.map((dim, index) => {
              const labels = getDimensionLabel(dim.id, mbtiResult);
              return (
                <MBTIScore
                  key={dim.id}
                  name={dim.name}
                  leftLabel={labels.left}
                  rightLabel={labels.right}
                  dominant={labels.dominant as string}
                  percentage={labels.percentage}
                  delay={index * 100}
                />
              );
            })}
          </Card>
        )}

        {/* TCI 결과 */}
        {tciResult && (
          <Card className="mb-6">
            <h2 className="text-lg font-bold text-[#191F28] mb-6">TCI</h2>
            {TCI_DIMENSIONS.map((dim, index) => {
              const result = tciResult[dim.id as keyof TCIResult];
              return (
                <TCIScore
                  key={dim.id}
                  dimensionId={dim.id}
                  name={dim.name}
                  level={result.level}
                  delay={index * 100 + 400}
                />
              );
            })}
          </Card>
        )}

        {/* 가치관 결과 */}
            {/* 가치관 결과 */}
            {valueResult && <ValueCard value={valueResult} />}
          </>
        )}
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { MBTIResult, TCIResult, ValueResult, getTCIDimensions } from '@/types/quiz';
import { calculateSaju, SajuResult } from '@/lib/saju';
import { saveQuizResult, saveSharedResult, generateAIAnalysis, AIAnalysisResponse, SharedResult } from '@/lib/supabase';
import { maskName } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TCIScore from '@/components/result/TCIScore';
import SajuCard from '@/components/result/SajuCard';
import ZodiacCard from '@/components/result/ZodiacCard';
import StarSignCard from '@/components/result/StarSignCard';
import ValueCard from '@/components/result/ValueCard';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';
import MBTIScore from '@/components/result/MBTIScore';
import { Locale } from '@/i18n/config';

interface ResultClientProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
}

export default function ResultClient({ sharedResult, sharedSessionId }: ResultClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const resultsData = locale === 'en' ? resultsEn : results;

  const { calculateMBTI, calculateTCI, calculateValue, reset, state } = useQuiz();
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [tciResult, setTciResult] = useState<TCIResult | null>(null);
  const [valueResult, setValueResult] = useState<ValueResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('detail');
  const [sharedResultId, setSharedResultId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [hasSeenAiAnalysis, setHasSeenAiAnalysis] = useState(false);
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

  // 탭 전환 핸들러
  const handleTabChange = (tab: 'summary' | 'detail') => {
    setActiveTab(tab);
    if (tab === 'summary') {
      setHasSeenAiAnalysis(true);
    }
  };

  // 저장된 결과가 있으면 사용
  useEffect(() => {
    setMounted(true);

    // 공유된 결과 표시 (이미 AI가 있으므로 summary 탭으로 시작)
    if (isSharedView && sharedResult) {
      setActiveTab('summary');
      setHasSeenAiAnalysis(true);
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

    // 저장된 결과가 있으면 복원 (이미 AI가 있으므로 summary 탭으로 시작)
    if (state.savedResult) {
      setActiveTab('summary');
      setHasSeenAiAnalysis(true);
      
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
        setAiLoading(true);

        const saju = state.userInfo?.birthDate
          ? calculateSaju(state.userInfo.birthDate, null)
          : null;

        const userName = state.userInfo?.name || '익명';
        const maskedName = maskName(userName);

        // AI 분석과 결과 저장을 병렬로 시작
        const aiAnalysisPromise = saju ? generateAIAnalysis({
          userName,
          mbti: {
            type: mbti.type,
            dimensions: mbti.dimensions,
          },
          tci: tci as unknown as Record<string, { level: string; score?: number }>,
          saju: {
            coloredZodiac: {
              animal: saju.coloredZodiac.animal,
              colorName: saju.coloredZodiac.colorName,
              fullName: saju.coloredZodiac.fullName,
            },
            zodiacSign: {
              name: saju.zodiacSign.name,
              nameEn: saju.zodiacSign.nameEn,
              emoji: saju.zodiacSign.emoji,
            },
          },
          value: value as unknown as Record<string, { score: number; rank: number }>,
        }).catch((err) => {
          console.error('AI 분석 실패:', err);
          return null;
        }) : Promise.resolve(null);

        const quizResultPromise = saveQuizResult(
          state.sessionId,
          mbti.type,
          saju as unknown as Record<string, unknown>,
          tci as unknown as Record<string, unknown>,
          value as unknown as Record<string, unknown>
        );

        Promise.all([aiAnalysisPromise, quizResultPromise])
          .then(async ([analysis, quizResult]) => {
            // AI 분석 결과 설정
            if (analysis) {
              setAiAnalysis(analysis);
            }
            setAiLoading(false);

            // 공유 결과 저장 (AI 분석 결과 포함)
            const title = analysis?.title_ko || t('result.defaultTitle');
            const description = analysis?.description_ko ||
              t('result.defaultDescription', { name: userName });

            const sharedResult = await saveSharedResult(
              quizResult.id,
              maskedName,
              title,
              description,
              analysis?.image_url,
              analysis?.title_en,
              analysis?.description_en
            );

            if (sharedResult) {
              setSharedResultId(sharedResult.id);
            }
          })
          .catch((err) => {
            console.error('결과 저장 실패:', err);
            setAiLoading(false);
          });
      }
    }
  }, [state.answers, state.savedResult, state.sessionId, state.userInfo, calculateMBTI, calculateTCI, calculateValue, isSharedView, sharedResult, t]);

  // 공유하기 버튼 핸들러
  const handleShare = async () => {
    const idForShare = sharedResultId || sessionIdForShare;
    if (!idForShare) return;

    const shareUrl = `${window.location.origin}/${locale}/results?id=${idForShare}`;

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
          <h1 className="text-xl font-bold text-[#191F28] mb-4">{t('error.notFound')}</h1>
          <p className="text-[#8B95A1] mb-8">{t('error.notFoundDesc')}</p>
          <Link href="/" onClick={reset}>
            <Button size="large">{t('common.testStart')}</Button>
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
          <h1 className="text-xl font-bold text-[#191F28] mb-4">{t('error.incompleteTest')}</h1>
          <p className="text-[#8B95A1] mb-8">{t('error.incompleteTestDesc')}</p>
          <Link href="/" onClick={reset}>
            <Button size="large">{t('common.testStart')}</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const getDimensionLabel = (dimension: string, mbti: MBTIResult) => {
    switch (dimension) {
      case 'IE':
        return {
          left: t('mbti.dimensions.IE.I'),
          right: t('mbti.dimensions.IE.E'),
          dominant: mbti.dimensions.IE.dominant,
          percentage: mbti.dimensions.IE.percentage,
        };
      case 'NS':
        return {
          left: t('mbti.dimensions.NS.S'),
          right: t('mbti.dimensions.NS.N'),
          dominant: mbti.dimensions.NS.dominant,
          percentage: mbti.dimensions.NS.percentage,
        };
      case 'TF':
        return {
          left: t('mbti.dimensions.TF.F'),
          right: t('mbti.dimensions.TF.T'),
          dominant: mbti.dimensions.TF.dominant,
          percentage: mbti.dimensions.TF.percentage,
        };
      case 'JP':
        return {
          left: t('mbti.dimensions.JP.P'),
          right: t('mbti.dimensions.JP.J'),
          dominant: mbti.dimensions.JP.dominant,
          percentage: mbti.dimensions.JP.percentage,
        };
      default:
        return { left: '', right: '', dominant: '', percentage: 50 };
    }
  };

  // 언어별 AI 분석 텍스트
  const aiTitle = locale === 'en' && aiAnalysis?.title_en
    ? aiAnalysis.title_en
    : aiAnalysis?.title_ko || t('result.defaultTitle');

  const aiDescription = locale === 'en' && aiAnalysis?.description_en
    ? aiAnalysis.description_en
    : aiAnalysis?.description_ko || t('result.defaultDescription', { name: displayUserInfo?.name || '' });

  // MBTI 차원 정보 (언어별)
  const MBTI_DIMENSIONS_LOCALIZED = [
    { id: 'IE', name: t('mbti.dimensions.IE.name') },
    { id: 'NS', name: t('mbti.dimensions.NS.name') },
    { id: 'TF', name: t('mbti.dimensions.TF.name') },
    { id: 'JP', name: t('mbti.dimensions.JP.name') },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* 헤더 + 탭 */}
        <div className="flex items-center justify-between mb-6">
          {displayUserInfo && (
            <h1 className="text-2xl font-bold text-[#191F28] flex items-center gap-2">
              <span className="text-[#3182F6]">✦</span>
              {t('result.yourResult', { name: displayUserInfo.name })}
            </h1>
          )}

          {/* 탭 - iOS 스타일 세그먼트 컨트롤 */}
          <div className="inline-flex bg-[#F2F2F7] p-1 rounded-lg">
            <button
              onClick={() => handleTabChange('summary')}
              className={`relative py-1.5 px-3 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'summary'
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
              }`}
            >
              {t('result.analysis')}
              <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
                activeTab === 'summary'
                  ? 'bg-[#3182F6] text-white'
                  : 'bg-[#B0B8C1] text-white'
              }`}>AI</span>
              {/* 알림 배지 - AI 완료되었고 아직 안 본 경우 */}
              {!aiLoading && aiAnalysis && !hasSeenAiAnalysis && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('detail')}
              className={`py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                activeTab === 'detail'
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
              }`}
            >
              {t('result.detail')}
            </button>
          </div>
        </div>

        {/* 요약 탭 */}
        {activeTab === 'summary' && (
          <div className="mb-6">
          {/* 로딩 상태 */}
          {aiLoading ? (
            <>
              {/* 이미지 스켈레톤 */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-2xl mb-4 flex flex-col items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-[#3182F6] animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-[#4E5968] font-medium">{t('result.aiAnalyzing')}</p>
              </div>

              {/* 텍스트 스켈레톤 */}
              <div className="bg-[#FAFAFA] rounded-2xl p-5 mb-4">
                <div className="h-6 bg-[#E5E8EB] rounded-lg w-3/4 mb-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-[#E5E8EB] rounded w-full animate-pulse" />
                  <div className="h-4 bg-[#E5E8EB] rounded w-full animate-pulse" />
                  <div className="h-4 bg-[#E5E8EB] rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-[#E5E8EB] rounded w-full animate-pulse mt-6" />
                  <div className="h-4 bg-[#E5E8EB] rounded w-4/5 animate-pulse" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 이미지 - 전체 너비 */}
              {aiAnalysis?.image_url ? (
                <div className="w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden">
                  <img
                    src={aiAnalysis.image_url}
                    alt="AI generated image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-2xl mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* 분석 텍스트 */}
              <div className="bg-[#FAFAFA] rounded-2xl p-5 mb-4">
                <h3 className="text-lg font-bold text-[#191F28] mb-3">
                  {aiTitle}
                </h3>
                {aiDescription
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index} className={`text-[#333D4B] leading-7 text-base ${index > 0 ? 'mt-4' : ''}`}>
                      {paragraph}
                    </p>
                  ))}
              </div>
            </>
          )}

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <Link
              href="/results"
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#4E5968] bg-[#F4F4F4] hover:bg-[#E5E8EB] transition-colors text-center"
            >
              {t('result.browseOthers')}
            </Link>
            <button
              onClick={handleShare}
              disabled={aiLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-colors ${
                aiLoading
                  ? 'bg-[#B0B8C1] cursor-not-allowed'
                  : 'bg-[#3182F6] hover:bg-[#1B64DA]'
              }`}
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('common.copied')}
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
                  {t('common.share')}
                </span>
              )}
            </button>
          </div>

          {/* 안내 문구 */}
          <p className="mt-4 text-xs text-[#B0B8C1] text-center leading-relaxed">
            {t('result.disclaimer')}
          </p>
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
            {resultsData.mbti[mbtiResult.type as keyof typeof resultsData.mbti] && (
              <p className="text-sm text-[#4E5968] mb-6 leading-relaxed">
                {resultsData.mbti[mbtiResult.type as keyof typeof resultsData.mbti]}
              </p>
            )}

            {MBTI_DIMENSIONS_LOCALIZED.map((dim, index) => {
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
            {getTCIDimensions(t).map((dim, index) => {
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

            {/* AI 분석 완료 시 하단 버튼 */}
            {(!aiLoading && aiAnalysis) || state.savedResult || isSharedView ? (
              <button
                onClick={() => handleTabChange('summary')}
                className="w-full mt-6 py-4 bg-gradient-to-r from-[#3182F6] to-[#1B64DA] text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{t('result.viewAiAnalysis')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

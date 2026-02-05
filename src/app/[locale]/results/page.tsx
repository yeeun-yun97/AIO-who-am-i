'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  getPublicResults,
  getSharedResultById,
  getQuizResultWithUserById,
  generateAIAnalysis,
  updateSharedResult,
  SharedResultPublic
} from '@/lib/supabase';
import { Locale } from '@/i18n/config';

interface DisplayResult {
  id: string;
  quizResultId: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

function toDisplayResult(result: SharedResultPublic, locale: Locale): DisplayResult {
  // 영어인 경우 영어 타이틀/설명 사용 (없으면 한국어 폴백)
  const title = locale === 'en' && result.title_en ? result.title_en : result.title;
  const description = locale === 'en' && result.description_en ? result.description_en : result.description;

  return {
    id: result.id,
    quizResultId: result.quiz_result_id,
    name: result.user_name_privacy,
    title,
    description,
    imageUrl: result.image_url,
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DisplayResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // 다시 생성하기 핸들러
  const handleRegenerate = async () => {
    if (!selectedResult) return;

    setRegenerating(true);
    try {
      // 원본 퀴즈 결과 조회
      const quizResult = await getQuizResultWithUserById(selectedResult.quizResultId);
      if (!quizResult || !quizResult.mbtiResult || !quizResult.sajuResult || !quizResult.tciScores || !quizResult.valueScores) {
        throw new Error('원본 데이터를 찾을 수 없습니다.');
      }

      const saju = quizResult.sajuResult as { coloredZodiac: { animal: string; colorName: string; fullName: string }; zodiacSign: { name: string; nameEn: string; emoji: string } };

      // AI 분석 재생성
      const analysis = await generateAIAnalysis({
        userName: quizResult.userName,
        mbti: {
          type: quizResult.mbtiResult,
          dimensions: {
            IE: { dominant: quizResult.mbtiResult[0], percentage: 75 },
            NS: { dominant: quizResult.mbtiResult[1], percentage: 75 },
            TF: { dominant: quizResult.mbtiResult[2], percentage: 75 },
            JP: { dominant: quizResult.mbtiResult[3], percentage: 75 },
          },
        },
        tci: quizResult.tciScores as Record<string, { level: string; score?: number }>,
        saju: {
          coloredZodiac: saju.coloredZodiac,
          zodiacSign: saju.zodiacSign,
        },
        value: quizResult.valueScores as Record<string, { score: number; rank: number }>,
      });

      // 공유 결과 업데이트
      const updated = await updateSharedResult(
        selectedResult.id,
        analysis.title_ko,
        analysis.description_ko,
        analysis.image_url,
        analysis.title_en,
        analysis.description_en
      );

      if (updated) {
        const newDisplayResult = toDisplayResult(updated, locale);
        setSelectedResult(newDisplayResult);
        // 목록도 업데이트
        setResults((prev) =>
          prev.map((r) => (r.id === updated.id ? newDisplayResult : r))
        );
      }
    } catch (err) {
      console.error('재생성 실패:', err);
      alert(t('gallery.regenerateError'));
    } finally {
      setRegenerating(false);
    }
  };

  // 결과 목록 불러오기
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const data = await getPublicResults(50);
        setResults(data.map((r) => toDisplayResult(r, locale)));
      } catch (err) {
        console.error('결과 불러오기 실패:', err);
        setError(t('gallery.loadError'));
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [locale, t]);

  // 하이라이트된 아이템을 맨 위로 정렬
  const sortedResults = useMemo(() => {
    if (!highlightId || results.length === 0) return results;
    const highlighted = results.find((r) => r.id === highlightId);
    if (!highlighted) return results;
    return [highlighted, ...results.filter((r) => r.id !== highlightId)];
  }, [highlightId, results]);

  // URL에 id가 있으면 해당 다이얼로그 자동 열기
  useEffect(() => {
    if (highlightId && results.length > 0) {
      const result = results.find((r) => r.id === highlightId);
      if (result) {
        setSelectedResult(result);
      } else {
        // 목록에 없으면 직접 조회
        getSharedResultById(highlightId).then((data) => {
          if (data) {
            setSelectedResult(toDisplayResult(data, locale));
          }
        });
      }
    }
  }, [highlightId, results, locale]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center text-[#3182F6] hover:text-[#1B64DA] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-[#191F28]">
              {t('gallery.title')}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-[#F4F4F4] animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[#8B95A1]">{error}</p>
        </div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center text-[#3182F6] hover:text-[#1B64DA] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-[#191F28]">
              {t('gallery.title')}
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-[#8B95A1]">{t('gallery.noResults')}</p>
            <p className="text-[#8B95A1] text-sm mt-2">{t('gallery.noResultsHint')}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center text-[#3182F6] hover:text-[#1B64DA] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-[#191F28]">
            {t('gallery.title')}
          </h1>
        </div>

        {/* 안내 문구 */}
        <div className="mb-4 px-4 py-3 bg-[#F4F4F4] rounded-xl flex gap-3">
          <svg className="w-4 h-4 text-[#8B95A1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-[#8B95A1] leading-relaxed">
            {t('gallery.disclaimer')}
          </p>
        </div>

        {/* 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {sortedResults.map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left"
            >
              {/* 이미지 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <p className="text-base font-bold">{result.name}</p>
                <p className="text-sm text-white/80">{result.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 다이얼로그 */}
      {selectedResult && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 */}
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-t-2xl flex items-center justify-center">
              {selectedResult.imageUrl ? (
                <img
                  src={selectedResult.imageUrl}
                  alt={selectedResult.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            {/* 콘텐츠 */}
            <div className="p-5">
              <p className="text-sm text-[#8B95A1] mb-1">{t('gallery.resultOf', { name: selectedResult.name })}</p>
              <h3 className="text-lg font-bold text-[#191F28] mb-3">{selectedResult.title}</h3>
              <p className="text-[#4E5968] leading-relaxed text-sm">{selectedResult.description}</p>

              {/* 버튼 영역 */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedResult(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-[#4E5968] bg-[#F4F4F4] hover:bg-[#E5E8EB] transition-colors"
                >
                  {t('common.close')}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                    regenerating
                      ? 'bg-[#B0B8C1] cursor-not-allowed'
                      : 'bg-[#3182F6] hover:bg-[#1B64DA]'
                  }`}
                >
                  {regenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('gallery.generating')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {t('gallery.regenerate')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ResultsLoading() {
  const t = useTranslations();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center text-[#3182F6] hover:text-[#1B64DA] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-[#191F28]">
            {t('gallery.title')}
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-[#F4F4F4] animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}

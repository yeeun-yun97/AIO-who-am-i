'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DetailPageHeader from '@/components/ui/DetailPageHeader';
import {
  getPublicResults,
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
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return results;
  }, [results]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-6">
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
                className="aspect-square rounded-xl bg-[#F4F4F4] animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[#8B95A1]">{error}</p>
        </div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="min-h-screen px-4 py-6">
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
    <main className="min-h-screen px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <DetailPageHeader
          title={t('gallery.title')}
          backHref="/"
          rightElement={<LanguageSwitcher />}
        />

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
            <Link
              key={result.id}
              href={`/result/${result.id}`}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden text-left"
            >
              {/* 이미지 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-full h-full object-cover scale-[1.2]"
                  />
                ) : (
                  <svg className="w-8 h-8 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                <p className="text-sm font-bold line-clamp-3 w-full mb-1">{result.title}</p>
                <p className="text-xs text-white/80 truncate w-full">{result.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function ResultsLoading() {
  const t = useTranslations();

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="max-w-lg mx-auto">
        <DetailPageHeader
          title={t('gallery.title')}
          backHref="/"
          rightElement={<LanguageSwitcher />}
        />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-[#F4F4F4] animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ResultsClientPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}

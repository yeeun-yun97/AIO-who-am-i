'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AIAnalysisResponse } from '@/lib/supabase';
import AISkeleton from './AISkeleton';

interface SummaryTabProps {
  aiLoading: boolean;
  aiAnalysis: AIAnalysisResponse | null;
  aiTitle: string;
  aiDescription: string;
  onShare: () => void;
  copied: boolean;
  onRefreshImage?: () => void;
  isRefreshing?: boolean;
}

export default function SummaryTab({
  aiLoading,
  aiAnalysis,
  aiTitle,
  aiDescription,
  onShare,
  copied,
  onRefreshImage,
  isRefreshing,
}: SummaryTabProps) {
  const t = useTranslations();

  return (
    <div className="mb-6">
      {aiLoading ? (
        <AISkeleton />
      ) : (
        <>
          {/* 이미지 - 전체 너비 */}
          <div className="relative group">
            {aiAnalysis?.image_url ? (
              <div className="w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden relative">
                <img
                  src={aiAnalysis.image_url}
                  alt="AI generated image"
                  className={`absolute inset-0 w-full h-full object-cover scale-[1.2] origin-center transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}
                />
                {isRefreshing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-2xl mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* 이미지 재생성 버튼 (테스트용) */}
            {onRefreshImage && !aiLoading && (
              <button
                onClick={onRefreshImage}
                disabled={isRefreshing}
                className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-[#4E5968] hover:text-[#3182F6] transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                title="이미지 다시 생성 (테스트)"
              >
                <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>

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
          onClick={onShare}
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
  );
}

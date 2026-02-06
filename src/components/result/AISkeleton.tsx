'use client';

import { useTranslations } from 'next-intl';

export default function AISkeleton() {
  const t = useTranslations();
  
  return (
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
  );
}

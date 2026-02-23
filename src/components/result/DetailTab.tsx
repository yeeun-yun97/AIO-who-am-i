'use client';

import { useTranslations } from 'next-intl';
import { MBTIResult, TCIResult, ValueResult } from '@/types/quiz';
import { SajuResult } from '@/lib/saju';
import ZodiacCard from './ZodiacCard';
import StarSignCard from './StarSignCard';
import SajuCard from './SajuCard';
import MBTICard from './MBTICard';
import TCICard from './TCICard';
import ValueCard from './ValueCard';
import ProfileSummaryCard from './ProfileSummaryCard';

interface DetailTabProps {
  mbtiResult: MBTIResult | null;
  tciResult: TCIResult | null;
  valueResult: ValueResult | null;
  sajuResult: SajuResult | null;
  onViewAiAnalysis: () => void;
  showAiButton: boolean;
}

export default function DetailTab({
  mbtiResult,
  tciResult,
  valueResult,
  sajuResult,
  onViewAiAnalysis,
  showAiButton,
}: DetailTabProps) {
  const t = useTranslations();

  return (
    <>
      {/* 프로필 요약 */}
      <ProfileSummaryCard
        mbtiResult={mbtiResult}
        tciResult={tciResult}
        valueResult={valueResult}
        sajuResult={sajuResult}
      />

      {/* 동물띠 */}
      {sajuResult && <ZodiacCard coloredZodiac={sajuResult.coloredZodiac} />}

      {/* 별자리 */}
      {sajuResult?.zodiacSign && <StarSignCard zodiacSign={sajuResult.zodiacSign} />}

      {/* 사주 팔자 */}
      {sajuResult && <SajuCard saju={sajuResult} />}

      {/* MBTI 결과 */}
      {mbtiResult && <MBTICard mbtiResult={mbtiResult} />}

      {/* TCI 결과 */}
      {tciResult && <TCICard tciResult={tciResult} />}

      {/* 가치관 결과 */}
      {valueResult && <ValueCard value={valueResult} />}

      {/* AI 분석 완료 시 하단 버튼 */}
      {showAiButton && (
        <button
          onClick={onViewAiAnalysis}
          className="w-full mt-6 py-4 bg-gradient-to-r from-[#3182F6] to-[#1B64DA] text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>{t('result.viewAiAnalysis')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
}

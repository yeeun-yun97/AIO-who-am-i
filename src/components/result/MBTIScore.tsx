'use client';

import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n/config';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

interface MBTIDimensionEntry {
  full: string;
  description: string;
}

interface MBTIScoreProps {
  name: string;
  leftLabel: string;
  rightLabel: string;
  dominant: string;
  percentage: number;
  dimensionIndex: number;
  delay?: number;
}

export default function MBTIScore({
  name,
  leftLabel,
  rightLabel,
  dominant,
  percentage,
  dimensionIndex,
  delay = 0,
}: MBTIScoreProps) {
  const locale = useLocale() as Locale;
  const resultsData = locale === 'en' ? resultsEn : results;

  // MBTI 차원별 설명 가져오기
  const getMBTIDimensionDescription = (letter: string, index?: number): MBTIDimensionEntry | null => {
    if (index !== undefined) {
      const dimension = resultsData.mbtiDimension[index];
      if (!dimension) return null;
      return (dimension as unknown as Record<string, MBTIDimensionEntry>)[letter] || null;
    }
    const dimension = resultsData.mbtiDimension.find((item) => letter in item);
    if (!dimension) return null;
    return (dimension as unknown as Record<string, MBTIDimensionEntry>)[letter] || null;
  };

  const isRight = ['E', 'N', 'T', 'J'].includes(dominant);
  const isMiddle = dominant === '중간' || dominant === 'X';
  const detail = isMiddle ? getMBTIDimensionDescription('X', dimensionIndex) : getMBTIDimensionDescription(dominant);

  return (
    <div
      className="mb-6 last:mb-0 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-[#191F28]">{name}</h3>
        <div className="flex items-center gap-2">
          {detail && (
            <span className="text-xs text-[#4E5968]">{detail.full}</span>
          )}
          <span className={cn('text-xs font-medium px-2 py-1 rounded-md bg-[#3182F6] text-white')}>
            {isMiddle ? '50%' : `${percentage}%`}
          </span>
        </div>
      </div>
      {/* 좌우 라벨 */}
      <div className="flex justify-between mb-1">
        <span className="text-xs text-[#8B95A1]">{leftLabel}</span>
        <span className="text-xs text-[#8B95A1]">{rightLabel}</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-[#F4F4F4] rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 h-full bg-[#3182F6] rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            left: isRight ? 'auto' : 0,
            right: isRight ? 0 : 'auto',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      {detail && (
        <div className="mt-3 bg-[#F8F9FA] rounded-lg p-3">
          <p className="text-sm text-[#4E5968] leading-relaxed">{detail.description}</p>
        </div>
      )}
    </div>
  );
}

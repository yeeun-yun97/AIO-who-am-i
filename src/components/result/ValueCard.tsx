'use client';

import { ValueResult, getValueDimensions } from '@/types/quiz';
import Card from '@/components/ui/Card';
import { useTranslations, useLocale } from 'next-intl';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

interface ValueCardProps {
  value: ValueResult;
}

export default function ValueCard({ value }: ValueCardProps) {
  const t = useTranslations();
  const tValue = useTranslations('value');
  const locale = useLocale();
  const valueDimensions = getValueDimensions(t);
  const resultsData = locale === 'en' ? resultsEn : results;

  // dominant 키로 현재 로케일의 data에서 label/description 조회
  const getLocalizedValue = (dimension: string, dominant: string) => {
    const dimData = (resultsData.value as Record<string, Record<string, { label: string; description: string }>>)[dimension];
    return dimData?.[dominant] ?? { label: dominant, description: '' };
  };

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-6">{tValue('title')}</h2>

      <div className="space-y-6">
        {valueDimensions.map((dim) => {
          const result = value[dim.id];
          const total = result.scores.left + result.scores.right;
          const leftPercent = total > 0 ? Math.round((result.scores.left / total) * 100) : 50;
          const rightPercent = 100 - leftPercent;
          const localized = getLocalizedValue(dim.id, result.dominant);

          return (
            <div key={dim.id} className="mb-4">
              {/* 제목과 결과 라벨 */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-[#191F28]">{dim.name}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-[#3182F6] text-white">
                  {localized.label}
                </span>
              </div>

              {/* 좌우 라벨 */}
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#8B95A1]">{dim.left}</span>
                <span className="text-xs text-[#8B95A1]">{dim.right}</span>
              </div>

              {/* 프로그레스 바 */}
              <div className="h-2 bg-[#F4F4F4] rounded-full overflow-hidden flex mb-3">
                <div
                  className="h-full bg-[#3182F6] transition-all duration-700"
                  style={{ width: `${leftPercent}%` }}
                />
                <div
                  className="h-full bg-[#E5E8EB] transition-all duration-700"
                  style={{ width: `${rightPercent}%` }}
                />
              </div>

              {/* 설명 */}
              <p className="text-sm text-[#4E5968] leading-relaxed">
                {localized.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

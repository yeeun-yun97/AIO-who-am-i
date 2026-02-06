'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MBTIResult } from '@/types/quiz';
import Card from '@/components/ui/Card';
import MBTIScore from '@/components/result/MBTIScore';
import { getDimensionLabel, getMbtiDimensionsLocalized } from '@/lib/mbti-utils';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';
import { Locale } from '@/i18n/config';

interface MBTICardProps {
  mbtiResult: MBTIResult;
}

export default function MBTICard({ mbtiResult }: MBTICardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const resultsData = locale === 'en' ? resultsEn : results;
  const dimensions = getMbtiDimensionsLocalized(t);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">MBTI</h2>
      <p className="text-2xl font-bold text-[#3182F6] mb-3">{mbtiResult.type}</p>
      {resultsData.mbti[mbtiResult.type as keyof typeof resultsData.mbti] && (
        <p className="text-sm text-[#4E5968] mb-6 leading-relaxed">
          {resultsData.mbti[mbtiResult.type as keyof typeof resultsData.mbti]}
        </p>
      )}

      {dimensions.map((dim, index) => {
        const labels = getDimensionLabel(dim.id, mbtiResult, t);
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
  );
}

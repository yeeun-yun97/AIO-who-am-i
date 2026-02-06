'use client';

import { useTranslations } from 'next-intl';
import { TCIResult, getTCIDimensions } from '@/types/quiz';
import Card from '@/components/ui/Card';
import TCIScore from '@/components/result/TCIScore';

interface TCICardProps {
  tciResult: TCIResult;
}

export default function TCICard({ tciResult }: TCICardProps) {
  const t = useTranslations();
  const dimensions = getTCIDimensions(t);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-6">TCI</h2>
      {dimensions.map((dim, index) => {
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
  );
}

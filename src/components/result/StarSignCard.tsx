'use client';

import Card from '@/components/ui/Card';
import results from '@/data/results.json';

interface ZodiacSign {
  name: string;
  nameEn: string;
  emoji: string;
}

interface StarSignCardProps {
  zodiacSign: ZodiacSign;
}

function getZodiacSignDescription(nameEn: string): string | null {
  const key = nameEn.toLowerCase() as keyof typeof results.star;
  return results.star[key] || null;
}

export default function StarSignCard({ zodiacSign }: StarSignCardProps) {
  const description = getZodiacSignDescription(zodiacSign.nameEn);

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[32px]">{zodiacSign.emoji}</span>
        <h2 className="text-lg font-bold text-[#191F28]">별자리</h2>
      </div>
      <p className="text-2xl font-bold text-[#3182F6] mb-3">{zodiacSign.name}</p>
      {description && (
        <p className="text-sm text-[#4E5968] leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}

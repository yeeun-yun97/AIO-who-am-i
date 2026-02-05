'use client';

import Card from '@/components/ui/Card';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/config';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

interface ZodiacSign {
  name: string;
  nameEn: string;
  emoji: string;
}

interface StarSignCardProps {
  zodiacSign: ZodiacSign;
}

export default function StarSignCard({ zodiacSign }: StarSignCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('star');
  const resultsData = locale === 'en' ? resultsEn : results;
  
  const getZodiacSignDescription = (nameEn: string): string | null => {
    const key = nameEn.toLowerCase() as keyof typeof resultsData.star;
    return resultsData.star[key] || null;
  };
  
  const description = getZodiacSignDescription(zodiacSign.nameEn);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">{t('title')}</h2>
      <p className="text-2xl font-bold text-[#3182F6] mb-3">
        {locale === 'en' ? zodiacSign.nameEn : zodiacSign.name}
      </p>
      {description && (
        <p className="text-sm text-[#4E5968] leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}

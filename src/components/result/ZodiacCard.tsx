'use client';

import Card from '@/components/ui/Card';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/config';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

// 동물 이모지 매핑
const ANIMAL_EMOJI: Record<string, string> = {
  rat: '🐀',
  ox: '🐂',
  tiger: '🐅',
  rabbit: '🐇',
  dragon: '🐉',
  snake: '🐍',
  horse: '🐴',
  sheep: '🐑',
  monkey: '🐒',
  rooster: '🐓',
  dog: '🐕',
  pig: '🐖',
};

interface ColoredZodiac {
  year: number;
  color: string;
  colorKey: string;
  animal: string;
  animalKey: string;
  fullName: string;
  emoji: string;
}

interface ZodiacCardProps {
  coloredZodiac: ColoredZodiac;
}

export default function ZodiacCard({ coloredZodiac }: ZodiacCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('zodiac');
  const resultsData = locale === 'en' ? resultsEn : results;
  
  const getColoredZodiacDescription = (colorKey: string, animalKey: string): string | null => {
    const key = `${colorKey}-${animalKey}` as keyof typeof resultsData.colorAnimal;
    return resultsData.colorAnimal[key] || null;
  };
  
  const description = getColoredZodiacDescription(coloredZodiac.colorKey, coloredZodiac.animalKey);
  const animalEmoji = ANIMAL_EMOJI[coloredZodiac.animalKey] || '🐾';

  // 영문 이름 생성 (예: Red Rat)
  const getEnglishFullName = (color: string, animal: string) => {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${capitalize(color)} ${capitalize(animal)}`;
  };

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">{t('title')}</h2>
      <p className="text-2xl font-bold text-[#3182F6] mb-3">
        {locale === 'en' 
          ? getEnglishFullName(coloredZodiac.colorKey, coloredZodiac.animalKey) 
          : `${coloredZodiac.fullName}${t('suffix')}`}
      </p>
      {description && (
        <p className="text-sm text-[#4E5968] leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}

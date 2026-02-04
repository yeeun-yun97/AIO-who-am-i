'use client';

import Card from '@/components/ui/Card';
import results from '@/data/results.json';

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

function getColoredZodiacDescription(colorKey: string, animalKey: string): string | null {
  const key = `${colorKey}-${animalKey}` as keyof typeof results.colorAnimal;
  return results.colorAnimal[key] || null;
}

export default function ZodiacCard({ coloredZodiac }: ZodiacCardProps) {
  const description = getColoredZodiacDescription(coloredZodiac.colorKey, coloredZodiac.animalKey);
  const animalEmoji = ANIMAL_EMOJI[coloredZodiac.animalKey] || '🐾';

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">동물띠</h2>
      <p className="text-2xl font-bold text-[#3182F6] mb-3">{coloredZodiac.fullName}띠</p>
      {description && (
        <p className="text-sm text-[#4E5968] leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}

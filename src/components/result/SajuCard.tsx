'use client';

import { SajuResult, getSajuInterpretation } from '@/lib/saju';
import Card from '@/components/ui/Card';
import colorAnimalData from '@/data/color-animal.json';

interface ColorAnimalEntry {
  color: string;
  animal: string;
  label: string;
  description: string;
}

interface SajuCardProps {
  saju: SajuResult;
}

// 색띠 설명 찾기
function getColoredZodiacDescription(colorKey: string, animalKey: string): string | null {
  const entry = (colorAnimalData as ColorAnimalEntry[]).find(
    (item) => item.color === colorKey && item.animal === animalKey
  );
  return entry?.description || null;
}

export default function SajuCard({ saju }: SajuCardProps) {
  const interpretation = getSajuInterpretation(saju.day);
  const zodiacDescription = getColoredZodiacDescription(
    saju.coloredZodiac.colorKey,
    saju.coloredZodiac.animalKey
  );

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">사주 정보</h2>

      {/* 색띠 & 별자리 */}
      <div className="mb-4 pb-4 border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{saju.coloredZodiac.emoji}</span>
            <div>
              <span className="text-lg font-bold text-[#191F28]">{saju.coloredZodiac.fullName}띠</span>
              <span className="text-xs text-[#8B95A1] ml-2">({saju.coloredZodiac.year}년생 기준)</span>
            </div>
          </div>
          {saju.zodiacSign && (
            <div className="flex items-center gap-1">
              <span className="text-2xl">{saju.zodiacSign.emoji}</span>
              <span className="text-sm font-medium text-[#191F28]">{saju.zodiacSign.name}</span>
            </div>
          )}
        </div>
        {zodiacDescription && (
          <p className="text-sm text-[#4E5968] leading-relaxed pl-9">
            {zodiacDescription}
          </p>
        )}
      </div>

      {/* 사주 팔자 테이블 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* 헤더 */}
        <div className="text-center text-xs text-[#8B95A1] pb-2">시주</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">일주</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">월주</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">년주</div>

        {/* 천간 */}
        <div className="text-center">
          {saju.hour ? (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl font-bold text-[#191F28]">{saju.hour.stem}</span>
              <span className="text-xs text-[#8B95A1] block">{saju.hour.stemHanja}</span>
            </div>
          ) : (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl text-[#B0B8C1]">?</span>
              <span className="text-xs text-[#B0B8C1] block">미상</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="bg-[#3182F6]/10 rounded-lg py-3 border-2 border-[#3182F6]">
            <span className="text-xl font-bold text-[#3182F6]">{saju.day.stem}</span>
            <span className="text-xs text-[#3182F6] block">{saju.day.stemHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">{saju.month.stem}</span>
            <span className="text-xs text-[#8B95A1] block">{saju.month.stemHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">{saju.year.stem}</span>
            <span className="text-xs text-[#8B95A1] block">{saju.year.stemHanja}</span>
          </div>
        </div>

        {/* 지지 */}
        <div className="text-center">
          {saju.hour ? (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl font-bold text-[#191F28]">{saju.hour.branch}</span>
              <span className="text-xs text-[#8B95A1] block">{saju.hour.branchHanja}</span>
            </div>
          ) : (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl text-[#B0B8C1]">?</span>
              <span className="text-xs text-[#B0B8C1] block">미상</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="bg-[#3182F6]/10 rounded-lg py-3 border-2 border-[#3182F6]">
            <span className="text-xl font-bold text-[#3182F6]">{saju.day.branch}</span>
            <span className="text-xs text-[#3182F6] block">{saju.day.branchHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">{saju.month.branch}</span>
            <span className="text-xs text-[#8B95A1] block">{saju.month.branchHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">{saju.year.branch}</span>
            <span className="text-xs text-[#8B95A1] block">{saju.year.branchHanja}</span>
          </div>
        </div>
      </div>

      {/* 일간 해석 */}
      <div className="bg-[#F4F4F4] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-[#191F28]">일간 {saju.day.stem}({saju.day.stemHanja})</span>
          <span className="text-xs text-[#8B95A1]">{saju.day.element}</span>
        </div>
        <p className="text-sm text-[#8B95A1] leading-relaxed">{interpretation}</p>
      </div>
    </Card>
  );
}

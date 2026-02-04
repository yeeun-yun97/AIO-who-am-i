'use client';

import { SajuResult } from '@/lib/saju';
import Card from '@/components/ui/Card';
import colorAnimalData from '@/data/color-animal.json';
import starData from '@/data/star.json';
import stemData from '@/data/saju-stem.json';
import branchData from '@/data/saju-branch.json';

interface ColorAnimalEntry {
  color: string;
  animal: string;
  label: string;
  description: string;
}

interface StarEntry {
  name: string;
  period: string;
  description: string;
}

interface SajuEntry {
  label: string;
  description: string;
}

interface SajuCardProps {
  saju: SajuResult;
}

// 천간 키 매핑 (갑 -> 갑목)
const STEM_KEY_MAP: Record<string, string> = {
  '갑': '갑목', '을': '을목', '병': '병화', '정': '정화', '무': '무토',
  '기': '기토', '경': '경금', '신': '신금', '임': '임수', '계': '계수',
};

// 색띠 설명 찾기
function getColoredZodiacDescription(colorKey: string, animalKey: string): string | null {
  const entry = (colorAnimalData as ColorAnimalEntry[]).find(
    (item) => item.color === colorKey && item.animal === animalKey
  );
  return entry?.description || null;
}

// 별자리 설명 찾기
function getZodiacSignDescription(nameEn: string): string | null {
  const key = nameEn.toLowerCase() as keyof typeof starData;
  const entry = starData[key] as StarEntry | undefined;
  return entry?.description || null;
}

// 천간(일간) 설명 찾기
function getStemDescription(stem: string): { label: string; description: string } | null {
  const key = STEM_KEY_MAP[stem] as keyof typeof stemData;
  if (!key) return null;
  const entry = stemData[key] as SajuEntry | undefined;
  return entry || null;
}

// 지지(일지) 설명 찾기
function getBranchDescription(branch: string): { label: string; description: string } | null {
  const entry = branchData[branch as keyof typeof branchData] as SajuEntry | undefined;
  return entry || null;
}

export default function SajuCard({ saju }: SajuCardProps) {
  const zodiacDescription = getColoredZodiacDescription(
    saju.coloredZodiac.colorKey,
    saju.coloredZodiac.animalKey
  );
  const starDescription = saju.zodiacSign
    ? getZodiacSignDescription(saju.zodiacSign.nameEn)
    : null;

  // 일간(천간) 상세 설명
  const stemInfo = getStemDescription(saju.day.stem);
  // 일지(지지) 상세 설명
  const branchInfo = getBranchDescription(saju.day.branch);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">사주 정보</h2>

      {/* 색띠 */}
      <div className="mb-4 pb-4 border-b border-[#E5E8EB]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{saju.coloredZodiac.emoji}</span>
          <div>
            <span className="text-lg font-bold text-[#191F28]">{saju.coloredZodiac.fullName}띠</span>
            <span className="text-xs text-[#8B95A1] ml-2">({saju.coloredZodiac.year}년생 기준)</span>
          </div>
        </div>
        {zodiacDescription && (
          <p className="text-sm text-[#4E5968] leading-relaxed pl-9">
            {zodiacDescription}
          </p>
        )}
      </div>

      {/* 별자리 */}
      {saju.zodiacSign && (
        <div className="mb-4 pb-4 border-b border-[#E5E8EB]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{saju.zodiacSign.emoji}</span>
            <span className="text-lg font-bold text-[#191F28]">{saju.zodiacSign.name}</span>
          </div>
          {starDescription && (
            <p className="text-sm text-[#4E5968] leading-relaxed pl-9">
              {starDescription}
            </p>
          )}
        </div>
      )}

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

      {/* 일간(천간) 해석 */}
      {stemInfo && (
        <div className="bg-[#F4F4F4] rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-[#191F28]">
              일간 {saju.day.stem}({saju.day.stemHanja})
            </span>
            <span className="text-xs px-2 py-0.5 bg-[#3182F6]/10 text-[#3182F6] rounded-full">
              {stemInfo.label}
            </span>
          </div>
          <p className="text-sm text-[#4E5968] leading-relaxed">{stemInfo.description}</p>
        </div>
      )}

      {/* 일지(지지) 해석 */}
      {branchInfo && (
        <div className="bg-[#F4F4F4] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-[#191F28]">
              일지 {saju.day.branch}({saju.day.branchHanja})
            </span>
            <span className="text-xs px-2 py-0.5 bg-[#00C471]/10 text-[#00C471] rounded-full">
              {branchInfo.label}
            </span>
          </div>
          <p className="text-sm text-[#4E5968] leading-relaxed">{branchInfo.description}</p>
        </div>
      )}
    </Card>
  );
}

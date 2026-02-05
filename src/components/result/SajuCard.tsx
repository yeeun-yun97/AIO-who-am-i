'use client';

import { SajuResult } from '@/lib/saju';
import Card from '@/components/ui/Card';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/config';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

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

export default function SajuCard({ saju }: SajuCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('saju');
  const resultsData = locale === 'en' ? resultsEn : results;

  // 천간(일간) 설명 찾기
  const getStemDescription = (stem: string): { label: string; description: string } | null => {
    const key = STEM_KEY_MAP[stem] as keyof typeof resultsData.sajuStem;
    if (!key) return null;
    const entry = resultsData.sajuStem[key] as SajuEntry | undefined;
    return entry || null;
  };

  // 지지(일지) 설명 찾기
  const getBranchDescription = (branch: string): { label: string; description: string } | null => {
    const entry = resultsData.sajuBranch[branch as keyof typeof resultsData.sajuBranch] as SajuEntry | undefined;
    return entry || null;
  };

  // 일간(천간) 상세 설명
  const stemInfo = getStemDescription(saju.day.stem);
  // 일지(지지) 상세 설명
  const branchInfo = getBranchDescription(saju.day.branch);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-4">{t('title')}</h2>
      <p className="text-2xl font-bold text-[#3182F6] mb-4">
        {locale === 'en' 
          ? `${saju.day.stemEn} ${saju.day.branchEn} (${saju.day.stemHanja}${saju.day.branchHanja})`
          : `${saju.day.stem}${saju.day.stemHanja} ${saju.day.branch}${saju.day.branchHanja}`}
      </p>

      {/* 사주 팔자 테이블 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* 헤더 */}
        <div className="text-center text-xs text-[#8B95A1] pb-2">{t('hour')}</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">{t('day')}</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">{t('month')}</div>
        <div className="text-center text-xs text-[#8B95A1] pb-2">{t('year')}</div>

        {/* 천간 */}
        <div className="text-center">
          {saju.hour ? (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl font-bold text-[#191F28]">
                {locale === 'en' ? saju.hour.stemEn : saju.hour.stem}
              </span>
              <span className="text-xs text-[#8B95A1] block">{saju.hour.stemHanja}</span>
            </div>
          ) : (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl text-[#B0B8C1]">?</span>
              <span className="text-xs text-[#B0B8C1] block">{t('unknown')}</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="bg-[#3182F6]/10 rounded-lg py-3 border-2 border-[#3182F6]">
            <span className="text-xl font-bold text-[#3182F6]">
              {locale === 'en' ? saju.day.stemEn : saju.day.stem}
            </span>
            <span className="text-xs text-[#3182F6] block">{saju.day.stemHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">
              {locale === 'en' ? saju.month.stemEn : saju.month.stem}
            </span>
            <span className="text-xs text-[#8B95A1] block">{saju.month.stemHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">
              {locale === 'en' ? saju.year.stemEn : saju.year.stem}
            </span>
            <span className="text-xs text-[#8B95A1] block">{saju.year.stemHanja}</span>
          </div>
        </div>

        {/* 지지 */}
        <div className="text-center">
          {saju.hour ? (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl font-bold text-[#191F28]">
                {locale === 'en' ? saju.hour.branchEn : saju.hour.branch}
              </span>
              <span className="text-xs text-[#8B95A1] block">{saju.hour.branchHanja}</span>
            </div>
          ) : (
            <div className="bg-[#F4F4F4] rounded-lg py-3">
              <span className="text-xl text-[#B0B8C1]">?</span>
              <span className="text-xs text-[#B0B8C1] block">{t('unknown')}</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="bg-[#3182F6]/10 rounded-lg py-3 border-2 border-[#3182F6]">
            <span className="text-xl font-bold text-[#3182F6]">
              {locale === 'en' ? saju.day.branchEn : saju.day.branch}
            </span>
            <span className="text-xs text-[#3182F6] block">{saju.day.branchHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">
              {locale === 'en' ? saju.month.branchEn : saju.month.branch}
            </span>
            <span className="text-xs text-[#8B95A1] block">{saju.month.branchHanja}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-[#F4F4F4] rounded-lg py-3">
            <span className="text-xl font-bold text-[#191F28]">
              {locale === 'en' ? saju.year.branchEn : saju.year.branch}
            </span>
            <span className="text-xs text-[#8B95A1] block">{saju.year.branchHanja}</span>
          </div>
        </div>
      </div>

      {/* 일간(천간) 해석 */}
      {stemInfo && (
        <div className="bg-[#F4F4F4] rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-[#191F28]">
              {t('stem')} {locale === 'en' ? saju.day.stemEn : saju.day.stem}({saju.day.stemHanja})
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
              {t('branch')} {locale === 'en' ? saju.day.branchEn : saju.day.branch}({saju.day.branchHanja})
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

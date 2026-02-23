'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MBTIResult, TCIResult, ValueResult, getTCIDimensions, getValueDimensions } from '@/types/quiz';
import { SajuResult } from '@/lib/saju';
import Card from '@/components/ui/Card';
import { Locale } from '@/i18n/config';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';

// 동물 이모지 매핑
const ANIMAL_EMOJI: Record<string, string> = {
    rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇',
    dragon: '🐉', snake: '🐍', horse: '🐴', sheep: '🐑',
    monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐖',
};

interface ProfileSummaryCardProps {
    mbtiResult: MBTIResult | null;
    tciResult: TCIResult | null;
    valueResult: ValueResult | null;
    sajuResult: SajuResult | null;
}

export default function ProfileSummaryCard({
    mbtiResult,
    tciResult,
    valueResult,
    sajuResult,
}: ProfileSummaryCardProps) {
    const t = useTranslations();
    const locale = useLocale() as Locale;

    // TCI에서 '높음' 레벨인 항목들 추출
    const tciDimensions = getTCIDimensions(t);
    const highTciItems = tciResult
        ? tciDimensions.filter((dim) => {
            const result = tciResult[dim.id as keyof TCIResult];
            return result?.level === '높음';
        })
        : [];

    // 가치관 TOP 3: 스코어 차이가 큰 순서로 정렬
    const valueDimensions = getValueDimensions(t);
    const resultsData = locale === 'en' ? resultsEn : results;
    const valueSorted = valueResult
        ? valueDimensions
            .map((dim) => {
                const result = valueResult[dim.id];
                const dimData = (resultsData.value as Record<string, Record<string, { label: string; description: string }>>)[dim.id];
                const localizedLabel = dimData?.[result.dominant]?.label || result.label;
                return { name: dim.name, label: localizedLabel, dominant: result.dominant };
            })
            .slice(0, 3)
        : [];

    // 동물띠 표시명
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const zodiacDisplay = sajuResult?.coloredZodiac
        ? locale === 'en'
            ? `${capitalize(sajuResult.coloredZodiac.colorKey)} ${capitalize(sajuResult.coloredZodiac.animalKey)}`
            : `${sajuResult.coloredZodiac.fullName}${t('zodiac.suffix')}`
        : null;

    const animalEmoji = sajuResult?.coloredZodiac
        ? ANIMAL_EMOJI[sajuResult.coloredZodiac.animalKey] || '🐾'
        : null;

    // 별자리 표시명
    const starSignDisplay = sajuResult?.zodiacSign
        ? locale === 'en'
            ? sajuResult.zodiacSign.nameEn
            : sajuResult.zodiacSign.name
        : null;

    const starSignEmoji = sajuResult?.zodiacSign?.emoji || null;

    // 사주 일주 표시명
    const sajuDisplay = sajuResult
        ? locale === 'en'
            ? `${sajuResult.day.stemHanja.charAt(0)}${sajuResult.day.branchHanja} (${sajuResult.day.stemEn} ${sajuResult.day.branchEn})`
            : `${sajuResult.day.stemHanja.charAt(0)}${sajuResult.day.branchHanja} (${sajuResult.day.stem.substring(0, sajuResult.day.stem.length - 1)}${sajuResult.day.branch})`
        : null;

    return (
        <Card className="mb-6">
            <h2 className="text-lg font-bold text-[#191F28] mb-4">
                {locale === 'en' ? 'Summary' : '요약'}
            </h2>

            <div className="space-y-0">
                {/* 동물띠 */}
                {zodiacDisplay && (
                    <SummaryRow
                        label={t('zodiac.title')}
                        value={zodiacDisplay}
                    />
                )}

                {/* 별자리 */}
                {starSignDisplay && (
                    <SummaryRow
                        label={t('star.title')}
                        value={starSignDisplay}
                    />
                )}

                {/* 사주 */}
                {sajuDisplay && (
                    <SummaryRow
                        label={t('saju.title')}
                        value={sajuDisplay}
                    />
                )}

                {/* MBTI */}
                {mbtiResult && (
                    <SummaryRow
                        label="MBTI"
                        value={mbtiResult.type}
                        valueBold
                    />
                )}

                {/* TCI 주요 기질 */}
                {highTciItems.length > 0 && (
                    <div className="flex justify-between py-3 border-b border-[#F4F4F4]">
                        <span className="text-sm font-medium text-[#8B95A1]">
                            {locale === 'en' ? 'Key Traits' : '주요 기질'}
                        </span>
                        <div className="flex flex-col gap-1 items-end">
                            {highTciItems.map((item, i) => (
                                <span
                                    key={i}
                                    className="text-sm font-semibold text-[#00C471]"
                                >
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 가치관 TOP 3 */}
                {valueSorted.length > 0 && (
                    <div className={`flex justify-between py-3`}>
                        <span className="text-sm font-medium text-[#8B95A1]">
                            {locale === 'en' ? 'Values' : '가치관'}
                        </span>
                        <div className="flex flex-col gap-1 items-end">
                            {valueSorted.map((v, i) => (
                                <span
                                    key={i}
                                    className="text-sm font-semibold text-[#6366F1]"
                                >
                                    {v.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

// 한 줄 요약 행 컴포넌트
function SummaryRow({
    label,
    value,
    valueBold = false,
    valueColor = 'text-[#3182F6]',
    isLast = false,
}: {
    label: string;
    value: string;
    valueBold?: boolean;
    valueColor?: string;
    isLast?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-[#F4F4F4]' : ''
                }`}
        >
            <span className="text-sm font-medium text-[#8B95A1]">{label}</span>
            <span
                className={`text-sm ${valueBold ? 'font-bold' : 'font-semibold'} ${valueColor}`}
            >
                {value}
            </span>
        </div>
    );
}

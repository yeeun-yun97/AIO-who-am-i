import { Metadata } from 'next';
import { getSharedResultById } from '@/lib/supabase';
import { locales, Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DetailPageHeader from '@/components/ui/DetailPageHeader';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  
  // Enable static rendering
  setRequestLocale(locale);

  const result = await getSharedResultById(id);

  if (!result) {
    return {
      title: 'Result Not Found',
    };
  }

  const title = locale === 'en' && result.title_en ? result.title_en : result.title;
  const description = locale === 'en' && result.description_en ? result.description_en : result.description;

  return {
    title: `${title} | Journey of Self-Discovery`,
    description,
    openGraph: {
      title,
      description,
      images: result.image_url ? [result.image_url] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: result.image_url ? [result.image_url] : [],
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ResultDetailPage({ params }: Props) {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  
  // Enable static rendering
  setRequestLocale(locale);

  const result = await getSharedResultById(id);
  const t = await getTranslations('gallery');
  const commonT = await getTranslations('common');

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-xl font-bold text-[#191F28] mb-4">Result Not Found</h1>
          <p className="text-[#8B95A1] mb-8">The link is invalid or the results have been deleted.</p>
          <Link href="/">
            <button className="w-full py-4 bg-[#3182F6] text-white rounded-2xl font-bold">
              Go Home
            </button>
          </Link>
        </Card>
      </main>
    );
  }

  const title = locale === 'en' && result.title_en ? result.title_en : result.title;
  const description = locale === 'en' && result.description_en ? result.description_en : result.description;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* 헤더 */}
        <DetailPageHeader
          title={t('resultOf', { name: result.user_name_privacy })}
          backHref="/results"
          rightElement={<LanguageSwitcher />}
        />

        {/* 안내 문구 카드 */}
        <div className="mb-4 px-4 py-3 bg-[#F4F4F4] rounded-xl flex gap-3">
          <svg className="w-4 h-4 text-[#8B95A1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-[#8B95A1] leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>

        <Card className="overflow-hidden p-0 border-none shadow-sm rounded-2xl !p-0">
          {/* 이미지 - 전체 너비 및 상단 여백 제거 */}
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center overflow-hidden relative">
            {result.image_url ? (
              <img
                src={result.image_url}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover scale-[1.2] origin-center"
              />
            ) : (
              <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          {/* 콘텐츠 */}
          <div className="p-5">
            <h2 className="text-xl font-bold text-[#191F28] mb-3 leading-tight">
              {title}
            </h2>
            <div className="bg-[#FAFAFA] rounded-2xl p-5">
              <p className="text-[#333D4B] leading-7 text-base whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

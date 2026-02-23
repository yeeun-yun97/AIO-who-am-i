import { Metadata } from 'next';
import { getSharedResultById, getQuizResultWithUserById } from '@/lib/supabase';
import { locales, Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ResultClient from '@/components/result/ResultClient';

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

  const sharedResult = await getSharedResultById(id);
  const t = await getTranslations('common');

  if (!sharedResult) {
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

  // 원본 퀴즈 결과 (MBTI, 사주, TCI, 가치관) 가져오기
  const quizResultWithUser = await getQuizResultWithUserById(sharedResult.quiz_result_id);

  // ResultClient에 전달할 SharedResult 형태로 변환
  const sharedResultData = quizResultWithUser
    ? {
      userName: sharedResult.user_name_privacy,
      birthDate: quizResultWithUser.birthDate,
      mbtiResult: quizResultWithUser.mbtiResult,
      tciScores: quizResultWithUser.tciScores,
      valueScores: quizResultWithUser.valueScores,
    }
    : null;

  return (
    <ResultClient
      sharedResult={sharedResultData}
      sharedSessionId={id}
      sharedResultPublic={sharedResult}
    />
  );
}

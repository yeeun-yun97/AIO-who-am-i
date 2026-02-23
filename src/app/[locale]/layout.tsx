import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { QuizProvider } from '@/contexts/QuizContext';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    ko: 'All in one: Who am I',
    en: 'All in one: Who am I',
  };

  const descriptions = {
    ko: '나를 알아가는 여정 - 45개의 질문으로 알아보는 MBTI와 기질',
    en: 'Journey of Self-Discovery - Discover your MBTI and temperament through 45 questions',
  };

  return {
    title: titles[locale as Locale] || titles.ko,
    description: descriptions[locale as Locale] || descriptions.ko,
    openGraph: {
      title: titles[locale as Locale] || titles.ko,
      description: descriptions[locale as Locale] || descriptions.ko,
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      images: [
        {
          url: '/og-image.png', // Make sure to add this file to public folder
          width: 1200,
          height: 630,
          alt: titles[locale as Locale] || titles.ko,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as Locale] || titles.ko,
      description: descriptions[locale as Locale] || descriptions.ko,
      images: ['/og-image.png'],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider messages={messages}>
          <QuizProvider locale={locale as Locale}>
            {children}
          </QuizProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

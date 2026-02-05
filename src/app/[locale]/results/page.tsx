import { setRequestLocale } from 'next-intl/server';
import ResultsClientPage from './ResultsClient';
import { locales } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResultsClientPage />;
}


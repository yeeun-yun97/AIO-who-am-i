import { setRequestLocale } from 'next-intl/server';
import HomeClient from './HomeClient';
import { locales } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeClient />;
}


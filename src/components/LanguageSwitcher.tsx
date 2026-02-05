'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';

const languageLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const otherLocale = locales.find((l) => l !== locale) as Locale;

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      className="px-3 py-1.5 text-sm font-medium text-[#4E5968] bg-[#F4F4F4] hover:bg-[#E5E8EB] rounded-lg transition-colors"
      aria-label={`Switch to ${languageLabels[otherLocale]}`}
    >
      {languageLabels[otherLocale]}
    </button>
  );
}

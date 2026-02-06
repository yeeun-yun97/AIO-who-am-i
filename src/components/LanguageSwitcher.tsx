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
    <div className="inline-flex bg-[#F2F2F7] p-1 rounded-lg">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
            locale === l
              ? 'text-[#191F28] bg-white shadow-sm'
              : 'text-[#8B95A1]'
          }`}
        >
          {languageLabels[l]}
        </button>
      ))}
    </div>
  );
}

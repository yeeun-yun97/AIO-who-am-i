'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ResultErrorStateProps {
  type: 'notFound' | 'incomplete';
  onReset: () => void;
}

export default function ResultErrorState({ type, onReset }: ResultErrorStateProps) {
  const t = useTranslations();

  const config = {
    notFound: {
      title: t('error.notFound'),
      desc: t('error.notFoundDesc'),
    },
    incomplete: {
      title: t('error.incompleteTest'),
      desc: t('error.incompleteTestDesc'),
    },
  };

  const { title, desc } = config[type];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full text-center p-8">
        <h1 className="text-xl font-bold text-[#191F28] mb-4">{title}</h1>
        <p className="text-[#8B95A1] mb-8">{desc}</p>
        <Link href="/" onClick={onReset}>
          <Button size="large">{t('common.testStart')}</Button>
        </Link>
      </Card>
    </main>
  );
}

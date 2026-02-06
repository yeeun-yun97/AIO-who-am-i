'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuiz } from '@/contexts/QuizContext';
import { SharedResult } from '@/lib/supabase';
import DetailPageHeader from '@/components/ui/DetailPageHeader';
import { Locale } from '@/i18n/config';

// Hooks
import { useResultData } from '@/hooks/useResultData';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

// Components
import SummaryTab from './SummaryTab';
import DetailTab from './DetailTab';
import ResultErrorState from './ResultErrorState';

interface ResultClientProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
}

export default function ResultClient({ sharedResult, sharedSessionId }: ResultClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { reset } = useQuiz();

  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('detail');
  const [hasSeenAiAnalysis, setHasSeenAiAnalysis] = useState(false);

  // Custom Hooks
  const {
    mbtiResult,
    tciResult,
    valueResult,
    sajuResult,
    displayUserInfo,
    isSharedView,
    state,
  } = useResultData({ sharedResult, sharedSessionId });

  const {
    aiLoading,
    aiAnalysis,
    sharedResultId,
  } = useAIAnalysis({
    mbtiResult,
    tciResult,
    valueResult,
    sajuResult,
    userInfo: displayUserInfo,
    sessionId: sharedSessionId || state.sessionId,
    isSharedView,
    hasSavedResult: !!state.savedResult,
  });

  useEffect(() => {
    setMounted(true);
    if ((isSharedView && sharedResult) || state.savedResult) {
      setActiveTab('summary');
      setHasSeenAiAnalysis(true);
    }
  }, [isSharedView, sharedResult, state.savedResult]);

  // 탭 전환 핸들러
  const handleTabChange = (tab: 'summary' | 'detail') => {
    setActiveTab(tab);
    if (tab === 'summary') {
      setHasSeenAiAnalysis(true);
    }
  };

  // 공유하기 버튼 핸들러
  const handleShare = async () => {
    const idForShare = sharedResultId || sharedSessionId || state.sessionId;
    if (!idForShare) return;

    const shareUrl = `${window.location.origin}/${locale}/result/${idForShare}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  if (!mounted) return null;

  // 에러 상태 처리
  if (isSharedView && !sharedResult) {
    return <ResultErrorState type="notFound" onReset={reset} />;
  }

  const hasValidResult = state.answers.length > 0 || state.savedResult || isSharedView;
  if (!hasValidResult) {
    return <ResultErrorState type="incomplete" onReset={reset} />;
  }

  // 언어별 AI 분석 텍스트
  const aiTitle = locale === 'en' && aiAnalysis?.title_en
    ? aiAnalysis.title_en
    : aiAnalysis?.title_ko || t('result.defaultTitle');

  const aiDescription = locale === 'en' && aiAnalysis?.description_en
    ? aiAnalysis.description_en
    : aiAnalysis?.description_ko || t('result.defaultDescription', { name: displayUserInfo?.name || '' });

  const showAiButton = (!aiLoading && !!aiAnalysis) || !!state.savedResult || isSharedView;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {displayUserInfo && (
          <DetailPageHeader
            title={t('result.yourResult', { name: displayUserInfo.name })}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={[
              {
                id: 'summary',
                label: t('result.analysis'),
                badgeLabel: 'AI',
                showBadge: !aiLoading && !!aiAnalysis && !hasSeenAiAnalysis,
              },
              {
                id: 'detail',
                label: t('result.detail'),
              },
            ]}
          />
        )}

        {activeTab === 'summary' ? (
          <SummaryTab
            aiLoading={aiLoading}
            aiAnalysis={aiAnalysis}
            aiTitle={aiTitle}
            aiDescription={aiDescription}
            onShare={handleShare}
            copied={copied}
          />
        ) : (
          <DetailTab
            mbtiResult={mbtiResult}
            tciResult={tciResult}
            valueResult={valueResult}
            sajuResult={sajuResult}
            onViewAiAnalysis={() => handleTabChange('summary')}
            showAiButton={showAiButton}
          />
        )}
      </div>
    </main>
  );
}

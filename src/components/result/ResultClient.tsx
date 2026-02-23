'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuiz } from '@/contexts/QuizContext';
import { SharedResult, SharedResultPublic } from '@/lib/supabase';
import DetailPageHeader from '@/components/ui/DetailPageHeader';
import { Locale } from '@/i18n/config';
import { useRouter } from 'next/navigation';

// Hooks
import { useResultData } from '@/hooks/useResultData';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

// Components
import SummaryTab from './SummaryTab';
import DetailTab from './DetailTab';
import ResultErrorState from './ResultErrorState';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ResultClientProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
  sharedResultPublic?: SharedResultPublic | null;
}

export default function ResultClient({ sharedResult, sharedSessionId, sharedResultPublic }: ResultClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { reset } = useQuiz();
  const router = useRouter();

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
    sharedResultPublic,
  });

  // 퀴즈 완료 후 sharedResultId가 생성되면 결과 페이지로 이동
  useEffect(() => {
    if (!isSharedView && sharedResultId) {
      router.replace(`/${locale}/result/${sharedResultId}`);
    }
  }, [isSharedView, sharedResultId, locale, router]);

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

  // 퀴즈 완료 직후: AI 분석 중이거나 결과 페이지로 이동 대기 중
  if (!isSharedView && !state.savedResult && (aiLoading || !sharedResultId)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3182F6]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#3182F6] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-[#333D4B] font-semibold text-lg mb-2">{t('result.analyzing')}</p>
          <p className="text-[#8B95A1] text-sm">{t('result.analyzingDesc')}</p>
        </div>
      </main>
    );
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
    <main className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-lg">
        {displayUserInfo && (
          <DetailPageHeader
            title={t('result.yourResult', { name: displayUserInfo.name })}
            backHref="/results"
            rightElement={<LanguageSwitcher />}
          />
        )}

        {/* 분석/상세 탭 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-[#F2F2F7] p-1 rounded-lg">
            {[
              {
                id: 'summary' as const,
                label: t('result.analysis'),
                badgeLabel: 'AI',
                showBadge: !aiLoading && !!aiAnalysis && !hasSeenAiAnalysis,
              },
              {
                id: 'detail' as const,
                label: t('result.detail'),
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative py-1.5 px-4 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === tab.id
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
                  }`}
              >
                {tab.label}
                {'badgeLabel' in tab && tab.badgeLabel && (
                  <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${activeTab === tab.id
                    ? 'bg-[#3182F6] text-white'
                    : 'bg-[#B0B8C1] text-white'
                    }`}>
                    {tab.badgeLabel}
                  </span>
                )}
                {'showBadge' in tab && tab.showBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

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

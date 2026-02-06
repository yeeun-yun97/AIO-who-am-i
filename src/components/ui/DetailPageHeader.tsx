'use client';

import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

interface DetailPageHeaderProps {
  title: ReactNode;
  backHref?: string;
  rightElement?: ReactNode;
  activeTab?: string;
  tabs?: {
    id: string;
    label: ReactNode;
    showBadge?: boolean;
    badgeLabel?: string;
  }[];
  onTabChange?: (tabId: any) => void;
}

export default function DetailPageHeader({
  title,
  backHref,
  rightElement,
  activeTab,
  tabs,
  onTabChange,
}: DetailPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center text-[#3182F6] hover:text-[#1B64DA] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="text-xl font-bold text-[#191F28] flex items-center gap-3">
          {!backHref && <span className="text-[#3182F6]">✦</span>}
          {title}
        </h1>
      </div>

      {/* 우측 요소 (예: LanguageSwitcher) */}
      {rightElement && <div>{rightElement}</div>}

      {/* 탭 - iOS 스타일 세그먼트 컨트롤 */}
      {tabs && tabs.length > 0 && (
        <div className="inline-flex bg-[#F2F2F7] p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`relative py-1.5 px-3 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'text-[#191F28] bg-white shadow-sm'
                  : 'text-[#8B95A1]'
              }`}
            >
              {tab.label}
              {tab.badgeLabel && (
                <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
                  activeTab === tab.id
                    ? 'bg-[#3182F6] text-white'
                    : 'bg-[#B0B8C1] text-white'
                }`}>
                  {tab.badgeLabel}
                </span>
              )}
              {/* 알림 배지 */}
              {tab.showBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

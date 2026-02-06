'use client';

import { ReactNode } from 'react';

interface DetailPageHeaderProps {
  title: ReactNode;
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
  activeTab,
  tabs,
  onTabChange,
}: DetailPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#191F28] flex items-center gap-2">
        <span className="text-[#3182F6]">✦</span>
        {title}
      </h1>

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

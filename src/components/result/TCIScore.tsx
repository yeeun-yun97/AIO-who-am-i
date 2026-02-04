'use client';

import { cn } from '@/lib/utils';
import results from '@/data/results.json';

interface TCIEntry {
  label: string;
  Low: { label: string; description: string };
  Medium: { label: string; description: string };
  High: { label: string; description: string };
}

interface TCIScoreProps {
  dimensionId: string;
  name: string;
  level: '높음' | '중간' | '낮음';
  delay?: number;
}

// 레벨 한글 -> 영문 매핑
const LEVEL_MAP: Record<string, 'Low' | 'Medium' | 'High'> = {
  '낮음': 'Low',
  '중간': 'Medium',
  '높음': 'High',
};

// TCI 데이터에서 상세 설명 가져오기
function getTCIDetail(dimensionId: string, level: '높음' | '중간' | '낮음') {
  const levelKey = LEVEL_MAP[level];
  const dimension = results.tci.find(
    (item) => dimensionId in item
  );
  if (!dimension) return null;
  const entry = (dimension as unknown as Record<string, TCIEntry>)[dimensionId];
  return entry?.[levelKey] || null;
}

export default function TCIScore({ dimensionId, name, level, delay = 0 }: TCIScoreProps) {
  const detail = getTCIDetail(dimensionId, level);

  const getLevelColor = (level: string) => {
    switch (level) {
      case '높음':
        return 'bg-[#3182F6] text-white';
      case '중간':
        return 'bg-[#00C471] text-white';
      case '낮음':
        return 'bg-[#8B95A1] text-white';
      default:
        return 'bg-[#F4F4F4] text-[#191F28]';
    }
  };

  const getLevelWidth = (level: string) => {
    switch (level) {
      case '높음':
        return '100%';
      case '중간':
        return '60%';
      case '낮음':
        return '30%';
      default:
        return '50%';
    }
  };

  return (
    <div
      className="mb-6 last:mb-0 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-[#191F28]">{name}</h3>
        <div className="flex items-center gap-2">
          {detail && (
            <span className="text-xs text-[#4E5968]">{detail.label}</span>
          )}
          <span
            className={cn('text-xs font-medium px-2 py-1 rounded-md', getLevelColor(level))}
          >
            {level}
          </span>
        </div>
      </div>
      <div className="h-2 bg-[#F4F4F4] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getLevelColor(level).split(' ')[0])}
          style={{
            width: getLevelWidth(level),
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      {detail && (
        <div className="mt-3 bg-[#F8F9FA] rounded-lg p-3">
          <p className="text-sm text-[#4E5968] leading-relaxed">{detail.description}</p>
        </div>
      )}
    </div>
  );
}

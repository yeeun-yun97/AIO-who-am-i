'use client';

import { cn } from '@/lib/utils';

interface CategoryScoreProps {
  name: string;
  description: string;
  percentage: number;
  leftLabel?: string;
  rightLabel?: string;
  delay?: number;
}

export default function CategoryScore({
  name,
  description,
  percentage,
  leftLabel,
  rightLabel,
  delay = 0,
}: CategoryScoreProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-base font-semibold text-[#191F28]">{name}</h3>
          <p className="text-sm text-[#8B95A1]">{description}</p>
        </div>
        <span className="text-xl font-bold text-[#3182F6]">{percentage}%</span>
      </div>
      {leftLabel && rightLabel && (
        <div className="flex justify-between text-xs text-[#8B95A1] mb-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <div className="h-3 bg-[#F4F4F4] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            percentage >= 70 ? 'bg-[#3182F6]' : percentage >= 40 ? 'bg-[#00C471]' : 'bg-[#8B95A1]'
          )}
          style={{
            width: `${percentage}%`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

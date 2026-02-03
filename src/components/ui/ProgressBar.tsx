'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#191F28]">
          {current} / {total}
        </span>
        <span className="text-sm text-[#8B95A1]">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-[#F4F4F4] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3182F6] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

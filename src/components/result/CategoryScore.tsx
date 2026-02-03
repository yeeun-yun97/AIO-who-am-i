'use client';

import { CategoryInfo } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface CategoryScoreProps {
  category: CategoryInfo;
  percentage: number;
  delay?: number;
}

export default function CategoryScore({ category, percentage, delay = 0 }: CategoryScoreProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-base font-semibold text-[#191F28]">{category.name}</h3>
          <p className="text-sm text-[#8B95A1]">{category.description}</p>
        </div>
        <span className="text-xl font-bold text-[#3182F6]">{percentage}%</span>
      </div>
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

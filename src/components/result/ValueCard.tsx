'use client';

import { ValueResult, VALUE_DIMENSIONS } from '@/types/quiz';
import Card from '@/components/ui/Card';

interface ValueCardProps {
  value: ValueResult;
}

export default function ValueCard({ value }: ValueCardProps) {
  return (
    <Card className="mb-6">
      <h2 className="text-lg font-bold text-[#191F28] mb-6">가치관 성향</h2>

      <div className="space-y-6">
        {VALUE_DIMENSIONS.map((dim) => {
          const result = value[dim.id];
          const total = result.scores.left + result.scores.right;
          const leftPercent = total > 0 ? Math.round((result.scores.left / total) * 100) : 50;
          const rightPercent = 100 - leftPercent;

          return (
            <div key={dim.id} className="mb-4">
              {/* 제목과 결과 라벨 */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#191F28]">{dim.name}</span>
                <span className="text-sm font-bold text-[#3182F6]">{result.label}</span>
              </div>

              {/* 프로그레스 바 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[#8B95A1] w-12 text-right">{dim.left.split('/')[0]}</span>
                <div className="flex-1 h-2 bg-[#F4F4F4] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#3182F6] transition-all duration-700"
                    style={{ width: `${leftPercent}%` }}
                  />
                  <div
                    className="h-full bg-[#E5E8EB] transition-all duration-700"
                    style={{ width: `${rightPercent}%` }}
                  />
                </div>
                <span className="text-xs text-[#8B95A1] w-12">{dim.right.split('/')[0]}</span>
              </div>

              {/* 설명 */}
              <p className="text-sm text-[#4E5968] leading-relaxed">
                {result.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

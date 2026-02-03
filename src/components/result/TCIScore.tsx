'use client';

import { cn } from '@/lib/utils';

interface TCIScoreProps {
  name: string;
  level: '높음' | '중간' | '낮음';
  description: string;
  delay?: number;
}

export default function TCIScore({ name, level, description, delay = 0 }: TCIScoreProps) {
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
      className="mb-5 last:mb-0 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-[#191F28]">{name}</h3>
        <span
          className={cn('text-xs font-medium px-2 py-1 rounded-md', getLevelColor(level))}
        >
          {level}
        </span>
      </div>
      <div className="h-2 bg-[#F4F4F4] rounded-full overflow-hidden mb-2">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getLevelColor(level).split(' ')[0])}
          style={{
            width: getLevelWidth(level),
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <p className="text-sm text-[#8B95A1]">{description}</p>
    </div>
  );
}

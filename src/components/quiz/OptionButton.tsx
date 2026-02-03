'use client';

import { cn } from '@/lib/utils';

interface OptionButtonProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ text, selected, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6] focus-visible:ring-offset-2',
        'active:scale-[0.98]',
        selected
          ? 'bg-[#3182F6]/5 border-[#3182F6] text-[#191F28]'
          : 'bg-[#F4F4F4] border-transparent text-[#191F28] hover:bg-[#E5E8EB]'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
            selected ? 'border-[#3182F6] bg-[#3182F6]' : 'border-[#B0B8C1]'
          )}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className="text-base leading-relaxed">{text}</span>
      </div>
    </button>
  );
}

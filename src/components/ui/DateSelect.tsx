'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n/config';

interface DateSelectProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
}

export default function DateSelect({ value, onChange, className = '' }: DateSelectProps) {
  const t = useTranslations('dateSelect');
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(1990);
  const [viewMonth, setViewMonth] = useState(1);

  // 언어별 요일
  const weekdays = t.raw('weekdays') as string[];

  // value가 있으면 해당 날짜로 뷰 설정
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m);
    }
  }, [value]);

  // 모달 열 때
  const handleOpen = () => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m);
    } else {
      setViewYear(1990);
      setViewMonth(1);
    }
    setIsOpen(true);
  };

  // 일 선택
  const handleDaySelect = (day: number) => {
    const formatted = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // 이전/다음 월
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // 해당 월의 일수
  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth, 0).getDate();
  }, [viewYear, viewMonth]);

  // 해당 월의 첫 날 요일 (0: 일요일)
  const firstDayOfMonth = useMemo(() => {
    return new Date(viewYear, viewMonth - 1, 1).getDay();
  }, [viewYear, viewMonth]);

  // 선택된 날짜 파싱
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return { year: y, month: m, day: d };
  }, [value]);

  // 년도 옵션 (1930 ~ 2026)
  const years = useMemo(() => {
    return Array.from({ length: 97 }, (_, i) => 2026 - i);
  }, []);

  // 표시용 텍스트
  const displayText = value
    ? locale === 'en'
      ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : value.replace(/-/g, '. ')
    : t('placeholder');

  // 년/월 표시 형식
  const formatYear = (y: number) => locale === 'en' ? String(y) : `${y}${t('yearSuffix')}`;
  const formatMonth = (m: number) => {
    if (locale === 'en') {
      return new Date(2000, m - 1, 1).toLocaleDateString('en-US', { month: 'long' });
    }
    return `${m}${t('monthSuffix')}`;
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full h-12 px-4 bg-[#F4F4F4] border-2 border-transparent rounded-xl font-medium text-left focus:bg-white focus:border-[#3182F6] focus:outline-none transition-all duration-200 ${value ? 'text-[#191F28]' : 'text-[#B0B8C1]'} ${className}`}
      >
        {displayText}
      </button>

      {/* 바텀시트 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* 바텀시트 */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더: 년/월 선택 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 flex items-center justify-center text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F4F4F4] rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                {/* 년도 선택 */}
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="h-10 px-3 bg-[#F4F4F4] rounded-lg text-[#191F28] font-bold text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{formatYear(y)}</option>
                  ))}
                </select>

                {/* 월 선택 */}
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="h-10 px-3 bg-[#F4F4F4] rounded-lg text-[#191F28] font-bold text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{formatMonth(m)}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNextMonth}
                className="w-10 h-10 flex items-center justify-center text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F4F4F4] rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((d, i) => (
                <div
                  key={d}
                  className={`h-8 flex items-center justify-center text-xs font-medium ${
                    i === 0 ? 'text-[#F04452]' : i === 6 ? 'text-[#3182F6]' : 'text-[#8B95A1]'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {/* 빈 칸 */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="h-11" />
              ))}
              {/* 날짜 */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
                const isSelected = selectedDate &&
                  selectedDate.year === viewYear &&
                  selectedDate.month === viewMonth &&
                  selectedDate.day === day;

                return (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    className={`h-11 rounded-xl font-medium transition-all ${
                      isSelected
                        ? 'bg-[#3182F6] text-white'
                        : dayOfWeek === 0
                        ? 'text-[#F04452] hover:bg-[#F4F4F4]'
                        : dayOfWeek === 6
                        ? 'text-[#3182F6] hover:bg-[#F4F4F4]'
                        : 'text-[#191F28] hover:bg-[#F4F4F4]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

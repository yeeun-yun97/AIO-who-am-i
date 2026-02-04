'use client';

import Link from 'next/link';

// 임시 더미 데이터
const dummyResults = [
  { id: '1', name: '김민수', title: '풍부한 감성의 소유자' },
  { id: '2', name: '이지은', title: '논리적인 분석가' },
  { id: '3', name: '박준영', title: '창의적인 몽상가' },
  { id: '4', name: '최서연', title: '따뜻한 공감러' },
  { id: '5', name: '정도윤', title: '열정적인 리더' },
  { id: '6', name: '강하은', title: '섬세한 관찰자' },
  { id: '7', name: '윤재호', title: '자유로운 영혼' },
  { id: '8', name: '임수빈', title: '신중한 전략가' },
  { id: '9', name: '한지민', title: '활발한 소통러' },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <h1 className="text-xl font-bold text-[#191F28] mb-6 flex items-center gap-2">
          <span>👀</span>
          다른 결과 구경하기
        </h1>

        {/* 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {dummyResults.map((result) => (
            <Link
              key={result.id}
              href={`/share/${result.id}`}
              className="group relative aspect-square rounded-2xl overflow-hidden"
            >
              {/* 이미지 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center">
                <svg className="w-12 h-12 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <p className="text-base font-bold">{result.name}</p>
                <p className="text-sm text-white/80">{result.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

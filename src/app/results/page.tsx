'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

// 임시 더미 데이터
const dummyResults = [
  { id: '1', name: '김민수', title: '풍부한 감성의 소유자', description: '김민수님은 내면의 풍부한 감성과 깊은 사고력을 가진 분입니다. 새로운 아이디어와 가능성에 열려 있으면서도, 중요한 결정을 내릴 때는 신중하게 여러 각도에서 검토하는 성향을 보입니다.' },
  { id: '2', name: '이지은', title: '논리적인 분석가', description: '이지은님은 뛰어난 분석력과 논리적 사고를 갖춘 분입니다. 복잡한 문제도 체계적으로 분해하여 해결책을 찾아내며, 객관적인 판단을 중시합니다.' },
  { id: '3', name: '박준영', title: '창의적인 몽상가', description: '박준영님은 풍부한 상상력과 창의성을 지닌 분입니다. 새로운 아이디어를 떠올리고 독창적인 방식으로 문제를 해결하는 것을 즐깁니다.' },
  { id: '4', name: '최서연', title: '따뜻한 공감러', description: '최서연님은 타인의 감정에 깊이 공감하는 따뜻한 마음을 가진 분입니다. 주변 사람들의 이야기에 귀 기울이고 진심 어린 위로를 건넵니다.' },
  { id: '5', name: '정도윤', title: '열정적인 리더', description: '정도윤님은 강한 추진력과 리더십을 갖춘 분입니다. 목표를 향해 흔들림 없이 나아가며, 주변 사람들에게 영감을 주는 존재입니다.' },
  { id: '6', name: '강하은', title: '섬세한 관찰자', description: '강하은님은 세심한 관찰력으로 다른 사람들이 놓치는 디테일을 포착하는 분입니다. 꼼꼼하고 신중한 성격으로 신뢰를 얻습니다.' },
  { id: '7', name: '윤재호', title: '자유로운 영혼', description: '윤재호님은 자유롭고 독립적인 정신을 가진 분입니다. 틀에 박힌 것을 싫어하고 자신만의 방식으로 삶을 개척해 나갑니다.' },
  { id: '8', name: '임수빈', title: '신중한 전략가', description: '임수빈님은 깊은 통찰력과 전략적 사고를 갖춘 분입니다. 장기적인 관점에서 계획을 세우고 신중하게 실행에 옮깁니다.' },
  { id: '9', name: '한지민', title: '활발한 소통러', description: '한지민님은 뛰어난 소통 능력과 사교성을 가진 분입니다. 어떤 모임에서도 분위기를 밝게 만들고 사람들을 연결하는 역할을 합니다.' },
];

interface Result {
  id: string;
  name: string;
  title: string;
  description: string;
}

// 이름 마스킹 (가운데 글자를 *로)
function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  const first = name[0];
  const last = name[name.length - 1];
  const middle = '*'.repeat(name.length - 2);
  return first + middle + last;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  // 하이라이트된 아이템을 맨 위로 정렬
  const sortedResults = useMemo(() => {
    if (!highlightId) return dummyResults;
    const highlighted = dummyResults.find((r) => r.id === highlightId);
    if (!highlighted) return dummyResults;
    return [highlighted, ...dummyResults.filter((r) => r.id !== highlightId)];
  }, [highlightId]);

  // URL에 id가 있으면 해당 다이얼로그 자동 열기
  useEffect(() => {
    if (highlightId) {
      const result = dummyResults.find((r) => r.id === highlightId);
      if (result) {
        setSelectedResult(result);
      }
    }
  }, [highlightId]);

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
          {sortedResults.map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result)}
              className="group relative aspect-square rounded-2xl overflow-hidden text-left"
            >
              {/* 이미지 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center">
                <svg className="w-12 h-12 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <p className="text-base font-bold">{maskName(result.name)}</p>
                <p className="text-sm text-white/80">{result.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 다이얼로그 */}
      {selectedResult && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 */}
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] rounded-t-2xl flex items-center justify-center">
              <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* 콘텐츠 */}
            <div className="p-5">
              <p className="text-sm text-[#8B95A1] mb-1">{maskName(selectedResult.name)}님의 결과</p>
              <h3 className="text-lg font-bold text-[#191F28] mb-3">{selectedResult.title}</h3>
              <p className="text-[#4E5968] leading-relaxed text-sm">{selectedResult.description}</p>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedResult(null)}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-[#4E5968] bg-[#F4F4F4] hover:bg-[#E5E8EB] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

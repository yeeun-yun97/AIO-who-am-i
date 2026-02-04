'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPublicResults, getSharedResultById, SharedResultPublic } from '@/lib/supabase';

interface DisplayResult {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

function toDisplayResult(result: SharedResultPublic): DisplayResult {
  return {
    id: result.id,
    name: result.user_name_privacy,
    title: result.title,
    description: result.description,
    imageUrl: result.image_url,
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DisplayResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 결과 목록 불러오기
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const data = await getPublicResults(50);
        setResults(data.map(toDisplayResult));
      } catch (err) {
        console.error('결과 불러오기 실패:', err);
        setError('결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  // 하이라이트된 아이템을 맨 위로 정렬
  const sortedResults = useMemo(() => {
    if (!highlightId || results.length === 0) return results;
    const highlighted = results.find((r) => r.id === highlightId);
    if (!highlighted) return results;
    return [highlighted, ...results.filter((r) => r.id !== highlightId)];
  }, [highlightId, results]);

  // URL에 id가 있으면 해당 다이얼로그 자동 열기
  useEffect(() => {
    if (highlightId && results.length > 0) {
      const result = results.find((r) => r.id === highlightId);
      if (result) {
        setSelectedResult(result);
      } else {
        // 목록에 없으면 직접 조회
        getSharedResultById(highlightId).then((data) => {
          if (data) {
            setSelectedResult(toDisplayResult(data));
          }
        });
      }
    }
  }, [highlightId, results]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-[#191F28] mb-6 flex items-center gap-2">
            <span>👀</span>
            다른 결과 구경하기
          </h1>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-[#F4F4F4] animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[#8B95A1]">{error}</p>
        </div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-[#191F28] mb-6 flex items-center gap-2">
            <span>👀</span>
            다른 결과 구경하기
          </h1>
          <div className="text-center py-12">
            <p className="text-[#8B95A1]">아직 공유된 결과가 없어요.</p>
            <p className="text-[#8B95A1] text-sm mt-2">테스트를 완료하고 첫 번째로 공유해보세요!</p>
          </div>
        </div>
      </main>
    );
  }

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
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left"
            >
              {/* 이미지 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F4] to-[#E5E8EB] flex items-center justify-center">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <p className="text-base font-bold">{result.name}</p>
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
              {selectedResult.imageUrl ? (
                <img
                  src={selectedResult.imageUrl}
                  alt={selectedResult.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <svg className="w-16 h-16 text-[#B0B8C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            {/* 콘텐츠 */}
            <div className="p-5">
              <p className="text-sm text-[#8B95A1] mb-1">{selectedResult.name}님의 결과</p>
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

function ResultsLoading() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-[#191F28] mb-6 flex items-center gap-2">
          <span>👀</span>
          다른 결과 구경하기
        </h1>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-[#F4F4F4] animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}

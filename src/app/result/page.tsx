import { Metadata } from 'next';
import { getSharedResult } from '@/lib/supabase';
import ResultClient from './ResultClient';

// OG 메타 태그 내용 (나중에 쉽게 수정 가능)
const OG_CONFIG = {
  siteName: '나를 알아가는 여정',
  getTitle: (userName: string) => `${userName}님의 심리테스트 결과`,
  getDescription: (mbtiResult: string | null) =>
    mbtiResult ? `MBTI: ${mbtiResult}` : '심리테스트 결과를 확인해보세요!',
  defaultTitle: '심리테스트 결과',
  defaultDescription: '33개의 질문으로 알아보는 MBTI와 기질',
};

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

// 동적 메타데이터 생성 (슬랙 미리보기용)
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id } = await searchParams;

  // 공유 링크가 아니면 기본 메타데이터
  if (!id) {
    return {
      title: OG_CONFIG.defaultTitle,
      description: OG_CONFIG.defaultDescription,
      openGraph: {
        title: OG_CONFIG.defaultTitle,
        description: OG_CONFIG.defaultDescription,
        siteName: OG_CONFIG.siteName,
      },
    };
  }

  // 공유 결과 가져오기
  const sharedResult = await getSharedResult(id);

  if (!sharedResult) {
    return {
      title: '결과를 찾을 수 없어요',
      description: '링크가 잘못되었거나 결과가 삭제되었어요.',
    };
  }

  const title = OG_CONFIG.getTitle(sharedResult.userName);
  const description = OG_CONFIG.getDescription(sharedResult.mbtiResult);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: OG_CONFIG.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ResultPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  // 공유 링크로 접속한 경우 결과 미리 가져오기
  let sharedResult = null;
  if (id) {
    sharedResult = await getSharedResult(id);
  }

  return <ResultClient sharedResult={sharedResult} sharedSessionId={id} />;
}

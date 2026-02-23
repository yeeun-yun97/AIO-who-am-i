'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  MBTIResult,
  TCIResult,
  ValueResult,
  UserInfo
} from '@/types/quiz';
import { SajuResult } from '@/lib/saju';
import {
  saveQuizResult,
  saveSharedResult,
  generateAIAnalysis,
  AIAnalysisResponse,
  SharedResultPublic,
  updateSharedResult // 추가
} from '@/lib/supabase';
import { maskName } from '@/lib/utils';

interface UseAIAnalysisProps {
  mbtiResult: MBTIResult | null;
  tciResult: TCIResult | null;
  valueResult: ValueResult | null;
  sajuResult: SajuResult | null;
  userInfo: UserInfo | null;
  sessionId: string | null;
  isSharedView: boolean;
  hasSavedResult: boolean;
  sharedResultPublic?: SharedResultPublic | null;
}

export function useAIAnalysis({
  mbtiResult,
  tciResult,
  valueResult,
  sajuResult,
  userInfo,
  sessionId,
  isSharedView,
  hasSavedResult,
  sharedResultPublic,
}: UseAIAnalysisProps) {
  const t = useTranslations();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [sharedResultId, setSharedResultId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const savedRef = useRef(false);

  // 이미지 재생성 핸들러 (테스트용)
  const handleRefreshImage = async () => {
    if (!mbtiResult || !tciResult || !valueResult || !sajuResult || isRefreshing) return;

    try {
      setIsRefreshing(true);
      const userName = userInfo?.name || '익명';

      const analysis = await generateAIAnalysis({
        userName,
        mbti: {
          type: mbtiResult.type,
          dimensions: mbtiResult.dimensions,
        },
        tci: tciResult as unknown as Record<string, { level: string; score?: number }>,
        saju: {
          coloredZodiac: {
            animal: sajuResult.coloredZodiac.animal,
            animalKey: sajuResult.coloredZodiac.animalKey,
            colorKey: sajuResult.coloredZodiac.colorKey,
            colorName: sajuResult.coloredZodiac.colorName,
            fullName: sajuResult.coloredZodiac.fullName,
          },
          zodiacSign: {
            name: sajuResult.zodiacSign.name,
            nameEn: sajuResult.zodiacSign.nameEn,
            emoji: sajuResult.zodiacSign.emoji,
          },
        },
        value: valueResult as unknown as Record<string, { score: number; rank: number }>,
      });

      if (analysis) {
        setAiAnalysis(analysis);
        
        // DB 업데이트 (shared_results)
        const currentSharedId = sharedResultId || sharedResultPublic?.id;
        if (currentSharedId) {
          await updateSharedResult(
            currentSharedId,
            analysis.title_ko,
            analysis.description_ko,
            analysis.image_url,
            analysis.title_en,
            analysis.description_en
          );
        }
      }
    } catch (err) {
      console.error('이미지 재생성 실패:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 공유 뷰일 때 DB에 저장된 AI 분석 결과로 초기화
  useEffect(() => {
    if (isSharedView && sharedResultPublic) {
      setAiAnalysis({
        title_ko: sharedResultPublic.title,
        title_en: sharedResultPublic.title_en || '',
        description_ko: sharedResultPublic.description,
        description_en: sharedResultPublic.description_en || '',
        image_url: sharedResultPublic.image_url || undefined,
      });
    }
  }, [isSharedView, sharedResultPublic]);

  useEffect(() => {
    if (isSharedView || hasSavedResult || !mbtiResult || !tciResult || !valueResult || !sessionId) {
      return;
    }

    if (!savedRef.current) {
      savedRef.current = true;
      setAiLoading(true);

      const userName = userInfo?.name || '익명';
      const maskedName = maskName(userName);

      const aiAnalysisPromise = sajuResult ? generateAIAnalysis({
        userName,
        mbti: {
          type: mbtiResult.type,
          dimensions: mbtiResult.dimensions,
        },
        tci: tciResult as unknown as Record<string, { level: string; score?: number }>,
        saju: {
          coloredZodiac: {
            animal: sajuResult.coloredZodiac.animal,
            animalKey: sajuResult.coloredZodiac.animalKey,
            colorKey: sajuResult.coloredZodiac.colorKey,
            colorName: sajuResult.coloredZodiac.colorName,
            fullName: sajuResult.coloredZodiac.fullName,
          },
          zodiacSign: {
            name: sajuResult.zodiacSign.name,
            nameEn: sajuResult.zodiacSign.nameEn,
            emoji: sajuResult.zodiacSign.emoji,
          },
        },
        value: valueResult as unknown as Record<string, { score: number; rank: number }>,
      }).catch((err) => {
        console.error('AI 분석 실패:', err);
        return null;
      }) : Promise.resolve(null);

      const quizResultPromise = saveQuizResult(
        sessionId,
        mbtiResult.type,
        Object.fromEntries(
          Object.entries(tciResult).map(([k, v]) => [k, (v as any).score])
        ) as Record<string, number>,
        Object.fromEntries(
          Object.entries(valueResult).flatMap(([dim, v]) => {
            const [left, right] = dim.split('/');
            const scores = (v as any).scores;
            return [
              [left, scores.left],
              [right, scores.right]
            ];
          })
        ) as Record<string, number>
      );

      Promise.all([aiAnalysisPromise, quizResultPromise])
        .then(async ([analysis, quizResult]) => {
          if (analysis) {
            setAiAnalysis(analysis);
          }
          setAiLoading(false);

          const title = analysis?.title_ko || t('result.defaultTitle');
          const description = analysis?.description_ko ||
            t('result.defaultDescription', { name: userName });

          const sharedResult = await saveSharedResult(
            quizResult.id,
            maskedName,
            title,
            description,
            analysis?.image_url,
            analysis?.title_en,
            analysis?.description_en
          );

          if (sharedResult) {
            setSharedResultId(sharedResult.id);
          }
        })
        .catch((err) => {
          console.error('결과 저장 실패:', err);
          setAiLoading(false);
        });
    }
  }, [
    mbtiResult,
    tciResult,
    valueResult,
    sajuResult,
    userInfo,
    sessionId,
    isSharedView,
    hasSavedResult,
    t
  ]);

  return {
    aiLoading,
    aiAnalysis,
    sharedResultId,
    handleRefreshImage,
    isRefreshing,
  };
}

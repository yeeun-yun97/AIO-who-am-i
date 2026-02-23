'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { MBTIResult, TCIResult, ValueResult, UserInfo } from '@/types/quiz';
import { calculateSaju, SajuResult } from '@/lib/saju';
import { SharedResult } from '@/lib/supabase';
import { getTCIInterpretation, getValueInterpretation } from '@/lib/quiz-utils';
import { Locale } from '@/i18n/config';

interface UseResultDataProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
  locale: Locale;
}

export function useResultData({ sharedResult, sharedSessionId, locale }: UseResultDataProps) {
  const { calculateMBTI, calculateTCI, calculateValue, state } = useQuiz();
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [tciResult, setTciResult] = useState<TCIResult | null>(null);
  const [valueResult, setValueResult] = useState<ValueResult | null>(null);

  const isSharedView = !!sharedResult;

  const sajuResult = useMemo<SajuResult | null>(() => {
    // 공유 뷰든 아니든 birthDate가 있으면 재계산 (DB에 saju_result가 없으므로)
    const birthDate = isSharedView ? sharedResult?.birthDate : state.userInfo?.birthDate;
    if (birthDate) {
      return calculateSaju(birthDate, null);
    }
    return null;
  }, [isSharedView, sharedResult, state.userInfo]);

  const displayUserInfo = useMemo<UserInfo | null>(() => {
    if (isSharedView && sharedResult) {
      return {
        name: sharedResult.userName,
        birthDate: sharedResult.birthDate,
      };
    }
    return state.userInfo;
  }, [isSharedView, sharedResult, state.userInfo]);

  useEffect(() => {
    if (isSharedView && sharedResult) {
      if (sharedResult.mbtiResult) {
        setMbtiResult({
          type: sharedResult.mbtiResult,
          scores: { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 },
          dimensions: {
            IE: { dominant: sharedResult.mbtiResult[0] as 'E' | 'I' | 'Ambivert', percentage: 75 },
            NS: { dominant: sharedResult.mbtiResult[1] as 'N' | 'S' | '중간', percentage: 75 },
            TF: { dominant: sharedResult.mbtiResult[2] as 'T' | 'F' | '중간', percentage: 75 },
            JP: { dominant: sharedResult.mbtiResult[3] as 'J' | 'P' | '중간', percentage: 75 },
          },
        });
      }
      if (sharedResult.tciScores) {
        setTciResult(getTCIInterpretation(sharedResult.tciScores as Record<string, number>, locale));
      }
      if (sharedResult.valueScores) {
        setValueResult(getValueInterpretation(sharedResult.valueScores as Record<string, number>, locale));
      }
      return;
    }

    if (state.savedResult) {
      const savedMbti = state.savedResult.mbti_result;
      const savedTci = state.savedResult.tci_scores;
      const savedValue = state.savedResult.value_scores;

      if (savedMbti) {
        setMbtiResult({
          type: savedMbti,
          scores: { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 },
          dimensions: {
            IE: { dominant: savedMbti[0] as 'E' | 'I' | 'Ambivert', percentage: 75 },
            NS: { dominant: savedMbti[1] as 'N' | 'S' | '중간', percentage: 75 },
            TF: { dominant: savedMbti[2] as 'T' | 'F' | '중간', percentage: 75 },
            JP: { dominant: savedMbti[3] as 'J' | 'P' | '중간', percentage: 75 },
          },
        });
      }
      if (savedTci) setTciResult(getTCIInterpretation(savedTci, locale));
      if (savedValue) setValueResult(getValueInterpretation(savedValue, locale));
      return;
    }

    if (state.answers.length > 0) {
      setMbtiResult(calculateMBTI());
      setTciResult(calculateTCI());
      setValueResult(calculateValue());
    }
  }, [isSharedView, sharedResult, state.savedResult, state.answers, calculateMBTI, calculateTCI, calculateValue, locale]);

  return {
    mbtiResult,
    tciResult,
    valueResult,
    sajuResult,
    displayUserInfo,
    isSharedView,
    state,
  };
}

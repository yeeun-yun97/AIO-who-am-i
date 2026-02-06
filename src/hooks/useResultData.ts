'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { MBTIResult, TCIResult, ValueResult, UserInfo } from '@/types/quiz';
import { calculateSaju, SajuResult } from '@/lib/saju';
import { SharedResult } from '@/lib/supabase';

interface UseResultDataProps {
  sharedResult?: SharedResult | null;
  sharedSessionId?: string | null;
}

export function useResultData({ sharedResult, sharedSessionId }: UseResultDataProps) {
  const { calculateMBTI, calculateTCI, calculateValue, state } = useQuiz();
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [tciResult, setTciResult] = useState<TCIResult | null>(null);
  const [valueResult, setValueResult] = useState<ValueResult | null>(null);

  const isSharedView = !!sharedResult;

  const sajuResult = useMemo<SajuResult | null>(() => {
    if (isSharedView && sharedResult?.sajuResult) {
      return sharedResult.sajuResult as unknown as SajuResult;
    }
    if (state.userInfo?.birthDate) {
      return calculateSaju(state.userInfo.birthDate, null);
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
        setTciResult(sharedResult.tciScores as unknown as TCIResult);
      }
      if (sharedResult.valueScores) {
        setValueResult(sharedResult.valueScores as unknown as ValueResult);
      }
      return;
    }

    if (state.savedResult) {
      const savedMbti = state.savedResult.mbti_result;
      const savedTci = state.savedResult.tci_scores as unknown as TCIResult;
      const savedValue = state.savedResult.value_scores as unknown as ValueResult;

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
      if (savedTci) setTciResult(savedTci);
      if (savedValue) setValueResult(savedValue);
      return;
    }

    if (state.answers.length > 0) {
      setMbtiResult(calculateMBTI());
      setTciResult(calculateTCI());
      setValueResult(calculateValue());
    }
  }, [isSharedView, sharedResult, state.savedResult, state.answers, calculateMBTI, calculateTCI, calculateValue]);

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

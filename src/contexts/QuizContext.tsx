'use client';

import { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { QuizState, QuizAction, Answer, MBTIResult, TCIResult, ValueResult, UserInfo, SavedQuizResult } from '@/types/quiz';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';
import { getQuestionsByLocale, TOTAL_QUESTIONS } from '@/data/questions';
import { Locale } from '@/i18n/config';
import { getTCIInterpretation, getValueInterpretation } from '@/lib/quiz-utils';

const initialState: QuizState = {
  userInfo: null,
  currentIndex: 0,
  answers: [],
  isCompleted: false,
  sessionId: null,
  savedResult: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };

    case 'SELECT_OPTION':
      const existingIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      const newAnswers =
        existingIndex >= 0
          ? state.answers.map((a, i) => (i === existingIndex ? action.payload : a))
          : [...state.answers, action.payload];
      return { ...state, answers: newAnswers };

    case 'NEXT_QUESTION':
      const nextIndex = state.currentIndex + 1;
      const isCompleted = nextIndex >= TOTAL_QUESTIONS;
      return { ...state, currentIndex: nextIndex, isCompleted };

    case 'RESET':
      return initialState;

    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };

    case 'SET_SAVED_RESULT':
      return { ...state, savedResult: action.payload };

    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  setUserInfo: (info: UserInfo) => void;
  selectOption: (answer: Answer) => void;
  nextQuestion: () => void;
  reset: () => void;
  getCurrentAnswer: () => Answer | undefined;
  calculateMBTI: () => MBTIResult;
  calculateTCI: () => TCIResult;
  calculateValue: () => ValueResult;
  setSessionId: (id: string) => void;
  setSavedResult: (result: SavedQuizResult) => void;
  locale: Locale;
  questions: ReturnType<typeof getQuestionsByLocale>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children, locale = 'ko' }: { children: ReactNode; locale?: Locale }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // 언어별 질문과 결과 데이터
  const questions = useMemo(() => getQuestionsByLocale(locale), [locale]);
  const resultsData = locale === 'en' ? resultsEn : results;

  const setUserInfo = (info: UserInfo) => {
    dispatch({ type: 'SET_USER_INFO', payload: info });
  };

  const selectOption = (answer: Answer) => {
    dispatch({ type: 'SELECT_OPTION', payload: answer });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const setSessionId = (id: string) => {
    dispatch({ type: 'SET_SESSION_ID', payload: id });
  };

  const setSavedResult = (result: SavedQuizResult) => {
    dispatch({ type: 'SET_SAVED_RESULT', payload: result });
  };

  const getCurrentAnswer = () => {
    const currentQuestion = questions[state.currentIndex];
    return state.answers.find((a) => a.questionId === currentQuestion?.id);
  };

  const calculateMBTI = (): MBTIResult => {
    const scores = {
      E: 0, I: 0,
      N: 0, S: 0,
      T: 0, F: 0,
      J: 0, P: 0,
    };

    // 점수 합산
    state.answers.forEach((answer) => {
      Object.entries(answer.score).forEach(([key, value]) => {
        if (key in scores) {
          scores[key as keyof typeof scores] += value || 0;
        }
      });
    });

    // 각 차원별 결과 계산
    const getPercentage = (a: number, b: number): number => {
      const total = a + b;
      if (total === 0) return 50;
      return Math.round((Math.max(a, b) / (total === 0 ? 1 : total)) * 100);
    };

    const middleLabel = locale === 'en' ? 'Balanced' : '중간';
    const ambivertLabel = locale === 'en' ? 'Ambivert' : 'Ambivert';

    const dimensions = {
      IE: {
        dominant: scores.E > scores.I ? 'E' : scores.I > scores.E ? 'I' : ambivertLabel,
        percentage: getPercentage(scores.E, scores.I),
      } as { dominant: 'E' | 'I' | 'Ambivert'; percentage: number },
      NS: {
        dominant: scores.N > scores.S ? 'N' : scores.S > scores.N ? 'S' : middleLabel,
        percentage: getPercentage(scores.N, scores.S),
      } as { dominant: 'N' | 'S' | '중간'; percentage: number },
      TF: {
        dominant: scores.T > scores.F ? 'T' : scores.F > scores.T ? 'F' : middleLabel,
        percentage: getPercentage(scores.T, scores.F),
      } as { dominant: 'T' | 'F' | '중간'; percentage: number },
      JP: {
        dominant: scores.J > scores.P ? 'J' : scores.P > scores.J ? 'P' : middleLabel,
        percentage: getPercentage(scores.J, scores.P),
      } as { dominant: 'J' | 'P' | '중간'; percentage: number },
    };

    // MBTI 타입 문자열 생성
    const type = [
      dimensions.IE.dominant === ambivertLabel ? 'X' : dimensions.IE.dominant,
      dimensions.NS.dominant === middleLabel ? 'X' : dimensions.NS.dominant,
      dimensions.TF.dominant === middleLabel ? 'X' : dimensions.TF.dominant,
      dimensions.JP.dominant === middleLabel ? 'X' : dimensions.JP.dominant,
    ].join('');

    return { type, scores, dimensions };
  };

  const calculateTCI = (): TCIResult => {
    const scores = { NS: 0, HA: 0, RD: 0, PS: 0, SD: 0, CO: 0, ST: 0 };

    // TCI 점수 합산
    state.answers.forEach((answer) => {
      Object.entries(answer.score).forEach(([key, value]) => {
        if (key in scores) {
          scores[key as keyof typeof scores] += value || 0;
        }
      });
    });

    return getTCIInterpretation(scores, locale);
  };

  const calculateValue = (): ValueResult => {
    const scores = {
      Stability: 0, Change: 0,
      Relationship: 0, Individual: 0,
      Achievement: 0, Balance: 0,
      Reality: 0, Meaning: 0,
    };

    // 가치관 점수 합산
    state.answers.forEach((answer) => {
      Object.entries(answer.score).forEach(([key, value]) => {
        if (key in scores) {
          scores[key as keyof typeof scores] += value || 0;
        }
      });
    });

    return getValueInterpretation(scores, locale);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        setUserInfo,
        selectOption,
        nextQuestion,
        reset,
        getCurrentAnswer,
        calculateMBTI,
        calculateTCI,
        calculateValue,
        setSessionId,
        setSavedResult,
        locale,
        questions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

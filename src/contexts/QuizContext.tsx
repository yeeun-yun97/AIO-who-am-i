'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizState, QuizAction, Answer, MBTIResult, TCIResult, ValueResult, UserInfo, SavedQuizResult } from '@/types/quiz';
import valueDescriptions from '@/data/value-result.json';
import { questions, TOTAL_QUESTIONS } from '@/data/questions';

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
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

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

    const dimensions = {
      IE: {
        dominant: scores.E > scores.I ? 'E' : scores.I > scores.E ? 'I' : 'Ambivert',
        percentage: getPercentage(scores.E, scores.I),
      } as { dominant: 'E' | 'I' | 'Ambivert'; percentage: number },
      NS: {
        dominant: scores.N > scores.S ? 'N' : scores.S > scores.N ? 'S' : '중간',
        percentage: getPercentage(scores.N, scores.S),
      } as { dominant: 'N' | 'S' | '중간'; percentage: number },
      TF: {
        dominant: scores.T > scores.F ? 'T' : scores.F > scores.T ? 'F' : '중간',
        percentage: getPercentage(scores.T, scores.F),
      } as { dominant: 'T' | 'F' | '중간'; percentage: number },
      JP: {
        dominant: scores.J > scores.P ? 'J' : scores.P > scores.J ? 'P' : '중간',
        percentage: getPercentage(scores.J, scores.P),
      } as { dominant: 'J' | 'P' | '중간'; percentage: number },
    };

    // MBTI 타입 문자열 생성
    const type = [
      dimensions.IE.dominant === 'Ambivert' ? 'X' : dimensions.IE.dominant,
      dimensions.NS.dominant === '중간' ? 'X' : dimensions.NS.dominant,
      dimensions.TF.dominant === '중간' ? 'X' : dimensions.TF.dominant,
      dimensions.JP.dominant === '중간' ? 'X' : dimensions.JP.dominant,
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

    // TCI 해석 함수
    const getLevel = (score: number, dimension: keyof typeof scores): '높음' | '중간' | '낮음' => {
      // 각 차원별 점수 범위에 따라 레벨 판정
      // 3문항 기준: 최대 +6, 최소 -3 (또는 -6)
      if (dimension === 'NS' || dimension === 'PS' || dimension === 'SD' || dimension === 'CO') {
        if (score >= 4) return '높음';
        if (score >= 1) return '중간';
        return '낮음';
      }
      if (dimension === 'HA' || dimension === 'RD') {
        if (score >= 1) return '높음';
        if (score >= -2) return '중간';
        return '낮음';
      }
      if (dimension === 'ST') {
        if (score >= 3) return '높음';
        if (score >= -1) return '중간';
        return '낮음';
      }
      return '중간';
    };

    const descriptions = {
      NS: {
        '높음': '충동적이고 새로운 자극을 선호함',
        '중간': '상황에 따라 새로움과 안정성을 균형 있게 추구함',
        '낮음': '안정적이고 익숙한 방식을 선호함',
      },
      HA: {
        '높음': '불안 민감도가 높고 신중하며 위험을 회피하는 성향',
        '중간': '상황에 따라 신중함과 도전을 균형 있게 조절함',
        '낮음': '낙관적이고 위험에 대한 두려움이 적은 편',
      },
      RD: {
        '높음': '타인의 반응과 관계에 민감하며 정서적 유대를 중시함',
        '중간': '관계와 독립성 사이에서 균형을 이룸',
        '낮음': '독립적이며 외부 인정에 크게 좌우되지 않음',
      },
      PS: {
        '높음': '끈기 있고 목표 달성까지 지속적으로 노력함',
        '중간': '상황에 따라 지속과 포기를 조절함',
        '낮음': '유연하지만 장기적 지속에는 부담을 느낄 수 있음',
      },
      SD: {
        '높음': '책임감과 자기통제력이 높고 목표지향적임',
        '중간': '상황에 따라 자기주도성과 유연성을 함께 보임',
        '낮음': '외부 환경의 영향을 크게 느끼며 방향 설정에 어려움을 겪을 수 있음',
      },
      CO: {
        '높음': '공감 능력이 높고 협력과 배려를 중시함',
        '중간': '상황에 따라 협력과 개인 기준을 조절함',
        '낮음': '독립적이며 개인 기준을 우선하는 경향이 있음',
      },
      ST: {
        '높음': '자아를 초월하고 넓은 관점에서 삶을 이해하려 함',
        '중간': '상황과 필요에 따라 자기와 타인을 균형 있게 고려함',
        '낮음': '개인적·현실적 관점에 초점을 두는 편',
      },
    };

    const result: TCIResult = {
      NS: { score: scores.NS, level: getLevel(scores.NS, 'NS'), description: '' },
      HA: { score: scores.HA, level: getLevel(scores.HA, 'HA'), description: '' },
      RD: { score: scores.RD, level: getLevel(scores.RD, 'RD'), description: '' },
      PS: { score: scores.PS, level: getLevel(scores.PS, 'PS'), description: '' },
      SD: { score: scores.SD, level: getLevel(scores.SD, 'SD'), description: '' },
      CO: { score: scores.CO, level: getLevel(scores.CO, 'CO'), description: '' },
      ST: { score: scores.ST, level: getLevel(scores.ST, 'ST'), description: '' },
    };

    // 각 차원별 설명 추가
    (Object.keys(result) as (keyof TCIResult)[]).forEach((key) => {
      result[key].description = descriptions[key][result[key].level];
    });

    return result;
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

    // 각 차원별 결과 계산
    const getDimensionResult = (
      dimension: keyof typeof valueDescriptions,
      leftKey: keyof typeof scores,
      rightKey: keyof typeof scores
    ) => {
      const leftScore = scores[leftKey];
      const rightScore = scores[rightKey];
      const dimData = valueDescriptions[dimension] as Record<string, { label: string; description: string }>;

      let dominant: string;
      if (leftScore > rightScore) {
        dominant = leftKey;
      } else if (rightScore > leftScore) {
        dominant = rightKey;
      } else {
        dominant = 'Balanced';
      }

      const resultData = dimData[dominant];
      return {
        dominant,
        label: resultData?.label || '',
        description: resultData?.description || '',
        scores: { left: leftScore, right: rightScore },
      };
    };

    return {
      'Stability/Change': getDimensionResult('Stability/Change', 'Stability', 'Change'),
      'Relationship/Individual': getDimensionResult('Relationship/Individual', 'Relationship', 'Individual'),
      'Achievement/Balance': getDimensionResult('Achievement/Balance', 'Achievement', 'Balance'),
      'Reality/Meaning': getDimensionResult('Reality/Meaning', 'Reality', 'Meaning'),
    };
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

'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizState, QuizAction, Answer, Category } from '@/types/quiz';
import { questions } from '@/data/questions';

const initialState: QuizState = {
  currentIndex: 0,
  answers: [],
  isCompleted: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
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
      const isCompleted = nextIndex >= questions.length;
      return { ...state, currentIndex: nextIndex, isCompleted };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  selectOption: (answer: Answer) => void;
  nextQuestion: () => void;
  reset: () => void;
  getCurrentAnswer: () => Answer | undefined;
  calculateScores: () => Record<Category, number>;
  calculatePercentages: () => Record<Category, number>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const selectOption = (answer: Answer) => {
    dispatch({ type: 'SELECT_OPTION', payload: answer });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const getCurrentAnswer = () => {
    const currentQuestion = questions[state.currentIndex];
    return state.answers.find((a) => a.questionId === currentQuestion?.id);
  };

  const calculateScores = (): Record<Category, number> => {
    const scores: Record<Category, number> = {
      sensitivity: 0,
      flexibility: 0,
      extroversion: 0,
      rationality: 0,
      creativity: 0,
    };

    state.answers.forEach((answer) => {
      Object.entries(answer.scores).forEach(([category, score]) => {
        scores[category as Category] += score || 0;
      });
    });

    return scores;
  };

  const calculatePercentages = (): Record<Category, number> => {
    const scores = calculateScores();
    const maxPossibleScore = 20 * 4; // 20 questions * max 4 points

    const percentages: Record<Category, number> = {
      sensitivity: 0,
      flexibility: 0,
      extroversion: 0,
      rationality: 0,
      creativity: 0,
    };

    Object.entries(scores).forEach(([category, score]) => {
      percentages[category as Category] = Math.round((score / maxPossibleScore) * 100);
    });

    return percentages;
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        selectOption,
        nextQuestion,
        reset,
        getCurrentAnswer,
        calculateScores,
        calculatePercentages,
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

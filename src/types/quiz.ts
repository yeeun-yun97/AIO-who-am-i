export type Category = 'sensitivity' | 'flexibility' | 'extroversion' | 'rationality' | 'creativity';

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'sensitivity', name: '민감도', description: '감정과 환경에 대한 민감함' },
  { id: 'flexibility', name: '유연함', description: '변화에 대한 적응력' },
  { id: 'extroversion', name: '외향성', description: '사회적 에너지' },
  { id: 'rationality', name: '합리성', description: '논리적 사고 성향' },
  { id: 'creativity', name: '창의성', description: '독창적 사고력' },
];

export interface Option {
  id: string;
  text: string;
  scores: Partial<Record<Category, number>>;
}

export interface Question {
  id: number;
  text: string;
  category: Category;
  options: Option[];
}

export interface Answer {
  questionId: number;
  optionId: string;
  scores: Partial<Record<Category, number>>;
}

export interface QuizState {
  currentIndex: number;
  answers: Answer[];
  isCompleted: boolean;
}

export type QuizAction =
  | { type: 'SELECT_OPTION'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' };

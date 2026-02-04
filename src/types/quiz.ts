// MBTI 차원
export type MBTIDimension = 'IE' | 'NS' | 'TF' | 'JP';
export type MBTITrait = 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P';

// TCI 차원 (7개)
export type TCIDimension = 'NS' | 'HA' | 'RD' | 'PS' | 'SD' | 'CO' | 'ST';

// 모든 차원 타입
export type Dimension = 'I/E' | 'N/S' | 'T/F' | 'J/P' | 'TCI-NS' | 'TCI-HA' | 'TCI-RD' | 'TCI-PS' | 'TCI-SD' | 'TCI-CO' | 'TCI-ST';

// 점수 타입
export type ScoreKey = 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P' | 'NS' | 'HA' | 'RD' | 'PS' | 'SD' | 'CO' | 'ST';

export interface Option {
  key: string;
  text: string;
  score: Partial<Record<ScoreKey, number>>;
}

export interface Question {
  id: string;
  dimension: Dimension;
  question: string;
  options: Option[];
}

export interface RawDimensionData {
  dimension: Dimension;
  description: string;
  questions: {
    id: string;
    question: string;
    options: {
      key: string;
      text: string;
      score: Partial<Record<ScoreKey, number>>;
    }[];
  }[];
}

export interface Answer {
  questionId: string;
  optionKey: string;
  score: Partial<Record<ScoreKey, number>>;
}

// 사용자 정보
export interface UserInfo {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string | null; // HH:mm or null if unknown
}

export interface QuizState {
  userInfo: UserInfo | null;
  currentIndex: number;
  answers: Answer[];
  isCompleted: boolean;
  sessionId: string | null;
  savedResult: SavedQuizResult | null;
}

// 저장된 퀴즈 결과
export interface SavedQuizResult {
  mbti_result: string;
  saju_result: Record<string, unknown>;
  tci_scores: Record<string, unknown>;
}

export type QuizAction =
  | { type: 'SET_USER_INFO'; payload: UserInfo }
  | { type: 'SELECT_OPTION'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'SET_SAVED_RESULT'; payload: SavedQuizResult };

// MBTI 결과 타입
export interface MBTIResult {
  type: string; // e.g., "ENFP"
  scores: {
    E: number;
    I: number;
    N: number;
    S: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  dimensions: {
    IE: { dominant: 'E' | 'I' | 'Ambivert'; percentage: number };
    NS: { dominant: 'N' | 'S' | '중간'; percentage: number };
    TF: { dominant: 'T' | 'F' | '중간'; percentage: number };
    JP: { dominant: 'J' | 'P' | '중간'; percentage: number };
  };
}

// TCI 결과 타입 (7개 차원)
export interface TCIResult {
  NS: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  HA: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  RD: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  PS: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  SD: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  CO: { score: number; level: '높음' | '중간' | '낮음'; description: string };
  ST: { score: number; level: '높음' | '중간' | '낮음'; description: string };
}

// 카테고리 정보 (결과 표시용)
export interface DimensionInfo {
  id: string;
  name: string;
  description: string;
}

export const MBTI_DIMENSIONS: DimensionInfo[] = [
  { id: 'IE', name: '에너지 방향', description: '외향(E) vs 내향(I)' },
  { id: 'NS', name: '인식 기능', description: '직관(N) vs 감각(S)' },
  { id: 'TF', name: '판단 기능', description: '사고(T) vs 감정(F)' },
  { id: 'JP', name: '생활 양식', description: '판단(J) vs 인식(P)' },
];

export const TCI_DIMENSIONS: DimensionInfo[] = [
  { id: 'NS', name: '새로움 추구', description: '새로운 자극과 경험에 대한 선호도' },
  { id: 'HA', name: '위험 회피', description: '불확실성과 위험에 대한 민감도' },
  { id: 'RD', name: '보상 의존', description: '타인의 인정과 관계에 대한 민감도' },
  { id: 'PS', name: '인내력', description: '목표를 향한 지속적 노력 성향' },
  { id: 'SD', name: '자기주도성', description: '책임감과 목표지향적 자기통제' },
  { id: 'CO', name: '협동성', description: '타인과의 협력 및 공감 능력' },
  { id: 'ST', name: '자기초월', description: '더 넓은 관점에서 삶을 이해하려는 성향' },
];

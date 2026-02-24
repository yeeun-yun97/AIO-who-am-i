// MBTI 차원
export type MBTIDimension = 'IE' | 'NS' | 'TF' | 'JP';
export type MBTITrait = 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P';

// TCI 차원 (7개)
export type TCIDimension = 'NS' | 'HA' | 'RD' | 'PS' | 'SD' | 'CO' | 'ST';

// 가치관 차원 (4개)
export type ValueDimension = 'Stability/Change' | 'Relationship/Individual' | 'Achievement/Balance' | 'Reality/Meaning';

// 모든 차원 타입
export type Dimension = 'I/E' | 'N/S' | 'T/F' | 'J/P' | 'TCI-NS' | 'TCI-HA' | 'TCI-RD' | 'TCI-PS' | 'TCI-SD' | 'TCI-CO' | 'TCI-ST' | ValueDimension;

// 점수 타입
export type ScoreKey = 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P' | 'NS' | 'HA' | 'RD' | 'PS' | 'SD' | 'CO' | 'ST' | 'Stability' | 'Change' | 'Relationship' | 'Individual' | 'Achievement' | 'Balance' | 'Reality' | 'Meaning';

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
  tci_scores: Record<string, number>;
  value_scores?: Record<string, number>;
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
    IE: { dominant: 'E' | 'I' | '중간'; percentage: number };
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

// 가치관 결과 타입 (4개 차원)
export interface ValueDimensionResult {
  dominant: string;  // 'Stability' | 'Change' | 'Balanced' 등
  label: string;     // '안정 추구형' 등
  description: string;
  scores: { left: number; right: number };  // 양쪽 점수
}

export interface ValueResult {
  'Stability/Change': ValueDimensionResult;
  'Relationship/Individual': ValueDimensionResult;
  'Achievement/Balance': ValueDimensionResult;
  'Reality/Meaning': ValueDimensionResult;
}

// 카테고리 정보 (결과 표시용)
export interface DimensionInfo {
  id: string;
  name: string;
  description: string;
}

export const getTCIDimensions = (t: any): DimensionInfo[] => [
  { id: 'NS', name: t('tci.dimensions.NS.name'), description: t('tci.dimensions.NS.desc') },
  { id: 'HA', name: t('tci.dimensions.HA.name'), description: t('tci.dimensions.HA.desc') },
  { id: 'RD', name: t('tci.dimensions.RD.name'), description: t('tci.dimensions.RD.desc') },
  { id: 'PS', name: t('tci.dimensions.PS.name'), description: t('tci.dimensions.PS.desc') },
  { id: 'SD', name: t('tci.dimensions.SD.name'), description: t('tci.dimensions.SD.desc') },
  { id: 'CO', name: t('tci.dimensions.CO.name'), description: t('tci.dimensions.CO.desc') },
  { id: 'ST', name: t('tci.dimensions.ST.name'), description: t('tci.dimensions.ST.desc') },
];

export const getValueDimensions = (t: any): { id: ValueDimension; name: string; left: string; right: string }[] => [
  {
    id: 'Stability/Change',
    name: t('valueDimensions.stabilityChange.name'),
    left: t('valueDimensions.stabilityChange.left'),
    right: t('valueDimensions.stabilityChange.right')
  },
  {
    id: 'Relationship/Individual',
    name: t('valueDimensions.relationshipIndividual.name'),
    left: t('valueDimensions.relationshipIndividual.left'),
    right: t('valueDimensions.relationshipIndividual.right')
  },
  {
    id: 'Achievement/Balance',
    name: t('valueDimensions.achievementBalance.name'),
    left: t('valueDimensions.achievementBalance.left'),
    right: t('valueDimensions.achievementBalance.right')
  },
  {
    id: 'Reality/Meaning',
    name: t('valueDimensions.realityMeaning.name'),
    left: t('valueDimensions.realityMeaning.left'),
    right: t('valueDimensions.realityMeaning.right')
  },
];

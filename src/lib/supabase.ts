import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface UserSession {
  id: string;
  name: string;
  birth_date: string;
  ip_address: string;
  session_token: string | null;
  created_at: string;
  last_active_at: string;
}

export interface QuizResult {
  id: string;
  session_id: string;
  mbti_result: string | null;
  tci_scores: Record<string, number> | null;
  value_scores: Record<string, number> | null;
  created_at: string;
}

// 세션 찾기 또는 생성
export async function findOrCreateSession(
  name: string,
  birthDate: string
): Promise<{ session: UserSession; existingResult: QuizResult | null }> {
  // 1. 기존 세션 찾기
  const { data: existingSession } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('name', name)
    .eq('birth_date', birthDate)
    .single();

  if (existingSession) {
    // 마지막 활동 시간 업데이트
    await supabase
      .from('user_sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', existingSession.id);

    // 기존 결과 찾기
    const { data: existingResult } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('session_id', existingSession.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { session: existingSession, existingResult };
  }

  // 2. 새 세션 생성
  const sessionToken = crypto.randomUUID();
  const { data: newSession, error } = await supabase
    .from('user_sessions')
    .insert({
      name,
      birth_date: birthDate,
      ip_address: 'client', // 클라이언트 사이드에서는 IP 못 가져옴
      session_token: sessionToken,
    })
    .select()
    .single();

  if (error) throw error;

  return { session: newSession, existingResult: null };
}

// 퀴즈 결과 저장
export async function saveQuizResult(
  sessionId: string,
  mbtiResult: string,
  tciScores: Record<string, number>,
  valueScores?: Record<string, number>
): Promise<QuizResult> {
  // 기존 결과가 있으면 업데이트, 없으면 생성
  const { data: existing } = await supabase
    .from('quiz_results')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('quiz_results')
      .update({
        mbti_result: mbtiResult,
        tci_scores: tciScores,
        value_scores: valueScores,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      session_id: sessionId,
      mbti_result: mbtiResult,
      tci_scores: tciScores,
      value_scores: valueScores,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 세션 ID로 결과 불러오기
export async function getQuizResultBySessionId(sessionId: string): Promise<QuizResult | null> {
  const { data } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data;
}

// 세션 ID로 결과 + 사용자 정보 함께 불러오기 (공유용)
export interface SharedResult {
  userName: string;
  birthDate: string;
  mbtiResult: string | null;
  tciScores: Record<string, number> | null;
  valueScores: Record<string, number> | null;
}

export async function getSharedResult(sessionId: string): Promise<SharedResult | null> {
  // 세션 정보 가져오기
  const { data: session } = await supabase
    .from('user_sessions')
    .select('name, birth_date')
    .eq('id', sessionId)
    .single();

  if (!session) return null;

  // 결과 가져오기
  const { data: result } = await supabase
    .from('quiz_results')
    .select('mbti_result, tci_scores, value_scores')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!result) return null;

  return {
    userName: session.name,
    birthDate: session.birth_date,
    mbtiResult: result.mbti_result,
    tciScores: result.tci_scores,
    valueScores: result.value_scores,
  };
}

// 공유 결과 테이블 타입
export interface SharedResultPublic {
  id: string;
  quiz_result_id: string;
  user_name_privacy: string;
  title: string;
  description: string;
  title_en: string | null;
  description_en: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

// AI 분석 요청/응답 타입
export interface AIAnalysisRequest {
  userName: string;
  mbti: {
    type: string;
    dimensions: {
      IE: { dominant: string; percentage: number };
      NS: { dominant: string; percentage: number };
      TF: { dominant: string; percentage: number };
      JP: { dominant: string; percentage: number };
    };
  };
  tci: Record<string, { level: string; score?: number }>;
  saju: {
    coloredZodiac: { 
      animal: string; 
      animalKey: string;
      colorKey: string;
      colorName: string; 
      fullName: string 
    };
    zodiacSign: { name: string; nameEn: string; emoji: string };
  };
  value: Record<string, { score: number; rank: number }>;
}

export interface AIAnalysisResponse {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  image_url?: string;
}

// AI 분석 생성
export async function generateAIAnalysis(data: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const response = await fetch(`${supabaseUrl}/functions/v1/generate-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`AI analysis failed: ${response.status}`);
  }

  return response.json();
}

// 공유 결과 저장
export async function saveSharedResult(
  quizResultId: string,
  userNamePrivacy: string,
  title: string,
  description: string,
  imageUrl?: string,
  titleEn?: string,
  descriptionEn?: string
): Promise<SharedResultPublic> {
  // 기존 공유 결과 확인 (quiz_result_id 기준)
  const { data: existing } = await supabase
    .from('shared_results')
    .select('id')
    .eq('quiz_result_id', quizResultId)
    .single();

  if (existing) {
    // 기존 결과 업데이트
    const { data, error } = await supabase
      .from('shared_results')
      .update({
        user_name_privacy: userNamePrivacy,
        title,
        description,
        image_url: imageUrl || null,
        title_en: titleEn || null,
        description_en: descriptionEn || null,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 새 공유 결과 생성
  const { data, error } = await supabase
    .from('shared_results')
    .insert({
      quiz_result_id: quizResultId,
      user_name_privacy: userNamePrivacy,
      title,
      description,
      image_url: imageUrl || null,
      title_en: titleEn || null,
      description_en: descriptionEn || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 공개 결과 목록 조회
export async function getPublicResults(limit: number = 50): Promise<SharedResultPublic[]> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 단일 공유 결과 조회
export async function getSharedResultById(id: string): Promise<SharedResultPublic | null> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// quiz_result_id로 shared_result ID 조회
export async function getSharedResultIdByQuizResultId(quizResultId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('id')
    .eq('quiz_result_id', quizResultId)
    .single();

  if (error || !data) return null;
  return data.id;
}

// quiz_result_id로 원본 퀴즈 결과 + 사용자 정보 조회 (재생성용)
export interface QuizResultWithUser {
  id: string;
  userName: string;
  birthDate: string;
  mbtiResult: string | null;
  tciScores: Record<string, number> | null;
  valueScores: Record<string, number> | null;
}

export async function getQuizResultWithUserById(quizResultId: string): Promise<QuizResultWithUser | null> {
  const { data: result, error } = await supabase
    .from('quiz_results')
    .select('id, session_id, mbti_result, tci_scores, value_scores')
    .eq('id', quizResultId)
    .single();

  if (error || !result) return null;

  // 사용자 이름 및 생년월일 조회
  const { data: session } = await supabase
    .from('user_sessions')
    .select('name, birth_date')
    .eq('id', result.session_id)
    .single();

  return {
    id: result.id,
    userName: session?.name || '익명',
    birthDate: session?.birth_date || '',
    mbtiResult: result.mbti_result,
    tciScores: result.tci_scores,
    valueScores: result.value_scores,
  };
}

// 공유 결과 업데이트 (재생성용)
export async function updateSharedResult(
  sharedResultId: string,
  title: string,
  description: string,
  imageUrl?: string,
  titleEn?: string,
  descriptionEn?: string
): Promise<SharedResultPublic | null> {
  const { data, error } = await supabase
    .from('shared_results')
    .update({
      title,
      description,
      image_url: imageUrl || null,
      title_en: titleEn || null,
      description_en: descriptionEn || null,
    })
    .eq('id', sharedResultId)
    .select()
    .single();

  if (error) return null;
  return data;
}

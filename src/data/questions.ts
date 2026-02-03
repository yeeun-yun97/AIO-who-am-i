import { Question, RawDimensionData } from '@/types/quiz';
import rawData from '@/data/test.json';

// JSON 데이터를 Question 배열로 변환
function parseQuestions(data: RawDimensionData[]): Question[] {
  const questions: Question[] = [];

  data.forEach((dimension) => {
    dimension.questions.forEach((q) => {
      questions.push({
        id: `${dimension.dimension}-${q.id}`,
        dimension: dimension.dimension,
        question: q.question,
        options: q.options.map((opt) => ({
          key: opt.key,
          text: opt.text,
          score: opt.score,
        })),
      });
    });
  });

  return questions;
}

// 원본 질문
const allQuestions = parseQuestions(rawData as RawDimensionData[]);

// 미리 섞어둔 고정 순서 (MBTI와 TCI 균형있게 배치)
// MBTI 12문항 + TCI 21문항 = 33문항
const FIXED_ORDER = [
  // 1-3
  'I/E-Q1',      // 약속이 없는 완전한 휴일
  'N/S-Q1',      // 새로운 개념을 처음 배울 때
  'TCI-NS-Q5',   // 갑자기 새로운 기회가 생기면
  // 4-6
  'T/F-Q1',      // 중요한 결정을 내려야 할 때
  'J/P-Q1',      // 일이나 약속을 준비할 때
  'TCI-HA-Q8',   // 불확실한 상황에 놓이면
  // 7-9
  'I/E-Q2',      // 하루 종일 사람을 많이 만난 날
  'N/S-Q2',      // 문제를 해결할 때
  'TCI-RD-Q11',  // 주변 사람들이 나를 어떻게 보는지
  // 10-12
  'T/F-Q2',      // 누군가 힘든 이야기를 털어놓을 때
  'J/P-Q2',      // 마감이나 일정이 다가올 때
  'TCI-PS-Q14',  // 일이 예상보다 오래 걸릴 때
  // 13-15
  'I/E-Q3',      // 새로운 사람들로 가득한 모임
  'N/S-Q3',      // 대화를 할 때
  'TCI-SD-Q17',  // 목표를 세워야 할 때
  // 16-18
  'T/F-Q3',      // 갈등 상황에서
  'J/P-Q3',      // 여행이나 주말 계획
  'TCI-CO-Q20',  // 의견이 다른 사람과 함께 일해야 할 때
  // 19-21
  'TCI-NS-Q6',   // 일상에 변화가 거의 없을 때
  'TCI-HA-Q9',   // 실수할 가능성이 있는 일
  'TCI-ST-Q23',  // 삶에서 무엇에 의미를 두는가
  // 22-24
  'TCI-RD-Q12',  // 칭찬이나 인정을 받았을 때
  'TCI-PS-Q15',  // 반복적이고 지루한 과제
  'TCI-SD-Q18',  // 문제가 생겼을 때
  // 25-27
  'TCI-CO-Q21',  // 갈등 상황에서 중요하게 여기는 것
  'TCI-NS-Q7',   // 위험 요소가 있는 선택
  'TCI-ST-Q24',  // 문제를 바라볼 때
  // 28-30
  'TCI-HA-Q10',  // 앞으로의 미래를 떠올리면
  'TCI-RD-Q13',  // 사람들과의 관계에서
  'TCI-PS-Q16',  // 여러 번 실패를 경험했을 때
  // 31-33
  'TCI-SD-Q19',  // 장기적으로 나의 삶을 돌아보면
  'TCI-CO-Q22',  // 누군가 도움이 필요해 보일 때
  'TCI-ST-Q25',  // 자신의 삶이나 경험을 바라볼 때
];

// 고정 순서대로 질문 배열 생성
export const questions: Question[] = FIXED_ORDER.map(
  (id) => allQuestions.find((q) => q.id === id)!
).filter(Boolean);

// 총 질문 수
export const TOTAL_QUESTIONS = questions.length;

// 차원별 질문 수
export const QUESTIONS_PER_DIMENSION = 3;

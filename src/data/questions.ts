import { Question } from '@/types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    text: '새로운 환경에 처음 들어갔을 때, 당신의 첫 반응은?',
    category: 'sensitivity',
    options: [
      { id: '1a', text: '주변의 분위기와 사람들의 표정을 먼저 살핀다', scores: { sensitivity: 4, extroversion: 1 } },
      { id: '1b', text: '어떤 기회가 있을지 탐색한다', scores: { creativity: 3, flexibility: 2 } },
      { id: '1c', text: '새로운 사람들에게 먼저 다가가 인사한다', scores: { extroversion: 4 } },
      { id: '1d', text: '구조와 규칙을 파악하려 한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 2,
    text: '갑자기 계획이 변경되었을 때, 당신은?',
    category: 'flexibility',
    options: [
      { id: '2a', text: '스트레스를 받지만 적응하려 노력한다', scores: { sensitivity: 3, flexibility: 1 } },
      { id: '2b', text: '오히려 새로운 가능성에 흥분한다', scores: { flexibility: 4, creativity: 2 } },
      { id: '2c', text: '주변 사람들과 함께 대안을 찾는다', scores: { extroversion: 3, flexibility: 2 } },
      { id: '2d', text: '논리적으로 최선의 대안을 분석한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 3,
    text: '주말에 혼자 시간이 생겼을 때, 당신은?',
    category: 'extroversion',
    options: [
      { id: '3a', text: '조용히 책을 읽거나 음악을 듣는다', scores: { sensitivity: 3 } },
      { id: '3b', text: '새로운 취미나 프로젝트를 시작한다', scores: { creativity: 4, flexibility: 1 } },
      { id: '3c', text: '친구들에게 연락해 약속을 잡는다', scores: { extroversion: 4 } },
      { id: '3d', text: '밀린 일들을 계획적으로 처리한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 4,
    text: '팀 프로젝트에서 당신이 주로 맡는 역할은?',
    category: 'rationality',
    options: [
      { id: '4a', text: '팀원들의 감정 상태를 살피고 조율한다', scores: { sensitivity: 4, extroversion: 1 } },
      { id: '4b', text: '새로운 아이디어를 제안한다', scores: { creativity: 4 } },
      { id: '4c', text: '팀을 이끌고 소통을 주도한다', scores: { extroversion: 4 } },
      { id: '4d', text: '일정과 진행 상황을 체계적으로 관리한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 5,
    text: '어려운 결정을 내려야 할 때, 당신은?',
    category: 'rationality',
    options: [
      { id: '5a', text: '직감과 느낌을 중요하게 생각한다', scores: { sensitivity: 3, creativity: 2 } },
      { id: '5b', text: '다양한 관점에서 유연하게 생각한다', scores: { flexibility: 4 } },
      { id: '5c', text: '주변 사람들의 의견을 듣는다', scores: { extroversion: 3, sensitivity: 1 } },
      { id: '5d', text: '데이터와 사실을 기반으로 분석한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 6,
    text: '스트레스를 받을 때 당신의 해소 방법은?',
    category: 'sensitivity',
    options: [
      { id: '6a', text: '혼자만의 시간을 갖고 감정을 정리한다', scores: { sensitivity: 4 } },
      { id: '6b', text: '새로운 활동이나 장소를 찾아본다', scores: { creativity: 3, flexibility: 2 } },
      { id: '6c', text: '친구나 가족과 대화를 나눈다', scores: { extroversion: 4 } },
      { id: '6d', text: '문제의 원인을 분석하고 해결책을 찾는다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 7,
    text: '새로운 기술이나 트렌드가 나왔을 때, 당신은?',
    category: 'flexibility',
    options: [
      { id: '7a', text: '그것이 가져올 변화가 걱정된다', scores: { sensitivity: 3 } },
      { id: '7b', text: '빠르게 배워서 적용해본다', scores: { flexibility: 4, creativity: 1 } },
      { id: '7c', text: '주변 사람들의 반응을 먼저 살핀다', scores: { extroversion: 2, sensitivity: 2 } },
      { id: '7d', text: '장단점을 꼼꼼히 분석한 후 결정한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 8,
    text: '아이디어를 떠올릴 때, 당신의 방식은?',
    category: 'creativity',
    options: [
      { id: '8a', text: '감정이나 분위기에서 영감을 얻는다', scores: { sensitivity: 3, creativity: 2 } },
      { id: '8b', text: '전혀 다른 분야에서 연결고리를 찾는다', scores: { creativity: 4 } },
      { id: '8c', text: '브레인스토밍 등 협업을 통해 발전시킨다', scores: { extroversion: 3, creativity: 2 } },
      { id: '8d', text: '기존 사례를 분석하고 개선점을 찾는다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 9,
    text: '타인의 비판을 받았을 때, 당신의 반응은?',
    category: 'sensitivity',
    options: [
      { id: '9a', text: '마음이 상하고 오래 생각하게 된다', scores: { sensitivity: 4 } },
      { id: '9b', text: '새로운 시각으로 받아들이려 한다', scores: { flexibility: 4 } },
      { id: '9c', text: '상대방과 대화를 통해 이해하려 한다', scores: { extroversion: 3, flexibility: 1 } },
      { id: '9d', text: '객관적으로 타당한지 분석한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 10,
    text: '여행 계획을 세울 때, 당신의 스타일은?',
    category: 'flexibility',
    options: [
      { id: '10a', text: '분위기 좋은 장소와 휴식을 중시한다', scores: { sensitivity: 4 } },
      { id: '10b', text: '즉흥적으로 그때그때 결정한다', scores: { flexibility: 4, creativity: 1 } },
      { id: '10c', text: '함께 갈 사람들과 의논해서 정한다', scores: { extroversion: 4 } },
      { id: '10d', text: '효율적인 동선과 예산을 꼼꼼히 계획한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 11,
    text: '새로운 사람을 만났을 때, 당신은?',
    category: 'extroversion',
    options: [
      { id: '11a', text: '상대방의 감정과 분위기를 먼저 읽는다', scores: { sensitivity: 4 } },
      { id: '11b', text: '흥미로운 주제로 대화를 이끌어본다', scores: { creativity: 3, extroversion: 2 } },
      { id: '11c', text: '적극적으로 질문하며 관계를 시작한다', scores: { extroversion: 4 } },
      { id: '11d', text: '상대방을 관찰하며 정보를 수집한다', scores: { rationality: 3, sensitivity: 1 } },
    ],
  },
  {
    id: 12,
    text: '문제 해결 시 당신의 접근 방식은?',
    category: 'creativity',
    options: [
      { id: '12a', text: '직관적으로 해결책이 떠오른다', scores: { sensitivity: 2, creativity: 3 } },
      { id: '12b', text: '완전히 새로운 방법을 시도한다', scores: { creativity: 4 } },
      { id: '12c', text: '여러 사람의 의견을 모아 해결한다', scores: { extroversion: 4 } },
      { id: '12d', text: '단계별로 체계적으로 분석한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 13,
    text: '일상에서 가장 중요하게 생각하는 것은?',
    category: 'sensitivity',
    options: [
      { id: '13a', text: '마음의 평화와 정서적 안정', scores: { sensitivity: 4 } },
      { id: '13b', text: '새로운 경험과 변화', scores: { flexibility: 3, creativity: 2 } },
      { id: '13c', text: '사람들과의 연결과 소통', scores: { extroversion: 4 } },
      { id: '13d', text: '목표 달성과 성장', scores: { rationality: 4 } },
    ],
  },
  {
    id: 14,
    text: '갈등 상황에서 당신의 대처 방식은?',
    category: 'extroversion',
    options: [
      { id: '14a', text: '상대방의 입장을 깊이 이해하려 한다', scores: { sensitivity: 4 } },
      { id: '14b', text: '창의적인 타협점을 찾으려 한다', scores: { creativity: 3, flexibility: 2 } },
      { id: '14c', text: '직접 대화로 문제를 해결하려 한다', scores: { extroversion: 4 } },
      { id: '14d', text: '객관적 사실을 기반으로 중재한다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 15,
    text: '성공적인 하루의 기준은?',
    category: 'rationality',
    options: [
      { id: '15a', text: '기분 좋은 감정을 느꼈을 때', scores: { sensitivity: 4 } },
      { id: '15b', text: '새롭고 흥미로운 것을 발견했을 때', scores: { creativity: 4 } },
      { id: '15c', text: '의미 있는 대화를 나눴을 때', scores: { extroversion: 4 } },
      { id: '15d', text: '계획한 일을 모두 완수했을 때', scores: { rationality: 4 } },
    ],
  },
  {
    id: 16,
    text: '실패를 경험했을 때, 당신의 반응은?',
    category: 'flexibility',
    options: [
      { id: '16a', text: '감정적으로 힘들어하지만 시간이 필요하다', scores: { sensitivity: 4 } },
      { id: '16b', text: '다른 방법을 찾아 다시 도전한다', scores: { flexibility: 4 } },
      { id: '16c', text: '주변의 위로와 조언을 구한다', scores: { extroversion: 4 } },
      { id: '16d', text: '원인을 분석하고 개선점을 찾는다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 17,
    text: '영화나 책을 선택할 때, 당신의 기준은?',
    category: 'creativity',
    options: [
      { id: '17a', text: '감정적으로 깊이 공감할 수 있는 것', scores: { sensitivity: 4 } },
      { id: '17b', text: '독특하고 창의적인 스토리', scores: { creativity: 4 } },
      { id: '17c', text: '친구들이 추천하거나 화제인 것', scores: { extroversion: 3, flexibility: 1 } },
      { id: '17d', text: '유익하고 배울 점이 있는 것', scores: { rationality: 4 } },
    ],
  },
  {
    id: 18,
    text: '미래를 생각할 때, 당신은?',
    category: 'rationality',
    options: [
      { id: '18a', text: '불확실함에 대한 불안을 느낀다', scores: { sensitivity: 4 } },
      { id: '18b', text: '다양한 가능성에 설렌다', scores: { flexibility: 3, creativity: 2 } },
      { id: '18c', text: '함께할 사람들을 떠올린다', scores: { extroversion: 4 } },
      { id: '18d', text: '구체적인 목표와 계획을 세운다', scores: { rationality: 4 } },
    ],
  },
  {
    id: 19,
    text: '자신의 의견을 표현할 때, 당신은?',
    category: 'extroversion',
    options: [
      { id: '19a', text: '상대방의 반응을 살피며 조심스럽게', scores: { sensitivity: 4 } },
      { id: '19b', text: '독특한 관점으로 차별화된 의견을', scores: { creativity: 4 } },
      { id: '19c', text: '자신감 있게 명확하게 전달한다', scores: { extroversion: 4 } },
      { id: '19d', text: '논리적 근거와 함께 설득력 있게', scores: { rationality: 4 } },
    ],
  },
  {
    id: 20,
    text: '이상적인 삶의 모습은?',
    category: 'creativity',
    options: [
      { id: '20a', text: '평온하고 안정적인 일상', scores: { sensitivity: 4 } },
      { id: '20b', text: '끊임없이 새로운 것을 탐험하는 삶', scores: { creativity: 3, flexibility: 2 } },
      { id: '20c', text: '사랑하는 사람들과 함께하는 삶', scores: { extroversion: 4 } },
      { id: '20d', text: '목표를 이루며 성취감을 느끼는 삶', scores: { rationality: 4 } },
    ],
  },
];

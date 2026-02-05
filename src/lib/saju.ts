// 사주 (四柱) 계산 유틸리티
// 년주, 월주, 일주, 시주를 계산합니다.

// 천간 (天干) - 10개
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const HEAVENLY_STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const HEAVENLY_STEMS_EN = ['Gap', 'Eul', 'Byeong', 'Jeong', 'Mu', 'Gi', 'Gyeong', 'Sin', 'Im', 'Gye'];

// 지지 (地支) - 12개
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const EARTHLY_BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const EARTHLY_BRANCHES_EN = ['Ja', 'Chuk', 'In', 'Myo', 'Jin', 'Sa', 'Oh', 'Mi', 'Sin', 'Yu', 'Sul', 'Hae'];

// 띠 (12지신)
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// 천간별 띠 색깔 (오행 기반)
// 갑(木양)=파란, 을(木음)=초록, 병정(火)=빨간, 무기(土)=황금, 경신(金)=흰, 임계(水)=검은
const ZODIAC_COLORS: Record<string, { color: string; colorKey: string; colorName: string; emoji: string }> = {
  '갑': { color: '청', colorKey: 'blue', colorName: '파란', emoji: '🌳' },
  '을': { color: '청', colorKey: 'green', colorName: '초록', emoji: '🌿' },
  '병': { color: '적', colorKey: 'red', colorName: '빨간', emoji: '🔥' },
  '정': { color: '적', colorKey: 'red', colorName: '붉은', emoji: '🕯️' },
  '무': { color: '황', colorKey: 'gold', colorName: '황금', emoji: '⛰️' },
  '기': { color: '황', colorKey: 'gold', colorName: '황금', emoji: '🌾' },
  '경': { color: '백', colorKey: 'white', colorName: '흰', emoji: '⚔️' },
  '신': { color: '백', colorKey: 'white', colorName: '흰', emoji: '💎' },
  '임': { color: '흑', colorKey: 'black', colorName: '검은', emoji: '🌊' },
  '계': { color: '흑', colorKey: 'black', colorName: '검은', emoji: '💧' },
};

// 동물 영문 매핑 (JSON lookup용)
const ANIMAL_KEYS: Record<string, string> = {
  '쥐': 'rat', '소': 'ox', '호랑이': 'tiger', '토끼': 'rabbit',
  '용': 'dragon', '뱀': 'snake', '말': 'horse', '양': 'sheep',
  '원숭이': 'monkey', '닭': 'rooster', '개': 'dog', '돼지': 'pig',
};

// 입춘 날짜 (근사값 - 대부분 2월 3~5일 사이)
// 정확한 입춘 시각은 매년 다르지만, 간단히 2월 4일 기준으로 계산
const IPCHUN_DEFAULT_DATE = { month: 2, day: 4 };

// 별자리 정보
const ZODIAC_SIGNS = [
  { name: '염소자리', nameEn: 'Capricorn', emoji: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: '물병자리', nameEn: 'Aquarius', emoji: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '물고기자리', nameEn: 'Pisces', emoji: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: '양자리', nameEn: 'Aries', emoji: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '황소자리', nameEn: 'Taurus', emoji: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '쌍둥이자리', nameEn: 'Gemini', emoji: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: '게자리', nameEn: 'Cancer', emoji: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: '사자자리', nameEn: 'Leo', emoji: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '처녀자리', nameEn: 'Virgo', emoji: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '천칭자리', nameEn: 'Libra', emoji: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: '전갈자리', nameEn: 'Scorpio', emoji: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: '사수자리', nameEn: 'Sagittarius', emoji: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

// 오행 (五行)
const FIVE_ELEMENTS: Record<string, string> = {
  '갑': '목(木)', '을': '목(木)',
  '병': '화(火)', '정': '화(火)',
  '무': '토(土)', '기': '토(土)',
  '경': '금(金)', '신': '금(金)',
  '임': '수(水)', '계': '수(水)',
};

export interface SajuPillar {
  stem: string;      // 천간
  branch: string;    // 지지
  stemHanja: string;
  branchHanja: string;
  stemEn: string;
  branchEn: string;
  element: string;   // 오행
}

export interface ZodiacSign {
  name: string;       // 한글 이름 (양자리, 황소자리 등)
  nameEn: string;     // 영문 이름 (Aries, Taurus 등)
  emoji: string;      // 별자리 기호
}

export interface ColoredZodiac {
  animal: string;       // 동물 (말, 용 등)
  animalKey: string;    // 동물 영문 키 (horse, dragon 등)
  color: string;        // 색깔 한자 (청, 적, 황, 백, 흑)
  colorKey: string;     // 색깔 영문 키 (blue, red, gold, white, black)
  colorName: string;    // 색깔 이름 (파란, 빨간, 황금, 흰, 검은)
  fullName: string;     // 전체 이름 (황금말띠)
  emoji: string;        // 이모지
  year: number;         // 띠 연도 (입춘 기준)
}

export interface SajuResult {
  year: SajuPillar;   // 년주
  month: SajuPillar;  // 월주
  day: SajuPillar;    // 일주
  hour: SajuPillar | null;  // 시주 (시간 모르면 null)
  zodiac: string;     // 띠 (기존 호환용)
  coloredZodiac: ColoredZodiac;  // 색띠 정보
  zodiacSign: ZodiacSign;  // 별자리 정보
  summary: string;    // 사주 요약 문자열
}

// 년주 계산 (입춘 기준, 간단히 양력 기준으로 계산)
function getYearPillar(year: number): SajuPillar {
  // 갑자년 기준점: 1984년이 갑자년
  const offset = (year - 4) % 60;
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
    stemHanja: HEAVENLY_STEMS_HANJA[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branchHanja: EARTHLY_BRANCHES_HANJA[branchIndex >= 0 ? branchIndex : branchIndex + 12],
    stemEn: HEAVENLY_STEMS_EN[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branchEn: EARTHLY_BRANCHES_EN[branchIndex >= 0 ? branchIndex : branchIndex + 12],
    element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10]],
  };
}

// 월주 계산
function getMonthPillar(year: number, month: number): SajuPillar {
  // 월건 계산 (절기 기준이지만 간단히 양력으로 근사)
  // 인월(寅月)=양력 2월, 묘월(卯月)=양력 3월, ...
  // 지지 배열: ['자','축','인','묘','진','사','오','미','신','유','술','해']
  //             0    1    2    3    4    5    6    7    8    9   10   11
  // 양력 1월->축(1), 2월->인(2), ... 11월->해(11), 12월->자(0)
  const monthBranchIndex = month === 12 ? 0 : month; // 12월=자, 나머지는 월과 동일

  // 년간에 따른 월간 계산 (갑기년 병인월, 을경년 무인월...)
  const yearStemIndex = (year - 4) % 10;
  const adjustedYearStem = yearStemIndex >= 0 ? yearStemIndex : yearStemIndex + 10;

  // 갑/기년: 병인월 시작 (병=2)
  // 을/경년: 무인월 시작 (무=4)
  // 병/신년: 경인월 시작 (경=6)
  // 정/임년: 임인월 시작 (임=8)
  // 무/계년: 갑인월 시작 (갑=0)
  const monthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 갑을병정무기경신임계

  // 인월(2월)부터 시작하므로, 월에서 2를 빼서 offset 계산
  const monthOffset = month >= 2 ? month - 2 : month + 10; // 1월은 전년도 자월 다음이므로 11번째
  const monthStemIndex = (monthStemStart[adjustedYearStem] + monthOffset) % 10;

  return {
    stem: HEAVENLY_STEMS[monthStemIndex],
    branch: EARTHLY_BRANCHES[monthBranchIndex],
    stemHanja: HEAVENLY_STEMS_HANJA[monthStemIndex],
    branchHanja: EARTHLY_BRANCHES_HANJA[monthBranchIndex],
    stemEn: HEAVENLY_STEMS_EN[monthStemIndex],
    branchEn: EARTHLY_BRANCHES_EN[monthBranchIndex],
    element: FIVE_ELEMENTS[HEAVENLY_STEMS[monthStemIndex]],
  };
}

// 일주 계산 (기준일로부터의 날짜 차이)
function getDayPillar(year: number, month: number, day: number): SajuPillar {
  // 기준일: 1900년 1월 1일 = 을해일(乙亥日)
  // 천간: 을(乙) = 인덱스 1
  // 지지: 해(亥) = 인덱스 11
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // 1900년 1월 1일은 을해일 (천간 1, 지지 11)
  let stemIndex = (diffDays + 1) % 10;
  let branchIndex = (diffDays + 11) % 12;

  // 음수 처리
  if (stemIndex < 0) stemIndex += 10;
  if (branchIndex < 0) branchIndex += 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemHanja: HEAVENLY_STEMS_HANJA[stemIndex],
    branchHanja: EARTHLY_BRANCHES_HANJA[branchIndex],
    stemEn: HEAVENLY_STEMS_EN[stemIndex],
    branchEn: EARTHLY_BRANCHES_EN[branchIndex],
    element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]],
  };
}

// 시주 계산
function getHourPillar(dayStem: string, hour: number): SajuPillar {
  // 시지 계산 (자시: 23-01, 축시: 01-03, ...)
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;

  // 일간에 따른 시간 계산
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const hourStemStart = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // 갑기일 갑자시, 을경일 병자시...
  const hourStemIndex = (hourStemStart[dayStemIndex] + hourBranchIndex) % 10;

  return {
    stem: HEAVENLY_STEMS[hourStemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex],
    stemHanja: HEAVENLY_STEMS_HANJA[hourStemIndex],
    branchHanja: EARTHLY_BRANCHES_HANJA[hourBranchIndex],
    stemEn: HEAVENLY_STEMS_EN[hourStemIndex],
    branchEn: EARTHLY_BRANCHES_EN[hourBranchIndex],
    element: FIVE_ELEMENTS[HEAVENLY_STEMS[hourStemIndex]],
  };
}

// 입춘 기준 띠 연도 계산
// 입춘(2월 4일 전후) 이전 출생자는 전년도 띠를 사용
function getZodiacYear(year: number, month: number, day: number): number {
  // 입춘 전이면 전년도로 계산
  if (month < IPCHUN_DEFAULT_DATE.month ||
      (month === IPCHUN_DEFAULT_DATE.month && day < IPCHUN_DEFAULT_DATE.day)) {
    return year - 1;
  }
  return year;
}

// 띠 계산 (기존 호환용)
function getZodiac(year: number): string {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12];
}

// 색띠 계산 (입춘 기준)
function getColoredZodiac(birthYear: number, birthMonth: number, birthDay: number): ColoredZodiac {
  // 입춘 기준 띠 연도 확정
  const zodiacYear = getZodiacYear(birthYear, birthMonth, birthDay);

  // 천간 계산 (연도의 천간)
  const stemIndex = (zodiacYear - 4) % 10;
  const adjustedStemIndex = stemIndex >= 0 ? stemIndex : stemIndex + 10;
  const stem = HEAVENLY_STEMS[adjustedStemIndex];

  // 지지 계산 (연도의 지지 = 띠)
  const branchIndex = (zodiacYear - 4) % 12;
  const adjustedBranchIndex = branchIndex >= 0 ? branchIndex : branchIndex + 12;
  const animal = ZODIAC_ANIMALS[adjustedBranchIndex];

  // 색깔 정보
  const colorInfo = ZODIAC_COLORS[stem];

  return {
    animal,
    animalKey: ANIMAL_KEYS[animal],
    color: colorInfo.color,
    colorKey: colorInfo.colorKey,
    colorName: colorInfo.colorName,
    fullName: `${colorInfo.colorName}${animal}`,
    emoji: colorInfo.emoji,
    year: zodiacYear,
  };
}

// 별자리 계산
function getZodiacSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    // 염소자리처럼 연도를 걸치는 경우
    if (sign.startMonth > sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return { name: sign.name, nameEn: sign.nameEn, emoji: sign.emoji };
      }
    } else {
      // 일반적인 경우
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay) ||
          (month > sign.startMonth && month < sign.endMonth)) {
        return { name: sign.name, nameEn: sign.nameEn, emoji: sign.emoji };
      }
    }
  }
  // 기본값 (도달하지 않음)
  return { name: '양자리', nameEn: 'Aries', emoji: '♈' };
}

// 사주 계산 메인 함수
export function calculateSaju(
  birthDate: string,      // YYYY-MM-DD
  birthTime: string | null // HH:mm or null
): SajuResult {
  const [year, month, day] = birthDate.split('-').map(Number);

  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(year, month);
  const dayPillar = getDayPillar(year, month, day);

  let hourPillar: SajuPillar | null = null;
  if (birthTime) {
    const hour = parseInt(birthTime.split(':')[0], 10);
    hourPillar = getHourPillar(dayPillar.stem, hour);
  }

  const zodiac = getZodiac(year);
  const coloredZodiac = getColoredZodiac(year, month, day);
  const zodiacSign = getZodiacSign(month, day);

  // 사주 요약 문자열
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(Boolean) as SajuPillar[];
  const summary = pillars.map(p => `${p.stem}${p.branch}`).join(' ');

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    zodiac,
    coloredZodiac,
    zodiacSign,
    summary,
  };
}

// 사주 해석 (간단한 일간 기반 해석)
export function getSajuInterpretation(dayPillar: SajuPillar): string {
  const interpretations: Record<string, string> = {
    '갑': '큰 나무처럼 곧고 당당하며, 리더십과 진취적 기상이 있습니다.',
    '을': '풀과 덩굴처럼 유연하고 적응력이 뛰어나며, 섬세한 감각을 지녔습니다.',
    '병': '태양처럼 밝고 활기차며, 열정적이고 표현력이 풍부합니다.',
    '정': '촛불처럼 은은하고 따뜻하며, 섬세하고 배려심이 깊습니다.',
    '무': '큰 산처럼 묵직하고 신뢰감 있으며, 안정적이고 포용력이 있습니다.',
    '기': '논밭처럼 수용적이고 실용적이며, 착실하고 현실적입니다.',
    '경': '바위나 쇠처럼 강직하고 결단력이 있으며, 정의감이 강합니다.',
    '신': '보석처럼 섬세하고 예리하며, 완벽을 추구하는 성향이 있습니다.',
    '임': '큰 바다처럼 넓고 깊으며, 지혜롭고 포용력이 있습니다.',
    '계': '빗물처럼 맑고 순수하며, 감수성이 풍부하고 직관적입니다.',
  };

  return interpretations[dayPillar.stem] || '';
}

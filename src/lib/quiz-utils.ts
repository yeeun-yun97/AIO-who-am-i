import { TCIResult, ValueResult } from '@/types/quiz';
import results from '@/data/results.json';
import resultsEn from '@/data/results-en.json';
import { Locale } from '@/i18n/config';

export function getTCIInterpretation(scores: Record<string, number>, locale: Locale): TCIResult {
  const getLevel = (score: number, dimension: string): '높음' | '중간' | '낮음' => {
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

  const descriptionsKo: Record<string, Record<string, string>> = {
    NS: { '높음': '충동적이고 새로운 자극을 선호함', '중간': '상황에 따라 새로움과 안정성을 균형 있게 추구함', '낮음': '안정적이고 익숙한 방식을 선호함' },
    HA: { '높음': '불안 민감도가 높고 신중하며 위험을 회피하는 성향', '중간': '상황에 따라 신중함과 도전을 균형 있게 조절함', '낮음': '낙관적이고 위험에 대한 두려움이 적은 편' },
    RD: { '높음': '타인의 반응과 관계에 민감하며 정서적 유대를 중시함', '중간': '관계와 독립성 사이에서 균형을 이룸', '낮음': '독립적이며 외부 인정에 크게 좌우되지 않음' },
    PS: { '높음': '끈기 있고 목표 달성까지 지속적으로 노력함', '중간': '상황에 따라 지속과 포기를 조절함', '낮음': '유연하지만 장기적 지속에는 부담을 느낄 수 있음' },
    SD: { '높음': '책임감과 자기통제력이 높고 목표지향적임', '중간': '상황에 따라 자기주도성과 유연성을 함께 보임', '낮음': '외부 환경의 영향을 크게 느끼며 방향 설정에 어려움을 겪을 수 있음' },
    CO: { '높음': '공감 능력이 높고 협력과 배려를 중시함', '중간': '상황에 따라 협력과 개인 기준을 조절함', '낮음': '독립적이며 개인 기준을 우선하는 경향이 있음' },
    ST: { '높음': '자아를 초월하고 넓은 관점에서 삶을 이해하려 함', '중간': '상황과 필요에 따라 자기와 타인을 균형 있게 고려함', '낮음': '개인적·현실적 관점에 초점을 두는 편' },
  };

  const descriptionsEn: Record<string, Record<string, string>> = {
    NS: { '높음': 'Impulsive; prefers new stimulation and excitement', '중간': 'Balances novelty-seeking and stability depending on the situation', '낮음': 'Prefers stability and familiar routines' },
    HA: { '높음': 'High anxiety sensitivity; cautious and risk-avoidant', '중간': 'Balances caution and boldness depending on the situation', '낮음': 'Optimistic with little fear of risk' },
    RD: { '높음': 'Sensitive to others\' reactions; values emotional bonds and relationships', '중간': 'Balances relational awareness and independence', '낮음': 'Independent; not strongly influenced by external approval' },
    PS: { '높음': 'Persistent; consistently works toward goals', '중간': 'Adjusts between perseverance and flexibility as needed', '낮음': 'Flexible but may find long-term persistence challenging' },
    SD: { '높음': 'Strong sense of responsibility and self-discipline; goal-oriented', '중간': 'Demonstrates both self-direction and adaptability depending on context', '낮음': 'Sensitive to external influences; may struggle with setting direction' },
    CO: { '높음': 'Highly empathetic; values cooperation and consideration for others', '중간': 'Adjusts between cooperation and personal standards situationally', '낮음': 'Independent; tends to prioritize personal standards' },
    ST: { '높음': 'Transcends self-interest; seeks to understand life from a broad perspective', '중간': 'Balances self and others according to the situation and needs', '낮음': 'Focuses on a personal and practical perspective' },
  };

  const descriptions = locale === 'en' ? descriptionsEn : descriptionsKo;
  const dimensions = ['NS', 'HA', 'RD', 'PS', 'SD', 'CO', 'ST'];
  
  const result: any = {};
  dimensions.forEach(dim => {
    const score = scores[dim] || 0;
    const level = getLevel(score, dim);
    result[dim] = {
      score,
      level,
      description: descriptions[dim][level]
    };
  });

  return result as TCIResult;
}

export function getValueInterpretation(scores: Record<string, number>, locale: Locale): ValueResult {
  const resultsData = locale === 'en' ? resultsEn : results;
  
  const getDimensionResult = (
    dimension: string,
    leftKey: string,
    rightKey: string
  ) => {
    const leftScore = scores[leftKey] || 0;
    const rightScore = scores[rightKey] || 0;
    const dimData = (resultsData.value as any)[dimension];

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
  } as ValueResult;
}

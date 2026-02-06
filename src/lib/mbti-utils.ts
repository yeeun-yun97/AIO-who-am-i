import { MBTIResult } from '@/types/quiz';

export const getDimensionLabel = (dimension: string, mbti: MBTIResult, t: any) => {
  switch (dimension) {
    case 'IE':
      return {
        left: t('mbti.dimensions.IE.I'),
        right: t('mbti.dimensions.IE.E'),
        dominant: mbti.dimensions.IE.dominant,
        percentage: mbti.dimensions.IE.percentage,
      };
    case 'NS':
      return {
        left: t('mbti.dimensions.NS.S'),
        right: t('mbti.dimensions.NS.N'),
        dominant: mbti.dimensions.NS.dominant,
        percentage: mbti.dimensions.NS.percentage,
      };
    case 'TF':
      return {
        left: t('mbti.dimensions.TF.F'),
        right: t('mbti.dimensions.TF.T'),
        dominant: mbti.dimensions.TF.dominant,
        percentage: mbti.dimensions.TF.percentage,
      };
    case 'JP':
      return {
        left: t('mbti.dimensions.JP.P'),
        right: t('mbti.dimensions.JP.J'),
        dominant: mbti.dimensions.JP.dominant,
        percentage: mbti.dimensions.JP.percentage,
      };
    default:
      return { left: '', right: '', dominant: '', percentage: 50 };
  }
};

export const getMbtiDimensionsLocalized = (t: any) => [
  { id: 'IE', name: t('mbti.dimensions.IE.name') },
  { id: 'NS', name: t('mbti.dimensions.NS.name') },
  { id: 'TF', name: t('mbti.dimensions.TF.name') },
  { id: 'JP', name: t('mbti.dimensions.JP.name') },
];

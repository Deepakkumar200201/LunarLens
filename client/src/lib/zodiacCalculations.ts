export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export interface ZodiacInfo {
  sign: ZodiacSign;
  element: string;
  quality: string;
  ruler: string;
  keywords: string[];
  color: string;
}

export function getZodiacInfo(sign: ZodiacSign): ZodiacInfo {
  const zodiacData: Record<ZodiacSign, ZodiacInfo> = {
    'Aries': {
      sign: 'Aries',
      element: 'Fire',
      quality: 'Cardinal',
      ruler: 'Mars',
      keywords: ['Initiative', 'Leadership', 'Courage', 'Independence'],
      color: '#FF6B6B'
    },
    'Taurus': {
      sign: 'Taurus',
      element: 'Earth',
      quality: 'Fixed',
      ruler: 'Venus',
      keywords: ['Stability', 'Luxury', 'Patience', 'Determination'],
      color: '#4ECDC4'
    },
    'Gemini': {
      sign: 'Gemini',
      element: 'Air',
      quality: 'Mutable',
      ruler: 'Mercury',
      keywords: ['Communication', 'Curiosity', 'Adaptability', 'Learning'],
      color: '#45B7D1'
    },
    'Cancer': {
      sign: 'Cancer',
      element: 'Water',
      quality: 'Cardinal',
      ruler: 'Moon',
      keywords: ['Nurturing', 'Intuition', 'Family', 'Protection'],
      color: '#96CEB4'
    },
    'Leo': {
      sign: 'Leo',
      element: 'Fire',
      quality: 'Fixed',
      ruler: 'Sun',
      keywords: ['Creativity', 'Drama', 'Generosity', 'Pride'],
      color: '#FECA57'
    },
    'Virgo': {
      sign: 'Virgo',
      element: 'Earth',
      quality: 'Mutable',
      ruler: 'Mercury',
      keywords: ['Service', 'Analysis', 'Perfection', 'Health'],
      color: '#48CAE4'
    },
    'Libra': {
      sign: 'Libra',
      element: 'Air',
      quality: 'Cardinal',
      ruler: 'Venus',
      keywords: ['Balance', 'Harmony', 'Justice', 'Relationships'],
      color: '#FF9AA2'
    },
    'Scorpio': {
      sign: 'Scorpio',
      element: 'Water',
      quality: 'Fixed',
      ruler: 'Pluto',
      keywords: ['Transformation', 'Intensity', 'Mystery', 'Power'],
      color: '#B19CD9'
    },
    'Sagittarius': {
      sign: 'Sagittarius',
      element: 'Fire',
      quality: 'Mutable',
      ruler: 'Jupiter',
      keywords: ['Adventure', 'Philosophy', 'Freedom', 'Wisdom'],
      color: '#FFB3BA'
    },
    'Capricorn': {
      sign: 'Capricorn',
      element: 'Earth',
      quality: 'Cardinal',
      ruler: 'Saturn',
      keywords: ['Ambition', 'Structure', 'Responsibility', 'Achievement'],
      color: '#BFBFBF'
    },
    'Aquarius': {
      sign: 'Aquarius',
      element: 'Air',
      quality: 'Fixed',
      ruler: 'Uranus',
      keywords: ['Innovation', 'Rebellion', 'Friendship', 'Future'],
      color: '#A8E6CF'
    },
    'Pisces': {
      sign: 'Pisces',
      element: 'Water',
      quality: 'Mutable',
      ruler: 'Neptune',
      keywords: ['Compassion', 'Intuition', 'Dreams', 'Spirituality'],
      color: '#DDA0DD'
    }
  };

  return zodiacData[sign];
}

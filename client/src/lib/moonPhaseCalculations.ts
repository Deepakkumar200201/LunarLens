export interface MoonPhaseInfo {
  name: string;
  illumination: number;
  age: number;
  emoji: string;
  description: string;
}

export function getMoonPhaseIcon(phaseName: string): string {
  const icons: Record<string, string> = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘'
  };
  return icons[phaseName] || '🌑';
}

export function getMoonPhaseDescription(phaseName: string): string {
  const descriptions: Record<string, string> = {
    'New Moon': 'New beginnings and fresh starts',
    'Waxing Crescent': 'Growth and building momentum',
    'First Quarter': 'Decision making and action',
    'Waxing Gibbous': 'Refinement and preparation',
    'Full Moon': 'Culmination and manifestation',
    'Waning Gibbous': 'Gratitude and sharing',
    'Last Quarter': 'Release and letting go',
    'Waning Crescent': 'Rest and contemplation'
  };
  return descriptions[phaseName] || 'Lunar cycle phase';
}

export function getZodiacEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
  };
  return emojis[sign] || '⭐';
}

export interface MoonData {
  phase: string;
  illumination: number;
  age: number;
  distance: number;
  angularDiameter: number;
  moonrise: string;
  moonset: string;
  zodiacSign: string;
  zodiacDegree: number;
  nextTransition: string;
  rightAscension: string;
  declination: string;
  altitude: number;
  azimuth: number;
}

export interface TidalData {
  highTide: string;
  lowTide: string;
  tidalRange: number;
}

export class AstronomicalCalculator {
  private static readonly LUNAR_CYCLE = 29.530588853; // Average lunar cycle in days
  private static readonly NEW_MOON_REFERENCE = new Date('2000-01-06T18:14:00Z'); // Known new moon date

  static calculateMoonPhase(date: Date): { phase: string; illumination: number; age: number } {
    const daysSinceNew = (date.getTime() - this.NEW_MOON_REFERENCE.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = (daysSinceNew % this.LUNAR_CYCLE) / this.LUNAR_CYCLE;
    const age = daysSinceNew % this.LUNAR_CYCLE;
    
    let phase: string;
    let illumination: number;

    if (cyclePosition < 0.0625) {
      phase = 'New Moon';
      illumination = cyclePosition * 8;
    } else if (cyclePosition < 0.1875) {
      phase = 'Waxing Crescent';
      illumination = (cyclePosition - 0.0625) * 8 + 0.5;
    } else if (cyclePosition < 0.3125) {
      phase = 'First Quarter';
      illumination = (cyclePosition - 0.1875) * 4 + 0.4;
    } else if (cyclePosition < 0.4375) {
      phase = 'Waxing Gibbous';
      illumination = (cyclePosition - 0.3125) * 4 + 0.6;
    } else if (cyclePosition < 0.5625) {
      phase = 'Full Moon';
      illumination = 1 - (cyclePosition - 0.4375) * 4;
    } else if (cyclePosition < 0.6875) {
      phase = 'Waning Gibbous';
      illumination = 0.8 - (cyclePosition - 0.5625) * 4;
    } else if (cyclePosition < 0.8125) {
      phase = 'Last Quarter';
      illumination = 0.6 - (cyclePosition - 0.6875) * 4;
    } else {
      phase = 'Waning Crescent';
      illumination = 0.4 - (cyclePosition - 0.8125) * 8;
    }

    return { phase, illumination: Math.max(0, Math.min(1, illumination)), age };
  }

  static calculateMoonDistance(date: Date): number {
    // Simplified calculation - in reality this would use more complex orbital mechanics
    const daysSinceEpoch = (date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
    const meanAnomaly = (daysSinceEpoch * 0.98560028) * Math.PI / 180;
    
    // Average distance to moon is ~384,400 km, varies by ~43,000 km
    const baseDistance = 384400;
    const variation = 21500 * Math.sin(meanAnomaly);
    
    return baseDistance + variation;
  }

  static calculateMoonTimes(date: Date, latitude: number, longitude: number): { moonrise: string; moonset: string } {
    // Simplified calculation - in production would use more accurate algorithms
    const julianDay = this.getJulianDay(date);
    const moonAge = this.calculateMoonPhase(date).age;
    
    // Approximate moonrise/moonset based on location and moon age
    const timeOffset = longitude / 15; // Convert longitude to time offset
    const phaseOffset = (moonAge / this.LUNAR_CYCLE) * 24; // Phase affects rise/set times
    
    const riseHour = (18 + timeOffset + phaseOffset) % 24;
    const setHour = (6 + timeOffset + phaseOffset) % 24;
    
    const moonrise = this.formatTime(riseHour);
    const moonset = this.formatTime(setHour);
    
    return { moonrise, moonset };
  }

  static calculateZodiacPosition(date: Date): { sign: string; degree: number; nextTransition: string } {
    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const daysSinceEpoch = (date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
    const lunarPosition = (daysSinceEpoch * 13.176396) % 360; // Moon moves ~13.18° per day
    
    const signIndex = Math.floor(lunarPosition / 30);
    const degree = lunarPosition % 30;
    const sign = zodiacSigns[signIndex];
    
    // Calculate next transition
    const daysToNextSign = (30 - degree) / 13.176396;
    const nextTransitionDate = new Date(date.getTime() + (daysToNextSign * 24 * 60 * 60 * 1000));
    
    return {
      sign,
      degree,
      nextTransition: nextTransitionDate.toLocaleDateString()
    };
  }

  static calculateMoonPosition(date: Date, latitude: number, longitude: number): {
    rightAscension: string;
    declination: string;
    altitude: number;
    azimuth: number;
  } {
    // Simplified lunar position calculation
    const daysSinceEpoch = (date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
    const meanLongitude = (218.3164477 + 481267.88123421 * (daysSinceEpoch / 36525)) % 360;
    
    // Convert to equatorial coordinates (simplified)
    const ra = meanLongitude / 15; // Convert to hours
    const dec = Math.sin(meanLongitude * Math.PI / 180) * 23.45; // Simplified declination
    
    // Calculate local coordinates
    const hourAngle = (date.getHours() + date.getMinutes() / 60) - ra;
    const alt = Math.asin(
      Math.sin(dec * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) +
      Math.cos(dec * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * 
      Math.cos(hourAngle * 15 * Math.PI / 180)
    ) * 180 / Math.PI;
    
    const azimuth = Math.atan2(
      Math.sin(hourAngle * 15 * Math.PI / 180),
      Math.cos(hourAngle * 15 * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) -
      Math.tan(dec * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    ) * 180 / Math.PI;
    
    return {
      rightAscension: this.formatRA(ra),
      declination: this.formatDec(dec),
      altitude: Math.max(0, alt),
      azimuth: (azimuth + 360) % 360
    };
  }

  static calculateTidalData(date: Date, latitude: number, longitude: number): TidalData {
    // Simplified tidal calculation based on moon phase and position
    const moonPhase = this.calculateMoonPhase(date);
    const baseHigh = 12 + (moonPhase.age / this.LUNAR_CYCLE) * 12;
    const baseLow = baseHigh + 6;
    
    return {
      highTide: this.formatTime(baseHigh % 24),
      lowTide: this.formatTime(baseLow % 24),
      tidalRange: 2.3 + (1 - moonPhase.illumination) * 0.5 // Higher range during new/full moon
    };
  }

  private static getJulianDay(date: Date): number {
    return (date.getTime() / 86400000) + 2440587.5;
  }

  private static formatTime(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  }

  private static formatRA(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  private static formatDec(degrees: number): string {
    const sign = degrees >= 0 ? '+' : '-';
    const deg = Math.floor(Math.abs(degrees));
    const min = Math.floor((Math.abs(degrees) - deg) * 60);
    return `${sign}${deg}° ${min}'`;
  }

  static getAstrologyInsight(phase: string, zodiacSign: string): string {
    const insights: Record<string, Record<string, string>> = {
      'New Moon': {
        'Aries': 'A powerful time for new beginnings and taking initiative. Channel your pioneering spirit into fresh ventures.',
        'Taurus': 'Focus on stability and material foundations. This is perfect timing for financial planning and grounding practices.',
        'Gemini': 'Communication and learning take center stage. Start new educational pursuits or important conversations.',
        'Cancer': 'Emotional renewal and family connections are highlighted. Create nurturing spaces in your life.',
        'Leo': 'Creative expression and self-confidence bloom. Begin artistic projects or leadership roles.',
        'Virgo': 'Organization and health improvements are favored. Start new wellness routines or decluttering projects.',
        'Libra': 'Relationships and balance are the focus. Initiate partnerships or restore harmony in your life.',
        'Scorpio': 'Deep transformation and renewal are possible. Embrace change and release what no longer serves.',
        'Sagittarius': 'Adventure and philosophical growth call to you. Begin journeys of discovery and learning.',
        'Capricorn': 'Career advancement and goal-setting are highlighted. Structure your ambitions for success.',
        'Aquarius': 'Innovation and humanitarian efforts take precedence. Start projects that benefit the collective.',
        'Pisces': 'Spiritual growth and intuitive development are enhanced. Trust your inner wisdom and creativity.'
      },
      'Full Moon': {
        'Aries': 'Peak energy for leadership and bold action. Your courage and initiative reach their zenith.',
        'Taurus': 'Abundance and material manifestation are at their strongest. Celebrate your achievements and stability.',
        'Gemini': 'Communication reaches its peak clarity. Important messages and connections come to fruition.',
        'Cancer': 'Emotional fulfillment and family bonds are deeply felt. Nurturing reaches its most powerful expression.',
        'Leo': 'Creative brilliance and recognition shine brightest. Your unique talents demand the spotlight.',
        'Virgo': 'Perfection and service find their highest expression. Your attention to detail yields remarkable results.',
        'Libra': 'Relationships reach perfect harmony or clear resolution. Balance and beauty are prominently featured.',
        'Scorpio': 'Transformation completes its powerful cycle. Deep truths and hidden knowledge are revealed.',
        'Sagittarius': 'Wisdom and adventure reach their peak. Your philosophical insights guide others on their paths.',
        'Capricorn': 'Achievement and authority are fully realized. Your hard work manifests in tangible success.',
        'Aquarius': 'Innovation and group consciousness reach their heights. Revolutionary ideas benefit humanity.',
        'Pisces': 'Spiritual connection and intuitive gifts reach their fullest expression. Dreams and reality merge beautifully.'
      }
    };

    const phaseInsights = insights[phase] || insights['New Moon'];
    return phaseInsights[zodiacSign] || phaseInsights['Aries'];
  }

  static getWellnessTip(phase: string): string {
    const tips: Record<string, string> = {
      'New Moon': 'Practice intention-setting meditation and gentle yoga. This is ideal for starting new wellness routines and setting health goals.',
      'Waxing Crescent': 'Build momentum with consistent exercise and hydration. Focus on establishing healthy habits that will grow with the moon.',
      'First Quarter': 'Channel the moon\'s building energy into strength training and active pursuits. Push through challenges with determination.',
      'Waxing Gibbous': 'Refine your wellness practices and prepare for peak energy. Focus on nutrition optimization and stress management.',
      'Full Moon': 'Embrace high-energy activities but balance with restorative practices. Meditation and breathwork help channel intense energy.',
      'Waning Gibbous': 'Practice gratitude and gentle release. Detox practices and cleansing routines are particularly beneficial now.',
      'Last Quarter': 'Focus on letting go of unhealthy habits. This is perfect for breaking patterns and clearing emotional blockages.',
      'Waning Crescent': 'Rest, restore, and prepare for renewal. Prioritize sleep, gentle stretching, and contemplative practices.'
    };

    return tips[phase] || tips['New Moon'];
  }
}

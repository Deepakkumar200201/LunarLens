import { useQuery } from '@tanstack/react-query';
import { useLocation } from './use-location';

interface MoonData {
  phase: string;
  illumination: number;
  age: number;
  distance: number;
  angularDiameter: number;
  moonrise: string;
  moonset: string;
  zodiac: {
    sign: string;
    degree: number;
    nextTransition: string;
  };
  position: {
    rightAscension: string;
    declination: string;
    altitude: number;
    azimuth: number;
  };
  tides: {
    highTide: string;
    lowTide: string;
    tidalRange: number;
  };
  astrologyInsight: string;
  wellnessTip: string;
}

export function useMoonData() {
  const location = useLocation();

  return useQuery<MoonData>({
    queryKey: ['/api/moon/current', location.latitude, location.longitude],
    enabled: !location.loading,
    refetchInterval: 60000, // Update every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useMoonDataForDate(date: string) {
  const location = useLocation();

  return useQuery<MoonData>({
    queryKey: [`/api/moon/date/${date}`, location.latitude, location.longitude],
    enabled: !location.loading && !!date,
  });
}

export function useLunarCalendar(year: number, month: number) {
  return useQuery({
    queryKey: [`/api/calendar/${year}/${month}`],
    staleTime: 24 * 60 * 60 * 1000, // Calendar data is stable for a day
  });
}

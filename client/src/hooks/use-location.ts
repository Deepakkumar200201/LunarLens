import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  error?: string;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: 40.7128, // Default to NYC
    longitude: -74.0060,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          error: `Location error: ${error.message}`,
          loading: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  return location;
}

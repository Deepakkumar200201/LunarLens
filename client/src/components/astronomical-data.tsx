import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Telescope, Globe, Waves } from 'lucide-react';
import { getZodiacEmoji } from '@/lib/moonPhaseCalculations';
import { Skeleton } from '@/components/ui/skeleton';

interface AstronomicalDataProps {
  moonData?: {
    position: {
      rightAscension: string;
      declination: string;
      altitude: number;
      azimuth: number;
    };
    zodiac: {
      sign: string;
      degree: number;
      nextTransition: string;
    };
    tides: {
      highTide: string;
      lowTide: string;
      tidalRange: number;
    };
  };
  isLoading?: boolean;
}

export default function AstronomicalData({ moonData, isLoading }: AstronomicalDataProps) {
  if (isLoading) {
    return (
      <section className="py-12 bg-black bg-opacity-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
            Astronomical Data
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-12 h-8 rounded mr-3" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!moonData) {
    return (
      <section className="py-12 bg-black bg-opacity-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
            Astronomical Data
          </h2>
          <div className="text-center text-red-400">
            Unable to load astronomical data
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black bg-opacity-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
          Astronomical Data
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Lunar Position */}
          <Card className="glass-card glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Telescope className="w-6 h-6 mr-3 text-blue-400" />
                <CardTitle className="font-orbitron">Lunar Position</CardTitle>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Right Ascension:</span>
                  <span className="font-orbitron">{moonData.position.rightAscension}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Declination:</span>
                  <span className="font-orbitron">{moonData.position.declination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Altitude:</span>
                  <span className="font-orbitron">{moonData.position.altitude.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Azimuth:</span>
                  <span className="font-orbitron">{moonData.position.azimuth.toFixed(1)}°</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zodiac Info */}
          <Card className="glass-card glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 mr-3 text-purple-400" />
                <CardTitle className="font-orbitron">Zodiac Info</CardTitle>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Current Sign:</span>
                  <span className="font-orbitron text-yellow-400">
                    {moonData.zodiac.sign} {getZodiacEmoji(moonData.zodiac.sign)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Degree:</span>
                  <span className="font-orbitron">{moonData.zodiac.degree.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Next Transition:</span>
                  <span className="font-orbitron text-xs">{moonData.zodiac.nextTransition}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tidal Influence */}
          <Card className="glass-card glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Waves className="w-6 h-6 mr-3 text-cyan-400" />
                <CardTitle className="font-orbitron">Tidal Influence</CardTitle>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">High Tide:</span>
                  <span className="font-orbitron">{moonData.tides.highTide}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Low Tide:</span>
                  <span className="font-orbitron">{moonData.tides.lowTide}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Tidal Range:</span>
                  <span className="font-orbitron">{moonData.tides.tidalRange.toFixed(1)}m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Leaf } from 'lucide-react';
import { getZodiacEmoji } from '@/lib/moonPhaseCalculations';
import { Skeleton } from '@/components/ui/skeleton';

interface DailyInsightsProps {
  moonData?: {
    zodiac: {
      sign: string;
      degree: number;
      nextTransition: string;
    };
    astrologyInsight: string;
    wellnessTip: string;
  };
  isLoading?: boolean;
}

export default function DailyInsights({ moonData, isLoading }: DailyInsightsProps) {
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
            Today's Lunar Insights
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="text-2xl text-yellow-400 mr-3" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Leaf className="text-2xl text-green-400 mr-3" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!moonData) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
            Today's Lunar Insights
          </h2>
          <div className="text-center text-red-400">
            Unable to load lunar insights
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
          Today's Lunar Insights
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Astrology Insight */}
          <Card className="glass-card glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="text-2xl text-yellow-400 mr-3" />
                <CardTitle className="text-xl">Astrological Influence</CardTitle>
              </div>
              
              <div className="mb-4">
                <div className="text-6xl text-center py-4">
                  {getZodiacEmoji(moonData.zodiac.sign)}
                </div>
              </div>
              
              <div className="text-sm text-blue-200 mb-2">
                Moon in{' '}
                <span className="text-yellow-400 font-semibold">
                  {moonData.zodiac.sign} {getZodiacEmoji(moonData.zodiac.sign)}
                </span>
              </div>
              
              <p className="text-sm leading-relaxed">
                {moonData.astrologyInsight}
              </p>
            </CardContent>
          </Card>

          {/* Wellness Tip */}
          <Card className="glass-card glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Leaf className="text-2xl text-green-400 mr-3" />
                <CardTitle className="text-xl">Wellness Guidance</CardTitle>
              </div>
              
              <div className="mb-4">
                <div className="text-6xl text-center py-4">
                  🧘‍♀️
                </div>
              </div>
              
              <div className="text-sm text-blue-200 mb-2">
                Lunar Energy Guidance
              </div>
              
              <p className="text-sm leading-relaxed">
                {moonData.wellnessTip}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

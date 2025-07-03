import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMoonPhaseIcon, getMoonPhaseDescription } from '@/lib/moonPhaseCalculations';

const MOON_PHASES = [
  'New Moon',
  'Waxing Crescent', 
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent'
];

export default function MoonPhasesGrid() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
          Moon Phase Guide
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {MOON_PHASES.map(phase => (
            <Card key={phase} className="glass-card text-center glow-effect">
              <CardContent className="p-4">
                <div className="text-4xl mb-3">
                  {getMoonPhaseIcon(phase)}
                </div>
                <CardTitle className="font-orbitron font-semibold mb-2 text-sm">
                  {phase}
                </CardTitle>
                <p className="text-xs text-blue-200">
                  {getMoonPhaseDescription(phase)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

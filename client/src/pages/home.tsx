import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import Moon3DVisualization from '@/components/moon3d';
import LunarCalendar from '@/components/lunar-calendar';
import MoonPhasesGrid from '@/components/moon-phases-grid';
import DailyInsights from '@/components/daily-insights';
import AstronomicalData from '@/components/astronomical-data';
import NotificationBanner from '@/components/notification-banner';
import { useMoonData } from '@/hooks/use-moon-data';
import { Moon } from 'lucide-react';

export default function Home() {
  const { data: moonData, isLoading, error } = useMoonData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <Moon className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-xl font-orbitron font-bold">Unable to Load Lunar Data</h2>
            </div>
            <p className="text-sm text-blue-200">
              Please check your connection and try again
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with 3D Moon */}
      <section className="pt-24 pb-12 constellation-bg">
        <div className="container mx-auto px-4 text-center">
          <NotificationBanner />
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 aurora-gradient">
              Current Moon Phase
            </h1>
            <p className="text-lg text-blue-200 font-light">
              Track the celestial rhythm that guides our world
            </p>
          </div>

          {/* 3D Moon Display */}
          <div className="flex justify-center mb-8">
            <Moon3DVisualization moonData={moonData} />
          </div>

          {/* Current Moon Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="glass-card glow-effect">
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm font-medium">Moonrise</div>
                <div className="text-xl font-orbitron font-bold mt-1">
                  {isLoading ? '...' : moonData?.moonrise || 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card glow-effect">
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm font-medium">Moonset</div>
                <div className="text-xl font-orbitron font-bold mt-1">
                  {isLoading ? '...' : moonData?.moonset || 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card glow-effect">
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm font-medium">Age</div>
                <div className="text-xl font-orbitron font-bold mt-1">
                  {isLoading ? '...' : `${moonData?.age.toFixed(1) || 0} days`}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card glow-effect">
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm font-medium">Distance</div>
                <div className="text-xl font-orbitron font-bold mt-1">
                  {isLoading ? '...' : `${moonData?.distance?.toLocaleString() || 0} km`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Insights */}
      <DailyInsights moonData={moonData} isLoading={isLoading} />

      {/* Lunar Calendar */}
      <section className="py-12 bg-black bg-opacity-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8">
            Lunar Calendar
          </h2>
          <div className="max-w-4xl mx-auto">
            <LunarCalendar />
          </div>
        </div>
      </section>

      {/* Moon Phases Grid */}
      <MoonPhasesGrid />

      {/* Astronomical Data */}
      <AstronomicalData moonData={moonData} isLoading={isLoading} />

      {/* Footer */}
      <footer className="py-8 border-t border-white border-opacity-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Moon className="text-2xl text-yellow-400" />
              <span className="text-xl font-orbitron font-bold">Lunar</span>
            </div>
            <p className="text-sm text-blue-200 mb-4">
              Connect with the celestial rhythms that guide our world
            </p>
            <div className="flex justify-center space-x-6 text-sm mb-4">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Support</a>
            </div>
            <div className="text-xs text-blue-200">
              <p>Astronomical calculations based on established algorithms</p>
              <p className="mt-1">© 2024 Lunar App. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

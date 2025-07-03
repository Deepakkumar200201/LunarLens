import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import LunarCalendar from '@/components/lunar-calendar';
import { useLunarCalendar } from '@/hooks/use-moon-data';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  const { data: calendarData, isLoading } = useLunarCalendar(selectedYear, selectedMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getMoonPhaseIcon = (phase: string) => {
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
    return icons[phase] || '🌙';
  };

  const getUpcomingEvents = () => {
    if (!calendarData?.days) return [];
    
    const today = new Date();
    return calendarData.days
      .filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= today && ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'].includes(day.phase);
      })
      .slice(0, 5)
      .map(day => ({
        date: new Date(day.date),
        phase: day.phase,
        illumination: day.illumination
      }));
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 constellation-bg">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <CalendarIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Lunar Calendar</h1>
            <p className="text-purple-200">Track moon phases and celestial events throughout the year</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Calendar */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <CardTitle className="text-xl text-white">
                      {getMonthName(selectedMonth)} {selectedYear}
                    </CardTitle>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <LunarCalendar year={selectedYear} month={selectedMonth} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-purple-500/20 rounded mb-2"></div>
                          <div className="h-3 bg-purple-500/10 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUpcomingEvents().map((event, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <span className="text-2xl">{getMoonPhaseIcon(event.phase)}</span>
                          <div>
                            <div className="font-medium text-purple-100">{event.phase}</div>
                            <div className="text-sm text-purple-300">
                              {event.date.toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {getUpcomingEvents().length === 0 && (
                        <p className="text-purple-300 text-sm">No major lunar events this month</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Moon Phase Legend */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Moon Phase Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { phase: 'New Moon', icon: '🌑', desc: 'New beginnings' },
                      { phase: 'First Quarter', icon: '🌓', desc: 'Taking action' },
                      { phase: 'Full Moon', icon: '🌕', desc: 'Peak energy' },
                      { phase: 'Last Quarter', icon: '🌗', desc: 'Release & reflect' }
                    ].map((item) => (
                      <div key={item.phase} className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-medium text-purple-100 text-sm">{item.phase}</div>
                          <div className="text-xs text-purple-300">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const now = new Date();
                        setSelectedYear(now.getFullYear());
                        setSelectedMonth(now.getMonth() + 1);
                      }}
                      className="w-full justify-start text-purple-300 hover:text-purple-100"
                    >
                      Go to Current Month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="w-full justify-start text-purple-300 hover:text-purple-100"
                    >
                      Next Month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="w-full justify-start text-purple-300 hover:text-purple-100"
                    >
                      Previous Month
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
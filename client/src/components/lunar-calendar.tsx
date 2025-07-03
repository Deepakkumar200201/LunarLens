import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLunarCalendar } from '@/hooks/use-moon-data';
import { getMoonPhaseIcon } from '@/lib/moonPhaseCalculations';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface LunarCalendarProps {
  year?: number;
  month?: number;
}

export default function LunarCalendar({ year: propYear, month: propMonth }: LunarCalendarProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const displayYear = propYear || currentDate.getFullYear();
  const displayMonth = propMonth || (currentDate.getMonth() + 1);

  const { data: calendarData, isLoading, error } = useLunarCalendar(displayYear, displayMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getCalendarDays = () => {
    if (!calendarData || !calendarData.days) return [];
    
    const firstDay = new Date(displayYear, displayMonth - 1, 1);
    const lastDay = new Date(displayYear, displayMonth, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentMonth = displayMonth - 1;
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayData = calendarData.days.find((d: any) => 
        new Date(d.date).getDate() === date.getDate() && 
        date.getMonth() === currentMonth
      );
      
      days.push({
        date,
        dayData,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  };

  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            Failed to load calendar data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card glow-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="glass-card glow-effect"
          >
            <ChevronLeft />
          </Button>
          <CardTitle className="font-orbitron text-xl">
            {MONTHS[displayMonth - 1]} {displayYear}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="glass-card glow-effect"
          >
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-blue-200">Loading calendar...</div>
          </div>
        ) : (
          <>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-blue-200">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {getCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`
                    p-2 h-16 flex flex-col items-center justify-center rounded cursor-pointer transition-all
                    ${day.isCurrentMonth 
                      ? 'hover:bg-white hover:bg-opacity-10' 
                      : 'opacity-40'
                    }
                    ${day.isToday 
                      ? 'bg-purple-600 bg-opacity-30 ring-2 ring-purple-400' 
                      : ''
                    }
                  `}
                >
                  <span className={`text-sm ${day.isToday ? 'font-bold' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {day.dayData && (
                    <span className="text-xs mt-1">
                      {getMoonPhaseIcon(day.dayData.phase)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Moon phase legend */}
            <div className="flex items-center justify-center space-x-4 mt-6 text-xs flex-wrap gap-2">
              <div className="flex items-center">
                <span className="mr-1">🌑</span>
                <span>New Moon</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🌓</span>
                <span>First Quarter</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🌕</span>
                <span>Full Moon</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🌗</span>
                <span>Last Quarter</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

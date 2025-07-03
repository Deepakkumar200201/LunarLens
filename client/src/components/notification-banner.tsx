import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { Link } from 'wouter';

interface UpcomingNotification {
  id: number;
  phaseType: string;
  phaseDate: string;
  message: {
    title: string;
    body: string;
  };
}

export default function NotificationBanner() {
  const [nextNotification, setNextNotification] = useState<UpcomingNotification | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadNextNotification();
    checkNotificationStatus();
  }, []);

  const loadNextNotification = async () => {
    try {
      const response = await fetch('/api/notifications/upcoming');
      if (response.ok) {
        const notifications = await response.json();
        if (notifications.length > 0) {
          setNextNotification(notifications[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load next notification:', error);
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const settings = await response.json();
        setNotificationsEnabled(settings.notifications);
      }
    } catch (error) {
      console.error('Failed to check notification status:', error);
    }
  };

  const triggerTestNotification = async () => {
    // Schedule notifications first
    try {
      await fetch('/api/notifications/schedule', { method: 'POST' });
      loadNextNotification(); // Reload to show newly scheduled notifications
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
    }

    // Show browser notification if permissions are granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🌙 Full Moon Tomorrow', {
        body: 'The moon will be full tomorrow night. Perfect time for manifestation and release!',
        icon: '/favicon.ico'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays < 7) return `in ${diffDays} days`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getMoonIcon = (phaseType: string) => {
    const icons: Record<string, string> = {
      'New Moon': '🌑',
      'Full Moon': '🌕',
      'First Quarter': '🌓',
      'Last Quarter': '🌗'
    };
    return icons[phaseType] || '🌙';
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6">
      {!notificationsEnabled && (
        <Card className="glass-card border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-medium text-yellow-100">Enable Moon Phase Notifications</div>
                  <div className="text-sm text-yellow-200">Never miss a significant lunar event</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/notifications">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Enable
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsVisible(false)}
                  className="text-yellow-200 hover:text-yellow-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {notificationsEnabled && nextNotification && (
        <Card className="glass-card border-purple-500/30 bg-purple-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMoonIcon(nextNotification.phaseType)}</span>
                <div>
                  <div className="font-medium text-purple-100">
                    {nextNotification.phaseType} {formatDate(nextNotification.phaseDate)}
                  </div>
                  <div className="text-sm text-purple-200">
                    {nextNotification.message.body.substring(0, 80)}...
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={triggerTestNotification}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Test Alert
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsVisible(false)}
                  className="text-purple-200 hover:text-purple-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Moon, Sun, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface NotificationSettings {
  notifications: boolean;
  newMoonAlerts: boolean;
  fullMoonAlerts: boolean;
  quarterMoonAlerts: boolean;
  notificationTime: string;
  dailyInsights: boolean;
  phaseAlerts: boolean;
  wellnessTips: boolean;
}

interface UpcomingNotification {
  id: number;
  phaseType: string;
  phaseDate: string;
  message: {
    title: string;
    body: string;
  };
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    notifications: true,
    newMoonAlerts: true,
    fullMoonAlerts: true,
    quarterMoonAlerts: true,
    notificationTime: "09:00",
    dailyInsights: true,
    phaseAlerts: true,
    wellnessTips: true
  });
  
  const [upcomingNotifications, setUpcomingNotifications] = useState<UpcomingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadUpcomingNotifications();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const loadUpcomingNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/upcoming');
      if (response.ok) {
        const data = await response.json();
        setUpcomingNotifications(data);
      }
    } catch (error) {
      console.error('Failed to load upcoming notifications:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    setIsLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const data = await apiRequest('/api/notifications/settings', 'POST', updatedSettings);
      
      if (data.success) {
        setSettings(updatedSettings);
        toast({
          title: "Settings Updated",
          description: "Your notification preferences have been saved.",
        });
        
        // Reload upcoming notifications
        loadUpcomingNotifications();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive moon phase notifications in your browser.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings to receive alerts.",
          variant: "destructive",
        });
      }
    }
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🌙 Test Notification', {
        body: 'This is how your moon phase notifications will appear!',
        icon: '/favicon.ico'
      });
    } else {
      toast({
        title: "Test Notification",
        description: "This is how your moon phase notifications will appear!",
      });
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Settings */}
      <Card className="glass-card glow-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master notification toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-blue-200">Receive alerts for upcoming moon phases</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              disabled={isLoading}
            />
          </div>

          {settings.notifications && (
            <>
              {/* Browser permission */}
              {('Notification' in window && Notification.permission !== 'granted') && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-yellow-400">Browser Notifications</h4>
                      <p className="text-sm text-yellow-200">Allow notifications to receive alerts in your browser</p>
                    </div>
                    <Button 
                      onClick={requestNotificationPermission}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Enable
                    </Button>
                  </div>
                </div>
              )}

              {/* Notification time */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Notification Time
                  </Label>
                  <p className="text-sm text-blue-200">What time should we notify you?</p>
                </div>
                <input
                  type="time"
                  value={settings.notificationTime}
                  onChange={(e) => updateSettings({ notificationTime: e.target.value })}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                  disabled={isLoading}
                />
              </div>

              {/* Phase-specific settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Moon Phase Alerts
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌑</span>
                      <Label>New Moon</Label>
                    </div>
                    <Switch
                      checked={settings.newMoonAlerts}
                      onCheckedChange={(checked) => updateSettings({ newMoonAlerts: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌕</span>
                      <Label>Full Moon</Label>
                    </div>
                    <Switch
                      checked={settings.fullMoonAlerts}
                      onCheckedChange={(checked) => updateSettings({ fullMoonAlerts: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌓</span>
                      <Label>Quarter Moons</Label>
                    </div>
                    <Switch
                      checked={settings.quarterMoonAlerts}
                      onCheckedChange={(checked) => updateSettings({ quarterMoonAlerts: checked })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Additional settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Daily Content
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Daily Insights</Label>
                    <Switch
                      checked={settings.dailyInsights}
                      onCheckedChange={(checked) => updateSettings({ dailyInsights: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Wellness Tips</Label>
                    <Switch
                      checked={settings.wellnessTips}
                      onCheckedChange={(checked) => updateSettings({ wellnessTips: checked })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Test notification */}
              <div className="pt-4 border-t border-white/10">
                <Button 
                  onClick={testNotification}
                  variant="outline"
                  className="w-full"
                >
                  Test Notification
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Notifications */}
      {settings.notifications && upcomingNotifications.length > 0 && (
        <Card className="glass-card glow-effect">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <CardTitle>Upcoming Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingNotifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoonIcon(notification.phaseType)}</span>
                    <div>
                      <div className="font-medium">{notification.message.title}</div>
                      <div className="text-sm text-blue-200">
                        {new Date(notification.phaseDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-300">
                    {new Date(notification.phaseDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/navigation';
import NotificationSettings from '@/components/notification-settings';
import { useLocation } from '@/hooks/use-location';
import { Settings, MapPin, Palette, Bell, User, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { latitude, longitude, error: locationError, loading: locationLoading } = useLocation();
  const [personalSettings, setPersonalSettings] = useState({
    name: '',
    email: '',
    timezone: 'America/New_York',
    location: '',
    units: 'imperial' as 'metric' | 'imperial',
    language: 'en'
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'dark' as 'light' | 'dark' | 'auto',
    animations: true,
    reducedMotion: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    showSeconds: true,
    show24Hour: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    analytics: true,
    marketing: false,
    dataExport: false
  });

  const updatePersonalSetting = (key: string, value: any) => {
    setPersonalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateDisplaySetting = (key: string, value: any) => {
    setDisplaySettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    // Create a mock data export
    const userData = {
      personal: personalSettings,
      display: displaySettings,
      privacy: privacySettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lunar-app-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Mumbai', 'Australia/Sydney'
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 constellation-bg">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <Settings className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-blue-200">Customize your lunar tracking experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-200">Name</Label>
                  <Input
                    id="name"
                    value={personalSettings.name}
                    onChange={(e) => updatePersonalSetting('name', e.target.value)}
                    placeholder="Enter your name"
                    className="bg-blue-500/10 border-blue-500/30 text-white placeholder-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalSettings.email}
                    onChange={(e) => updatePersonalSetting('email', e.target.value)}
                    placeholder="Enter your email"
                    className="bg-blue-500/10 border-blue-500/30 text-white placeholder-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-blue-200">Timezone</Label>
                  <Select value={personalSettings.timezone} onValueChange={(value) => updatePersonalSetting('timezone', value)}>
                    <SelectTrigger className="bg-blue-500/10 border-blue-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace('_', ' ').replace('/', ' / ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-200">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-200">
                      {locationLoading ? 'Getting location...' : 
                       locationError ? 'Location unavailable' :
                       latitude && longitude ? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` :
                       'Click to enable location'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units" className="text-blue-200">Units</Label>
                  <Select value={personalSettings.units} onValueChange={(value: 'metric' | 'imperial') => updatePersonalSetting('units', value)}>
                    <SelectTrigger className="bg-blue-500/10 border-blue-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (°C, km)</SelectItem>
                      <SelectItem value="imperial">Imperial (°F, mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  Display & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-purple-200">Theme</Label>
                  <Select value={displaySettings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => updateDisplaySetting('theme', value)}>
                    <SelectTrigger className="bg-purple-500/10 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animations" className="text-purple-200">Enable Animations</Label>
                  <Switch
                    id="animations"
                    checked={displaySettings.animations}
                    onCheckedChange={(checked) => updateDisplaySetting('animations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reducedMotion" className="text-purple-200">Reduced Motion</Label>
                  <Switch
                    id="reducedMotion"
                    checked={displaySettings.reducedMotion}
                    onCheckedChange={(checked) => updateDisplaySetting('reducedMotion', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize" className="text-purple-200">Font Size</Label>
                  <Select value={displaySettings.fontSize} onValueChange={(value: 'small' | 'medium' | 'large') => updateDisplaySetting('fontSize', value)}>
                    <SelectTrigger className="bg-purple-500/10 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showSeconds" className="text-purple-200">Show Seconds in Time</Label>
                  <Switch
                    id="showSeconds"
                    checked={displaySettings.showSeconds}
                    onCheckedChange={(checked) => updateDisplaySetting('showSeconds', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show24Hour" className="text-purple-200">24-Hour Time Format</Label>
                  <Switch
                    id="show24Hour"
                    checked={displaySettings.show24Hour}
                    onCheckedChange={(checked) => updateDisplaySetting('show24Hour', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shareLocation" className="text-orange-200">Share Location</Label>
                    <p className="text-xs text-orange-300">Allow location sharing for accurate moon data</p>
                  </div>
                  <Switch
                    id="shareLocation"
                    checked={privacySettings.shareLocation}
                    onCheckedChange={(checked) => updatePrivacySetting('shareLocation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics" className="text-orange-200">Analytics</Label>
                    <p className="text-xs text-orange-300">Help improve the app with usage data</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={privacySettings.analytics}
                    onCheckedChange={(checked) => updatePrivacySetting('analytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing" className="text-orange-200">Marketing Communications</Label>
                    <p className="text-xs text-orange-300">Receive updates about new features</p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={privacySettings.marketing}
                    onCheckedChange={(checked) => updatePrivacySetting('marketing', checked)}
                  />
                </div>

                <div className="pt-4 border-t border-orange-500/20">
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="w-full border-orange-500/30 text-orange-200 hover:bg-orange-500/10"
                  >
                    Export My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Settings */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-lg text-white">Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Astronomical Calculations</h4>
                  <p className="text-sm text-gray-300">High precision calculations for moon phases and positions</p>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Label className="text-gray-300">Enhanced Precision</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Data Sync</h4>
                  <p className="text-sm text-gray-300">Sync your settings across devices</p>
                  <div className="flex items-center gap-2">
                    <Switch />
                    <Label className="text-gray-300">Auto Sync</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Offline Mode</h4>
                  <p className="text-sm text-gray-300">Cache data for offline use</p>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Label className="text-gray-300">Enable Offline</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
            >
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
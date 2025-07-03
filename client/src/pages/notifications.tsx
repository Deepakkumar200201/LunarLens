import Navigation from '@/components/navigation';
import NotificationSettings from '@/components/notification-settings';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 aurora-gradient">
              Moon Phase Notifications
            </h1>
            <p className="text-lg text-blue-200 font-light max-w-2xl mx-auto">
              Never miss a significant lunar event. Get personalized notifications for New Moons, Full Moons, and Quarter phases.
            </p>
          </div>
          
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
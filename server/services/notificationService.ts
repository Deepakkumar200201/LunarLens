import { storage } from "../storage";
import { AstronomicalCalculator } from "./astronomicalCalculations";
import type { InsertMoonPhaseNotification } from "@shared/schema";

export class NotificationService {
  private static readonly KEY_PHASES = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];
  
  static async scheduleUpcomingNotifications(userId: number): Promise<void> {
    const userSettings = await storage.getUserSettings(userId);
    if (!userSettings || !userSettings.notifications) {
      return;
    }

    // Clear existing future notifications for this user
    const existingNotifications = await storage.getUserNotifications(userId);
    const now = new Date();
    
    // Generate notifications for the next 90 days
    const notifications: InsertMoonPhaseNotification[] = [];
    
    for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + dayOffset);
      
      const moonData = AstronomicalCalculator.calculateMoonPhase(checkDate);
      
      if (this.KEY_PHASES.includes(moonData.phase)) {
        // Check if user wants this type of notification
        const shouldNotify = this.shouldNotifyForPhase(moonData.phase, userSettings);
        
        if (shouldNotify) {
          // Schedule notification for the morning of the phase day
          const notificationDateTime = new Date(checkDate);
          const [hours, minutes] = (userSettings.notificationTime || "09:00").split(':');
          notificationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          // Check if we already have a notification for this phase on this date
          const existingForThisPhase = existingNotifications.find(n => 
            n.phaseType === moonData.phase && 
            n.phaseDate.toDateString() === checkDate.toDateString()
          );
          
          if (!existingForThisPhase && notificationDateTime > now) {
            notifications.push({
              userId,
              phaseType: moonData.phase,
              phaseDate: checkDate,
              notificationDate: notificationDateTime
            });
          }
        }
      }
    }

    // Create all notifications
    for (const notification of notifications) {
      await storage.createMoonPhaseNotification(notification);
    }
  }

  private static shouldNotifyForPhase(phase: string, userSettings: any): boolean {
    switch (phase) {
      case 'New Moon':
        return userSettings.newMoonAlerts !== false;
      case 'Full Moon':
        return userSettings.fullMoonAlerts !== false;
      case 'First Quarter':
      case 'Last Quarter':
        return userSettings.quarterMoonAlerts !== false;
      default:
        return false;
    }
  }

  static async processPendingNotifications(): Promise<void> {
    const pendingNotifications = await storage.getPendingNotifications();
    
    for (const notification of pendingNotifications) {
      try {
        await this.sendNotification(notification);
        await storage.markNotificationSent(notification.id);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }

  private static async sendNotification(notification: any): Promise<void> {
    // In a real application, this would send notifications via:
    // - Browser Web Push API
    // - Email
    // - SMS
    // - Mobile push notifications
    
    console.log(`🌙 Notification: ${notification.phaseType} occurring on ${notification.phaseDate.toLocaleDateString()}`);
    
    // For now, we'll store the notification as "sent" but in a real app
    // you'd integrate with notification services like:
    // - Firebase Cloud Messaging
    // - SendGrid for email
    // - Twilio for SMS
    // - Web Push API for browser notifications
  }

  static getNotificationMessage(phaseType: string): { title: string; body: string } {
    const messages = {
      'New Moon': {
        title: '🌑 New Moon Tonight',
        body: 'Perfect time for new beginnings and setting intentions. The moon\'s energy supports fresh starts and manifestation.'
      },
      'Full Moon': {
        title: '🌕 Full Moon Tonight',
        body: 'Peak lunar energy! Time for culmination, celebration, and releasing what no longer serves you.'
      },
      'First Quarter': {
        title: '🌓 First Quarter Moon',
        body: 'Decision time! The moon\'s building energy supports taking action on your goals and pushing through challenges.'
      },
      'Last Quarter': {
        title: '🌗 Last Quarter Moon',
        body: 'Time for reflection and release. Let go of what isn\'t working and prepare for the new cycle ahead.'
      }
    };
    
    return messages[phaseType as keyof typeof messages] || {
      title: '🌙 Moon Phase Update',
      body: `The moon is in ${phaseType} phase today.`
    };
  }
}
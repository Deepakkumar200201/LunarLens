import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AstronomicalCalculator } from "./services/astronomicalCalculations";
import { NotificationService } from "./services/notificationService";
import { z } from "zod";

const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current moon data
  app.get("/api/moon/current", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      const latitude = lat ? parseFloat(lat as string) : 40.7128; // Default to NYC
      const longitude = lng ? parseFloat(lng as string) : -74.0060;
      
      const now = new Date();
      const moonPhase = AstronomicalCalculator.calculateMoonPhase(now);
      const distance = AstronomicalCalculator.calculateMoonDistance(now);
      const moonTimes = AstronomicalCalculator.calculateMoonTimes(now, latitude, longitude);
      const zodiacPosition = AstronomicalCalculator.calculateZodiacPosition(now);
      const moonPosition = AstronomicalCalculator.calculateMoonPosition(now, latitude, longitude);
      const tidalData = AstronomicalCalculator.calculateTidalData(now, latitude, longitude);
      
      const response = {
        phase: moonPhase.phase,
        illumination: Math.round(moonPhase.illumination * 100),
        age: Math.round(moonPhase.age * 10) / 10,
        distance: Math.round(distance),
        angularDiameter: Math.round((384400 / distance) * 0.5181 * 100) / 100,
        moonrise: moonTimes.moonrise,
        moonset: moonTimes.moonset,
        zodiac: {
          sign: zodiacPosition.sign,
          degree: Math.round(zodiacPosition.degree * 10) / 10,
          nextTransition: zodiacPosition.nextTransition
        },
        position: moonPosition,
        tides: tidalData,
        astrologyInsight: AstronomicalCalculator.getAstrologyInsight(moonPhase.phase, zodiacPosition.sign),
        wellnessTip: AstronomicalCalculator.getWellnessTip(moonPhase.phase)
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error calculating moon data:', error);
      res.status(500).json({ error: 'Failed to calculate moon data' });
    }
  });

  // Get moon data for specific date
  app.get("/api/moon/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const { lat, lng } = req.query;
      const latitude = lat ? parseFloat(lat as string) : 40.7128;
      const longitude = lng ? parseFloat(lng as string) : -74.0060;
      
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      
      const moonPhase = AstronomicalCalculator.calculateMoonPhase(targetDate);
      const distance = AstronomicalCalculator.calculateMoonDistance(targetDate);
      const moonTimes = AstronomicalCalculator.calculateMoonTimes(targetDate, latitude, longitude);
      const zodiacPosition = AstronomicalCalculator.calculateZodiacPosition(targetDate);
      
      const response = {
        date: targetDate.toISOString(),
        phase: moonPhase.phase,
        illumination: Math.round(moonPhase.illumination * 100),
        age: Math.round(moonPhase.age * 10) / 10,
        distance: Math.round(distance),
        moonrise: moonTimes.moonrise,
        moonset: moonTimes.moonset,
        zodiac: {
          sign: zodiacPosition.sign,
          degree: Math.round(zodiacPosition.degree * 10) / 10
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error calculating moon data for date:', error);
      res.status(500).json({ error: 'Failed to calculate moon data for date' });
    }
  });

  // Get lunar calendar for month
  app.get("/api/calendar/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ error: 'Invalid year or month' });
      }
      
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      const calendar = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yearNum, monthNum - 1, day);
        const moonPhase = AstronomicalCalculator.calculateMoonPhase(date);
        
        calendar.push({
          date: date.toISOString().split('T')[0],
          day,
          phase: moonPhase.phase,
          illumination: Math.round(moonPhase.illumination * 100),
          age: Math.round(moonPhase.age * 10) / 10
        });
      }
      
      res.json({
        year: yearNum,
        month: monthNum,
        days: calendar
      });
    } catch (error) {
      console.error('Error generating calendar:', error);
      res.status(500).json({ error: 'Failed to generate calendar' });
    }
  });

  // Validate location coordinates
  app.post("/api/location/validate", async (req, res) => {
    try {
      const location = LocationSchema.parse(req.body);
      
      // In a real app, you might want to reverse geocode to get location name
      res.json({
        valid: true,
        latitude: location.latitude,
        longitude: location.longitude
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid location coordinates',
          details: error.errors 
        });
      }
      res.status(500).json({ error: 'Failed to validate location' });
    }
  });

  // Update notification settings
  app.post("/api/notifications/settings", async (req, res) => {
    try {
      // For demo purposes, using a default user ID. In production, get from auth session
      const userId = 1;
      
      const settingsData = {
        userId,
        notifications: req.body.notifications ?? true,
        newMoonAlerts: req.body.newMoonAlerts ?? true,
        fullMoonAlerts: req.body.fullMoonAlerts ?? true,
        quarterMoonAlerts: req.body.quarterMoonAlerts ?? true,
        notificationTime: req.body.notificationTime || "09:00",
        dailyInsights: req.body.dailyInsights ?? true,
        phaseAlerts: req.body.phaseAlerts ?? true,
        wellnessTips: req.body.wellnessTips ?? true
      };

      let settings = await storage.getUserSettings(userId);
      
      if (settings) {
        settings = await storage.updateUserSettings(userId, settingsData);
      } else {
        settings = await storage.createUserSettings(settingsData);
      }

      // Schedule notifications for the updated preferences
      if (settings.notifications) {
        await NotificationService.scheduleUpcomingNotifications(userId);
      }

      res.json({
        success: true,
        settings,
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      res.status(500).json({ error: 'Failed to update notification settings' });
    }
  });

  // Get notification settings
  app.get("/api/notifications/settings", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        // Return default settings
        return res.json({
          notifications: true,
          newMoonAlerts: true,
          fullMoonAlerts: true,
          quarterMoonAlerts: true,
          notificationTime: "09:00",
          dailyInsights: true,
          phaseAlerts: true,
          wellnessTips: true
        });
      }

      res.json(settings);
    } catch (error) {
      console.error('Error getting notification settings:', error);
      res.status(500).json({ error: 'Failed to get notification settings' });
    }
  });

  // Get upcoming notifications
  app.get("/api/notifications/upcoming", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const notifications = await storage.getUserNotifications(userId);
      
      // Filter for future notifications only
      const now = new Date();
      const upcomingNotifications = notifications
        .filter(n => n.phaseDate > now && !n.sent)
        .sort((a, b) => a.phaseDate.getTime() - b.phaseDate.getTime())
        .slice(0, 10); // Return next 10 notifications

      const formattedNotifications = upcomingNotifications.map(n => ({
        id: n.id,
        phaseType: n.phaseType,
        phaseDate: n.phaseDate.toISOString(),
        notificationDate: n.notificationDate.toISOString(),
        message: NotificationService.getNotificationMessage(n.phaseType)
      }));

      res.json(formattedNotifications);
    } catch (error) {
      console.error('Error getting upcoming notifications:', error);
      res.status(500).json({ error: 'Failed to get upcoming notifications' });
    }
  });

  // Trigger notification scheduling (admin/demo endpoint)
  app.post("/api/notifications/schedule", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      await NotificationService.scheduleUpcomingNotifications(userId);
      
      res.json({
        success: true,
        message: 'Notifications scheduled successfully'
      });
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      res.status(500).json({ error: 'Failed to schedule notifications' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

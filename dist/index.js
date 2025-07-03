// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  moonPhases;
  zodiacPositions;
  userSettings;
  notifications;
  currentId;
  currentMoonPhaseId;
  currentZodiacId;
  currentSettingsId;
  currentNotificationId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.moonPhases = /* @__PURE__ */ new Map();
    this.zodiacPositions = /* @__PURE__ */ new Map();
    this.userSettings = /* @__PURE__ */ new Map();
    this.notifications = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.currentMoonPhaseId = 1;
    this.currentZodiacId = 1;
    this.currentSettingsId = 1;
    this.currentNotificationId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      notifications: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getMoonPhase(date) {
    const dateKey = date.toDateString();
    return this.moonPhases.get(dateKey);
  }
  async createMoonPhase(insertMoonPhase) {
    const id = this.currentMoonPhaseId++;
    const moonPhase = { ...insertMoonPhase, id };
    const dateKey = insertMoonPhase.date.toDateString();
    this.moonPhases.set(dateKey, moonPhase);
    return moonPhase;
  }
  async getZodiacPosition(date) {
    const dateKey = date.toDateString();
    return this.zodiacPositions.get(dateKey);
  }
  async createZodiacPosition(insertPosition) {
    const id = this.currentZodiacId++;
    const position = { ...insertPosition, id };
    const dateKey = insertPosition.date.toDateString();
    this.zodiacPositions.set(dateKey, position);
    return position;
  }
  async getUserSettings(userId) {
    return this.userSettings.get(userId);
  }
  async createUserSettings(insertSettings) {
    const id = this.currentSettingsId++;
    const settings = { ...insertSettings, id };
    if (insertSettings.userId) {
      this.userSettings.set(insertSettings.userId, settings);
    }
    return settings;
  }
  async updateUserSettings(userId, updateSettings) {
    const existing = this.userSettings.get(userId);
    if (!existing) {
      throw new Error("User settings not found");
    }
    const updated = { ...existing, ...updateSettings };
    this.userSettings.set(userId, updated);
    return updated;
  }
  async createMoonPhaseNotification(insertNotification) {
    const id = this.currentNotificationId++;
    const notification = {
      ...insertNotification,
      id,
      sent: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }
  async getPendingNotifications() {
    const now = /* @__PURE__ */ new Date();
    return Array.from(this.notifications.values()).filter(
      (notification) => !notification.sent && notification.notificationDate <= now
    );
  }
  async markNotificationSent(notificationId) {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.sent = true;
      this.notifications.set(notificationId, notification);
    }
  }
  async getUserNotifications(userId) {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }
};
var storage = new MemStorage();

// server/services/astronomicalCalculations.ts
var AstronomicalCalculator = class {
  static LUNAR_CYCLE = 29.530588853;
  // Average lunar cycle in days
  static NEW_MOON_REFERENCE = /* @__PURE__ */ new Date("2000-01-06T18:14:00Z");
  // Known new moon date
  static calculateMoonPhase(date) {
    const daysSinceNew = (date.getTime() - this.NEW_MOON_REFERENCE.getTime()) / (1e3 * 60 * 60 * 24);
    const cyclePosition = daysSinceNew % this.LUNAR_CYCLE / this.LUNAR_CYCLE;
    const age = daysSinceNew % this.LUNAR_CYCLE;
    let phase;
    let illumination;
    if (cyclePosition < 0.0625) {
      phase = "New Moon";
      illumination = cyclePosition * 8;
    } else if (cyclePosition < 0.1875) {
      phase = "Waxing Crescent";
      illumination = (cyclePosition - 0.0625) * 8 + 0.5;
    } else if (cyclePosition < 0.3125) {
      phase = "First Quarter";
      illumination = (cyclePosition - 0.1875) * 4 + 0.4;
    } else if (cyclePosition < 0.4375) {
      phase = "Waxing Gibbous";
      illumination = (cyclePosition - 0.3125) * 4 + 0.6;
    } else if (cyclePosition < 0.5625) {
      phase = "Full Moon";
      illumination = 1 - (cyclePosition - 0.4375) * 4;
    } else if (cyclePosition < 0.6875) {
      phase = "Waning Gibbous";
      illumination = 0.8 - (cyclePosition - 0.5625) * 4;
    } else if (cyclePosition < 0.8125) {
      phase = "Last Quarter";
      illumination = 0.6 - (cyclePosition - 0.6875) * 4;
    } else {
      phase = "Waning Crescent";
      illumination = 0.4 - (cyclePosition - 0.8125) * 8;
    }
    return { phase, illumination: Math.max(0, Math.min(1, illumination)), age };
  }
  static calculateMoonDistance(date) {
    const daysSinceEpoch = (date.getTime() - (/* @__PURE__ */ new Date("2000-01-01")).getTime()) / (1e3 * 60 * 60 * 24);
    const meanAnomaly = daysSinceEpoch * 0.98560028 * Math.PI / 180;
    const baseDistance = 384400;
    const variation = 21500 * Math.sin(meanAnomaly);
    return baseDistance + variation;
  }
  static calculateMoonTimes(date, latitude, longitude) {
    const julianDay = this.getJulianDay(date);
    const moonAge = this.calculateMoonPhase(date).age;
    const timeOffset = longitude / 15;
    const phaseOffset = moonAge / this.LUNAR_CYCLE * 24;
    const riseHour = (18 + timeOffset + phaseOffset) % 24;
    const setHour = (6 + timeOffset + phaseOffset) % 24;
    const moonrise = this.formatTime(riseHour);
    const moonset = this.formatTime(setHour);
    return { moonrise, moonset };
  }
  static calculateZodiacPosition(date) {
    const zodiacSigns = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces"
    ];
    const daysSinceEpoch = (date.getTime() - (/* @__PURE__ */ new Date("2000-01-01")).getTime()) / (1e3 * 60 * 60 * 24);
    const lunarPosition = daysSinceEpoch * 13.176396 % 360;
    const signIndex = Math.floor(lunarPosition / 30);
    const degree = lunarPosition % 30;
    const sign = zodiacSigns[signIndex];
    const daysToNextSign = (30 - degree) / 13.176396;
    const nextTransitionDate = new Date(date.getTime() + daysToNextSign * 24 * 60 * 60 * 1e3);
    return {
      sign,
      degree,
      nextTransition: nextTransitionDate.toLocaleDateString()
    };
  }
  static calculateMoonPosition(date, latitude, longitude) {
    const daysSinceEpoch = (date.getTime() - (/* @__PURE__ */ new Date("2000-01-01")).getTime()) / (1e3 * 60 * 60 * 24);
    const meanLongitude = (218.3164477 + 481267.88123421 * (daysSinceEpoch / 36525)) % 360;
    const ra = meanLongitude / 15;
    const dec = Math.sin(meanLongitude * Math.PI / 180) * 23.45;
    const hourAngle = date.getHours() + date.getMinutes() / 60 - ra;
    const alt = Math.asin(
      Math.sin(dec * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) + Math.cos(dec * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * Math.cos(hourAngle * 15 * Math.PI / 180)
    ) * 180 / Math.PI;
    const azimuth = Math.atan2(
      Math.sin(hourAngle * 15 * Math.PI / 180),
      Math.cos(hourAngle * 15 * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) - Math.tan(dec * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    ) * 180 / Math.PI;
    return {
      rightAscension: this.formatRA(ra),
      declination: this.formatDec(dec),
      altitude: Math.max(0, alt),
      azimuth: (azimuth + 360) % 360
    };
  }
  static calculateTidalData(date, latitude, longitude) {
    const moonPhase = this.calculateMoonPhase(date);
    const baseHigh = 12 + moonPhase.age / this.LUNAR_CYCLE * 12;
    const baseLow = baseHigh + 6;
    return {
      highTide: this.formatTime(baseHigh % 24),
      lowTide: this.formatTime(baseLow % 24),
      tidalRange: 2.3 + (1 - moonPhase.illumination) * 0.5
      // Higher range during new/full moon
    };
  }
  static getJulianDay(date) {
    return date.getTime() / 864e5 + 24405875e-1;
  }
  static formatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
  }
  static formatRA(hours) {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  }
  static formatDec(degrees) {
    const sign = degrees >= 0 ? "+" : "-";
    const deg = Math.floor(Math.abs(degrees));
    const min = Math.floor((Math.abs(degrees) - deg) * 60);
    return `${sign}${deg}\xB0 ${min}'`;
  }
  static getAstrologyInsight(phase, zodiacSign) {
    const insights = {
      "New Moon": {
        "Aries": "A powerful time for new beginnings and taking initiative. Channel your pioneering spirit into fresh ventures.",
        "Taurus": "Focus on stability and material foundations. This is perfect timing for financial planning and grounding practices.",
        "Gemini": "Communication and learning take center stage. Start new educational pursuits or important conversations.",
        "Cancer": "Emotional renewal and family connections are highlighted. Create nurturing spaces in your life.",
        "Leo": "Creative expression and self-confidence bloom. Begin artistic projects or leadership roles.",
        "Virgo": "Organization and health improvements are favored. Start new wellness routines or decluttering projects.",
        "Libra": "Relationships and balance are the focus. Initiate partnerships or restore harmony in your life.",
        "Scorpio": "Deep transformation and renewal are possible. Embrace change and release what no longer serves.",
        "Sagittarius": "Adventure and philosophical growth call to you. Begin journeys of discovery and learning.",
        "Capricorn": "Career advancement and goal-setting are highlighted. Structure your ambitions for success.",
        "Aquarius": "Innovation and humanitarian efforts take precedence. Start projects that benefit the collective.",
        "Pisces": "Spiritual growth and intuitive development are enhanced. Trust your inner wisdom and creativity."
      },
      "Full Moon": {
        "Aries": "Peak energy for leadership and bold action. Your courage and initiative reach their zenith.",
        "Taurus": "Abundance and material manifestation are at their strongest. Celebrate your achievements and stability.",
        "Gemini": "Communication reaches its peak clarity. Important messages and connections come to fruition.",
        "Cancer": "Emotional fulfillment and family bonds are deeply felt. Nurturing reaches its most powerful expression.",
        "Leo": "Creative brilliance and recognition shine brightest. Your unique talents demand the spotlight.",
        "Virgo": "Perfection and service find their highest expression. Your attention to detail yields remarkable results.",
        "Libra": "Relationships reach perfect harmony or clear resolution. Balance and beauty are prominently featured.",
        "Scorpio": "Transformation completes its powerful cycle. Deep truths and hidden knowledge are revealed.",
        "Sagittarius": "Wisdom and adventure reach their peak. Your philosophical insights guide others on their paths.",
        "Capricorn": "Achievement and authority are fully realized. Your hard work manifests in tangible success.",
        "Aquarius": "Innovation and group consciousness reach their heights. Revolutionary ideas benefit humanity.",
        "Pisces": "Spiritual connection and intuitive gifts reach their fullest expression. Dreams and reality merge beautifully."
      }
    };
    const phaseInsights = insights[phase] || insights["New Moon"];
    return phaseInsights[zodiacSign] || phaseInsights["Aries"];
  }
  static getWellnessTip(phase) {
    const tips = {
      "New Moon": "Practice intention-setting meditation and gentle yoga. This is ideal for starting new wellness routines and setting health goals.",
      "Waxing Crescent": "Build momentum with consistent exercise and hydration. Focus on establishing healthy habits that will grow with the moon.",
      "First Quarter": "Channel the moon's building energy into strength training and active pursuits. Push through challenges with determination.",
      "Waxing Gibbous": "Refine your wellness practices and prepare for peak energy. Focus on nutrition optimization and stress management.",
      "Full Moon": "Embrace high-energy activities but balance with restorative practices. Meditation and breathwork help channel intense energy.",
      "Waning Gibbous": "Practice gratitude and gentle release. Detox practices and cleansing routines are particularly beneficial now.",
      "Last Quarter": "Focus on letting go of unhealthy habits. This is perfect for breaking patterns and clearing emotional blockages.",
      "Waning Crescent": "Rest, restore, and prepare for renewal. Prioritize sleep, gentle stretching, and contemplative practices."
    };
    return tips[phase] || tips["New Moon"];
  }
};

// server/services/notificationService.ts
var NotificationService = class {
  static KEY_PHASES = ["New Moon", "First Quarter", "Full Moon", "Last Quarter"];
  static async scheduleUpcomingNotifications(userId) {
    const userSettings = await storage.getUserSettings(userId);
    if (!userSettings || !userSettings.notifications) {
      return;
    }
    const existingNotifications = await storage.getUserNotifications(userId);
    const now = /* @__PURE__ */ new Date();
    const notifications = [];
    for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + dayOffset);
      const moonData = AstronomicalCalculator.calculateMoonPhase(checkDate);
      if (this.KEY_PHASES.includes(moonData.phase)) {
        const shouldNotify = this.shouldNotifyForPhase(moonData.phase, userSettings);
        if (shouldNotify) {
          const notificationDateTime = new Date(checkDate);
          const [hours, minutes] = (userSettings.notificationTime || "09:00").split(":");
          notificationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          const existingForThisPhase = existingNotifications.find(
            (n) => n.phaseType === moonData.phase && n.phaseDate.toDateString() === checkDate.toDateString()
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
    for (const notification of notifications) {
      await storage.createMoonPhaseNotification(notification);
    }
  }
  static shouldNotifyForPhase(phase, userSettings) {
    switch (phase) {
      case "New Moon":
        return userSettings.newMoonAlerts !== false;
      case "Full Moon":
        return userSettings.fullMoonAlerts !== false;
      case "First Quarter":
      case "Last Quarter":
        return userSettings.quarterMoonAlerts !== false;
      default:
        return false;
    }
  }
  static async processPendingNotifications() {
    const pendingNotifications = await storage.getPendingNotifications();
    for (const notification of pendingNotifications) {
      try {
        await this.sendNotification(notification);
        await storage.markNotificationSent(notification.id);
      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    }
  }
  static async sendNotification(notification) {
    console.log(`\u{1F319} Notification: ${notification.phaseType} occurring on ${notification.phaseDate.toLocaleDateString()}`);
  }
  static getNotificationMessage(phaseType) {
    const messages = {
      "New Moon": {
        title: "\u{1F311} New Moon Tonight",
        body: "Perfect time for new beginnings and setting intentions. The moon's energy supports fresh starts and manifestation."
      },
      "Full Moon": {
        title: "\u{1F315} Full Moon Tonight",
        body: "Peak lunar energy! Time for culmination, celebration, and releasing what no longer serves you."
      },
      "First Quarter": {
        title: "\u{1F313} First Quarter Moon",
        body: "Decision time! The moon's building energy supports taking action on your goals and pushing through challenges."
      },
      "Last Quarter": {
        title: "\u{1F317} Last Quarter Moon",
        body: "Time for reflection and release. Let go of what isn't working and prepare for the new cycle ahead."
      }
    };
    return messages[phaseType] || {
      title: "\u{1F319} Moon Phase Update",
      body: `The moon is in ${phaseType} phase today.`
    };
  }
};

// server/routes.ts
import { z } from "zod";
var LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});
async function registerRoutes(app2) {
  app2.get("/api/moon/current", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      const latitude = lat ? parseFloat(lat) : 40.7128;
      const longitude = lng ? parseFloat(lng) : -74.006;
      const now = /* @__PURE__ */ new Date();
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
        angularDiameter: Math.round(384400 / distance * 0.5181 * 100) / 100,
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
      console.error("Error calculating moon data:", error);
      res.status(500).json({ error: "Failed to calculate moon data" });
    }
  });
  app2.get("/api/moon/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const { lat, lng } = req.query;
      const latitude = lat ? parseFloat(lat) : 40.7128;
      const longitude = lng ? parseFloat(lng) : -74.006;
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
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
      console.error("Error calculating moon data for date:", error);
      res.status(500).json({ error: "Failed to calculate moon data for date" });
    }
  });
  app2.get("/api/calendar/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ error: "Invalid year or month" });
      }
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      const calendar = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yearNum, monthNum - 1, day);
        const moonPhase = AstronomicalCalculator.calculateMoonPhase(date);
        calendar.push({
          date: date.toISOString().split("T")[0],
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
      console.error("Error generating calendar:", error);
      res.status(500).json({ error: "Failed to generate calendar" });
    }
  });
  app2.post("/api/location/validate", async (req, res) => {
    try {
      const location = LocationSchema.parse(req.body);
      res.json({
        valid: true,
        latitude: location.latitude,
        longitude: location.longitude
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid location coordinates",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to validate location" });
    }
  });
  app2.post("/api/notifications/settings", async (req, res) => {
    try {
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
      if (settings.notifications) {
        await NotificationService.scheduleUpcomingNotifications(userId);
      }
      res.json({
        success: true,
        settings,
        message: "Notification settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ error: "Failed to update notification settings" });
    }
  });
  app2.get("/api/notifications/settings", async (req, res) => {
    try {
      const userId = 1;
      const settings = await storage.getUserSettings(userId);
      if (!settings) {
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
      console.error("Error getting notification settings:", error);
      res.status(500).json({ error: "Failed to get notification settings" });
    }
  });
  app2.get("/api/notifications/upcoming", async (req, res) => {
    try {
      const userId = 1;
      const notifications = await storage.getUserNotifications(userId);
      const now = /* @__PURE__ */ new Date();
      const upcomingNotifications = notifications.filter((n) => n.phaseDate > now && !n.sent).sort((a, b) => a.phaseDate.getTime() - b.phaseDate.getTime()).slice(0, 10);
      const formattedNotifications = upcomingNotifications.map((n) => ({
        id: n.id,
        phaseType: n.phaseType,
        phaseDate: n.phaseDate.toISOString(),
        notificationDate: n.notificationDate.toISOString(),
        message: NotificationService.getNotificationMessage(n.phaseType)
      }));
      res.json(formattedNotifications);
    } catch (error) {
      console.error("Error getting upcoming notifications:", error);
      res.status(500).json({ error: "Failed to get upcoming notifications" });
    }
  });
  app2.post("/api/notifications/schedule", async (req, res) => {
    try {
      const userId = 1;
      await NotificationService.scheduleUpcomingNotifications(userId);
      res.json({
        success: true,
        message: "Notifications scheduled successfully"
      });
    } catch (error) {
      console.error("Error scheduling notifications:", error);
      res.status(500).json({ error: "Failed to schedule notifications" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

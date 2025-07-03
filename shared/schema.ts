import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  location: text("location"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  timezone: text("timezone"),
  notifications: boolean("notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moonPhases = pgTable("moon_phases", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  phaseName: text("phase_name").notNull(),
  illumination: real("illumination").notNull(),
  age: real("age").notNull(),
  distance: real("distance").notNull(),
  angularDiameter: real("angular_diameter").notNull(),
});

export const zodiacPositions = pgTable("zodiac_positions", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  sign: text("sign").notNull(),
  degree: real("degree").notNull(),
  nextTransition: timestamp("next_transition"),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  notifications: boolean("notifications").default(true),
  dailyInsights: boolean("daily_insights").default(true),
  phaseAlerts: boolean("phase_alerts").default(true),
  wellnessTips: boolean("wellness_tips").default(true),
  newMoonAlerts: boolean("new_moon_alerts").default(true),
  fullMoonAlerts: boolean("full_moon_alerts").default(true),
  quarterMoonAlerts: boolean("quarter_moon_alerts").default(true),
  notificationTime: text("notification_time").default("09:00"), // HH:MM format
});

export const moonPhaseNotifications = pgTable("moon_phase_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  phaseType: text("phase_type").notNull(), // "New Moon", "Full Moon", "First Quarter", "Last Quarter"
  phaseDate: timestamp("phase_date").notNull(),
  notificationDate: timestamp("notification_date").notNull(),
  sent: boolean("sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  location: true,
  latitude: true,
  longitude: true,
  timezone: true,
});

export const insertMoonPhaseSchema = createInsertSchema(moonPhases);
export const insertZodiacPositionSchema = createInsertSchema(zodiacPositions);
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });
export const insertMoonPhaseNotificationSchema = createInsertSchema(moonPhaseNotifications).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MoonPhase = typeof moonPhases.$inferSelect;
export type ZodiacPosition = typeof zodiacPositions.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type MoonPhaseNotification = typeof moonPhaseNotifications.$inferSelect;
export type InsertMoonPhase = z.infer<typeof insertMoonPhaseSchema>;
export type InsertZodiacPosition = z.infer<typeof insertZodiacPositionSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertMoonPhaseNotification = z.infer<typeof insertMoonPhaseNotificationSchema>;

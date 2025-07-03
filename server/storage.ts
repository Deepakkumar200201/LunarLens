import { users, moonPhases, zodiacPositions, userSettings, moonPhaseNotifications, type User, type InsertUser, type MoonPhase, type InsertMoonPhase, type ZodiacPosition, type InsertZodiacPosition, type UserSettings, type InsertUserSettings, type MoonPhaseNotification, type InsertMoonPhaseNotification } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMoonPhase(date: Date): Promise<MoonPhase | undefined>;
  createMoonPhase(moonPhase: InsertMoonPhase): Promise<MoonPhase>;
  getZodiacPosition(date: Date): Promise<ZodiacPosition | undefined>;
  createZodiacPosition(position: InsertZodiacPosition): Promise<ZodiacPosition>;
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings>;
  createMoonPhaseNotification(notification: InsertMoonPhaseNotification): Promise<MoonPhaseNotification>;
  getPendingNotifications(): Promise<MoonPhaseNotification[]>;
  markNotificationSent(notificationId: number): Promise<void>;
  getUserNotifications(userId: number): Promise<MoonPhaseNotification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moonPhases: Map<string, MoonPhase>;
  private zodiacPositions: Map<string, ZodiacPosition>;
  private userSettings: Map<number, UserSettings>;
  private notifications: Map<number, MoonPhaseNotification>;
  private currentId: number;
  private currentMoonPhaseId: number;
  private currentZodiacId: number;
  private currentSettingsId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.moonPhases = new Map();
    this.zodiacPositions = new Map();
    this.userSettings = new Map();
    this.notifications = new Map();
    this.currentId = 1;
    this.currentMoonPhaseId = 1;
    this.currentZodiacId = 1;
    this.currentSettingsId = 1;
    this.currentNotificationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      notifications: true,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getMoonPhase(date: Date): Promise<MoonPhase | undefined> {
    const dateKey = date.toDateString();
    return this.moonPhases.get(dateKey);
  }

  async createMoonPhase(insertMoonPhase: InsertMoonPhase): Promise<MoonPhase> {
    const id = this.currentMoonPhaseId++;
    const moonPhase: MoonPhase = { ...insertMoonPhase, id };
    const dateKey = insertMoonPhase.date.toDateString();
    this.moonPhases.set(dateKey, moonPhase);
    return moonPhase;
  }

  async getZodiacPosition(date: Date): Promise<ZodiacPosition | undefined> {
    const dateKey = date.toDateString();
    return this.zodiacPositions.get(dateKey);
  }

  async createZodiacPosition(insertPosition: InsertZodiacPosition): Promise<ZodiacPosition> {
    const id = this.currentZodiacId++;
    const position: ZodiacPosition = { ...insertPosition, id };
    const dateKey = insertPosition.date.toDateString();
    this.zodiacPositions.set(dateKey, position);
    return position;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentSettingsId++;
    const settings: UserSettings = { ...insertSettings, id };
    if (insertSettings.userId) {
      this.userSettings.set(insertSettings.userId, settings);
    }
    return settings;
  }

  async updateUserSettings(userId: number, updateSettings: Partial<UserSettings>): Promise<UserSettings> {
    const existing = this.userSettings.get(userId);
    if (!existing) {
      throw new Error('User settings not found');
    }
    const updated = { ...existing, ...updateSettings };
    this.userSettings.set(userId, updated);
    return updated;
  }

  async createMoonPhaseNotification(insertNotification: InsertMoonPhaseNotification): Promise<MoonPhaseNotification> {
    const id = this.currentNotificationId++;
    const notification: MoonPhaseNotification = { 
      ...insertNotification, 
      id,
      sent: false,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getPendingNotifications(): Promise<MoonPhaseNotification[]> {
    const now = new Date();
    return Array.from(this.notifications.values()).filter(
      notification => !notification.sent && notification.notificationDate <= now
    );
  }

  async markNotificationSent(notificationId: number): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.sent = true;
      this.notifications.set(notificationId, notification);
    }
  }

  async getUserNotifications(userId: number): Promise<MoonPhaseNotification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.userId === userId
    );
  }
}

export const storage = new MemStorage();

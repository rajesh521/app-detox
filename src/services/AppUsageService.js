import { AppState } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import storageService from './StorageService';
import timerService from './TimerService';
import notificationService from './NotificationService';

const BACKGROUND_FETCH_TASK = 'background-fetch-usage';

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Background fetch: monitoring app usage');
    // Update usage data in background
    const service = new AppUsageService();
    await service.updateBackgroundUsage();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

class AppUsageService {
  constructor() {
    this.isTracking = false;
    this.currentApp = null;
    this.sessionStartTime = null;
    this.appStateSubscription = null;
    this.trackingInterval = null;
    this.backgroundTaskRegistered = false;
  }

  // Start tracking app usage
  async startTracking() {
    if (this.isTracking) return;

    this.isTracking = true;
    this.sessionStartTime = Date.now();

    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    // Track usage every 30 seconds
    this.trackingInterval = setInterval(() => {
      this.updateCurrentSession();
    }, 30000);

    // Register background fetch task
    await this.registerBackgroundTask();

    console.log('App usage tracking started');
  }

  // Stop tracking app usage
  stopTracking() {
    if (!this.isTracking) return;

    this.isTracking = false;
    
    // Save current session before stopping
    if (this.currentApp && this.sessionStartTime) {
      this.saveSession(this.currentApp, Date.now() - this.sessionStartTime);
    }

    // Clean up listeners
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.currentApp = null;
    this.sessionStartTime = null;

    console.log('App usage tracking stopped');
  }

  // Handle app state changes
  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      // App became active
      this.sessionStartTime = Date.now();
      this.currentApp = 'brain-detox'; // Our app
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background
      if (this.currentApp && this.sessionStartTime) {
        const sessionTime = Date.now() - this.sessionStartTime;
        this.saveSession(this.currentApp, sessionTime);
      }
      this.currentApp = null;
      this.sessionStartTime = null;
    }
  }

  // Update current session
  updateCurrentSession() {
    if (this.currentApp && this.sessionStartTime) {
      const sessionTime = Date.now() - this.sessionStartTime;
      this.saveSession(this.currentApp, sessionTime);
      this.sessionStartTime = Date.now(); // Reset start time
    }
  }

  // Save session data
  async saveSession(appId, timeSpent) {
    try {
      await storageService.updateAppUsage(appId, timeSpent);
      console.log(`Saved session: ${appId} - ${timerService.formatTimeHuman(timeSpent)}`);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Get today's usage for a specific app
  async getTodayUsage(appId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyUsage = await storageService.getDailyUsage(today);
      return dailyUsage[appId] || { timeSpent: 0, sessions: 0 };
    } catch (error) {
      console.error('Error getting today usage:', error);
      return { timeSpent: 0, sessions: 0 };
    }
  }

  // Get usage for a specific date
  async getUsageForDate(date, appId = null) {
    try {
      const dailyUsage = await storageService.getDailyUsage(date);
      if (appId) {
        return dailyUsage[appId] || { timeSpent: 0, sessions: 0 };
      }
      return dailyUsage;
    } catch (error) {
      console.error('Error getting usage for date:', error);
      return appId ? { timeSpent: 0, sessions: 0 } : {};
    }
  }

  // Get usage statistics for the last N days
  async getUsageStats(days = 7) {
    try {
      const stats = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dailyUsage = await storageService.getDailyUsage(dateString);
        const totalTime = Object.values(dailyUsage).reduce((sum, app) => sum + app.timeSpent, 0);
        const totalSessions = Object.values(dailyUsage).reduce((sum, app) => sum + app.sessions, 0);

        stats.push({
          date: dateString,
          totalTime,
          totalSessions,
          apps: dailyUsage,
        });
      }

      return stats.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return [];
    }
  }

  // Calculate weekly average
  async getWeeklyAverage() {
    try {
      const stats = await this.getUsageStats(7);
      const totalTime = stats.reduce((sum, day) => sum + day.totalTime, 0);
      const totalSessions = stats.reduce((sum, day) => sum + day.totalSessions, 0);
      
      return {
        averageTime: totalTime / 7,
        averageSessions: totalSessions / 7,
        totalTime,
        totalSessions,
      };
    } catch (error) {
      console.error('Error calculating weekly average:', error);
      return { averageTime: 0, averageSessions: 0, totalTime: 0, totalSessions: 0 };
    }
  }

  // Get most used apps
  async getMostUsedApps(days = 7, limit = 5) {
    try {
      const stats = await this.getUsageStats(days);
      const appTotals = {};

      stats.forEach(day => {
        Object.entries(day.apps).forEach(([appId, usage]) => {
          if (!appTotals[appId]) {
            appTotals[appId] = { timeSpent: 0, sessions: 0 };
          }
          appTotals[appId].timeSpent += usage.timeSpent;
          appTotals[appId].sessions += usage.sessions;
        });
      });

      return Object.entries(appTotals)
        .map(([appId, usage]) => ({ appId, ...usage }))
        .sort((a, b) => b.timeSpent - a.timeSpent)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting most used apps:', error);
      return [];
    }
  }
}

export const appUsageService = new AppUsageService();
export default appUsageService;

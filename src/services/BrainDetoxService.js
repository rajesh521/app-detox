import storageService from './StorageService';
import timerService from './TimerService';
import appUsageService from './AppUsageService';
import limitChecker from './LimitChecker';
import notificationService from './NotificationService';

class BrainDetoxService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize all services
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Brain Detox services...');

      // Initialize notification service
      await notificationService.initialize();
      notificationService.setupNotificationListeners();

      // Load app limits
      await limitChecker.loadAppLimits();

      // Start usage tracking
      appUsageService.startTracking();

      // Schedule daily motivation
      await notificationService.scheduleDailyMotivation();

      this.isInitialized = true;
      console.log('Brain Detox services initialized successfully');
    } catch (error) {
      console.error('Error initializing Brain Detox services:', error);
    }
  }

  // Shutdown all services
  async shutdown() {
    try {
      console.log('Shutting down Brain Detox services...');

      // Stop usage tracking
      appUsageService.stopTracking();

      // Stop all timers
      timerService.stopAllTimers();

      // Cancel all notifications
      await notificationService.cancelAllNotifications();

      this.isInitialized = false;
      console.log('Brain Detox services shut down successfully');
    } catch (error) {
      console.error('Error shutting down Brain Detox services:', error);
    }
  }

  // Set app limit and configure notifications
  async setAppLimit(appId, timeLimit) {
    try {
      await limitChecker.setAppLimit(appId, timeLimit);
      
      // Schedule a warning notification at 80% of the limit
      const warningTime = timeLimit * 0.8;
      const remainingTime = timeLimit - warningTime;
      
      await notificationService.scheduleLimitWarning(appId, remainingTime);
      
      console.log(`Set limit for ${appId}: ${timerService.formatTimeHuman(timeLimit)}`);
    } catch (error) {
      console.error('Error setting app limit:', error);
    }
  }

  // Check if app limit is exceeded and handle accordingly
  async checkAndHandleLimit(appId) {
    try {
      const isExceeded = await limitChecker.checkLimit(appId);
      
      if (isExceeded) {
        // Schedule time up notification
        await notificationService.scheduleTimeUpNotification(appId);
        
        // You might want to trigger a puzzle or break screen here
        console.log(`Time limit exceeded for ${appId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking app limit:', error);
      return false;
    }
  }

  // Get comprehensive usage stats
  async getUsageStats() {
    try {
      const weeklyStats = await appUsageService.getUsageStats(7);
      const weeklyAverage = await appUsageService.getWeeklyAverage();
      const mostUsedApps = await appUsageService.getMostUsedApps(7, 5);
      const appLimits = await limitChecker.getAppLimits();

      return {
        weeklyStats,
        weeklyAverage,
        mostUsedApps,
        appLimits,
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return null;
    }
  }

  // Start a focused session with timer
  async startFocusSession(duration, appId = 'focus-session') {
    try {
      const sessionId = `focus-${Date.now()}`;
      
      timerService.startTimer(
        sessionId,
        duration,
        (remainingTime) => {
          console.log(`Focus session remaining: ${timerService.formatTime(remainingTime)}`);
        },
        async () => {
          console.log('Focus session completed!');
          await notificationService.scheduleAchievementNotification(
            'Focus Session Complete!',
            `Great job! You completed a ${timerService.formatTimeHuman(duration)} focus session.`
          );
        }
      );

      return sessionId;
    } catch (error) {
      console.error('Error starting focus session:', error);
      return null;
    }
  }

  // Schedule break reminder
  async scheduleBreakReminder(minutes = 30) {
    try {
      await notificationService.scheduleBreakReminder(minutes);
      console.log(`Break reminder scheduled for ${minutes} minutes`);
    } catch (error) {
      console.error('Error scheduling break reminder:', error);
    }
  }

  // Get today's summary
  async getTodaySummary() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyUsage = await appUsageService.getUsageForDate(today);
      
      const totalTime = Object.values(dailyUsage).reduce((sum, app) => sum + app.timeSpent, 0);
      const totalSessions = Object.values(dailyUsage).reduce((sum, app) => sum + app.sessions, 0);
      const activeTimers = timerService.getActiveTimers();
      const scheduledNotifications = await notificationService.getScheduledNotifications();

      return {
        date: today,
        totalTime,
        totalSessions,
        appUsage: dailyUsage,
        activeTimers: activeTimers.length,
        pendingNotifications: scheduledNotifications.length,
      };
    } catch (error) {
      console.error('Error getting today summary:', error);
      return null;
    }
  }

  // Export all data (for backup purposes)
  async exportData() {
    try {
      const appLimits = await storageService.getAppLimits();
      const userSettings = await storageService.getUserSettings();
      const usageData = await storageService.getUsageData();
      const weeklyStats = await appUsageService.getUsageStats(30); // Last 30 days

      return {
        exportDate: new Date().toISOString(),
        appLimits,
        userSettings,
        usageData,
        weeklyStats,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Clear all data (for reset purposes)
  async clearAllData() {
    try {
      await storageService.clearAppLimits();
      await storageService.clearUserSettings();
      await storageService.clearUsageData();
      await notificationService.cancelAllNotifications();
      timerService.stopAllTimers();
      
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export const brainDetoxService = new BrainDetoxService();
export default brainDetoxService;

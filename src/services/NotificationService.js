import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import timerService from './TimerService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.scheduledNotifications = new Set();
  }

  // Initialize notification service
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Configure notification categories
      await this.setupNotificationCategories();

      this.isInitialized = true;
      console.log('Notification service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Setup notification categories
  async setupNotificationCategories() {
    try {
      await Notifications.setNotificationCategoryAsync('limit-warning', [
        {
          identifier: 'extend-time',
          buttonTitle: 'Extend Time',
        },
        {
          identifier: 'take-break',
          buttonTitle: 'Take Break',
        },
      ]);

      await Notifications.setNotificationCategoryAsync('time-up', [
        {
          identifier: 'puzzle-unlock',
          buttonTitle: 'Solve Puzzle',
        },
      ]);
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  // Schedule limit warning notification
  async scheduleLimitWarning(appId, remainingTime) {
    try {
      const identifier = `limit-warning-${appId}`;
      
      // Cancel existing notification for this app
      await this.cancelNotification(identifier);

      const trigger = { seconds: Math.max(1, Math.floor(remainingTime / 1000)) };
      
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '⏱️ Time Almost Up!',
          body: `You have ${timerService.formatTimeHuman(remainingTime)} left for this session.`,
          categoryIdentifier: 'limit-warning',
          data: { appId, type: 'limit-warning' },
        },
        trigger,
      });

      this.scheduledNotifications.add(identifier);
      console.log(`Scheduled limit warning for ${appId} in ${timerService.formatTimeHuman(remainingTime)}`);
    } catch (error) {
      console.error('Error scheduling limit warning:', error);
    }
  }

  // Schedule time's up notification
  async scheduleTimeUpNotification(appId) {
    try {
      const identifier = `time-up-${appId}`;
      
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '🚫 Time\'s Up!',
          body: 'Your time limit has been reached. Take a break or solve a puzzle to continue.',
          categoryIdentifier: 'time-up',
          data: { appId, type: 'time-up' },
        },
        trigger: null, // Show immediately
      });

      this.scheduledNotifications.add(identifier);
      console.log(`Scheduled time up notification for ${appId}`);
    } catch (error) {
      console.error('Error scheduling time up notification:', error);
    }
  }

  // Schedule break reminder
  async scheduleBreakReminder(minutes = 30) {
    try {
      const identifier = 'break-reminder';
      
      await this.cancelNotification(identifier);

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '🧘 Time for a Break',
          body: 'Consider taking a mindful break to refresh your mind.',
          data: { type: 'break-reminder' },
        },
        trigger: { seconds: minutes * 60 },
      });

      this.scheduledNotifications.add(identifier);
      console.log(`Scheduled break reminder in ${minutes} minutes`);
    } catch (error) {
      console.error('Error scheduling break reminder:', error);
    }
  }

  // Schedule daily motivation
  async scheduleDailyMotivation() {
    try {
      const identifier = 'daily-motivation';
      
      await this.cancelNotification(identifier);

      const motivationalMessages = [
        '🌟 Start your day mindfully. Check your digital wellness goals.',
        '🧠 Your brain deserves quality time. How will you spend it today?',
        '⚡ Focus is a superpower. Use it wisely.',
        '🎯 Small steps towards digital wellness make a big difference.',
        '🌱 Today is a new opportunity to build better digital habits.',
      ];

      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      // Schedule for 9 AM tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: 'Good Morning! 🌅',
          body: randomMessage,
          data: { type: 'daily-motivation' },
        },
        trigger: { date: tomorrow },
      });

      this.scheduledNotifications.add(identifier);
      console.log('Scheduled daily motivation for tomorrow');
    } catch (error) {
      console.error('Error scheduling daily motivation:', error);
    }
  }

  // Schedule achievement notification
  async scheduleAchievementNotification(title, message) {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: `achievement-${Date.now()}`,
        content: {
          title: `🏆 ${title}`,
          body: message,
          data: { type: 'achievement' },
        },
        trigger: null, // Show immediately
      });

      console.log('Scheduled achievement notification');
    } catch (error) {
      console.error('Error scheduling achievement notification:', error);
    }
  }

  // Cancel a specific notification
  async cancelNotification(identifier) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      this.scheduledNotifications.delete(identifier);
      console.log(`Cancelled notification: ${identifier}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification response
  handleNotificationResponse(response) {
    const { data, actionIdentifier } = response.notification.request.content;
    
    switch (actionIdentifier) {
      case 'extend-time':
        this.handleExtendTime(data.appId);
        break;
      case 'take-break':
        this.handleTakeBreak(data.appId);
        break;
      case 'puzzle-unlock':
        this.handlePuzzleUnlock(data.appId);
        break;
      default:
        console.log('Notification tapped:', data);
    }
  }

  // Handle extend time action
  handleExtendTime(appId) {
    console.log(`Extending time for ${appId}`);
    // Implementation would depend on your app's navigation system
    // You might want to navigate to a puzzle screen or extend time directly
  }

  // Handle take break action
  handleTakeBreak(appId) {
    console.log(`Taking break from ${appId}`);
    // Implementation would close the app or navigate to a break screen
  }

  // Handle puzzle unlock action
  handlePuzzleUnlock(appId) {
    console.log(`Opening puzzle to unlock ${appId}`);
    // Implementation would navigate to the puzzle screen
  }

  // Setup notification listeners
  setupNotificationListeners() {
    // Listen for notifications received while app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses
    Notifications.addNotificationResponseReceivedListener(response => {
      this.handleNotificationResponse(response);
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;

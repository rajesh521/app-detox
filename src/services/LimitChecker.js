import storageService from './StorageService';
import appUsageService from './AppUsageService';

export class LimitChecker {
  constructor() {
    this.appLimits = {};
  }

  // Load app limits from storage
  async loadAppLimits() {
    try {
      const limits = await storageService.getAppLimits();
      this.appLimits = limits || {};
      return this.appLimits;
    } catch (error) {
      console.error('Error loading app limits:', error);
      return {};
    }
  }

  // Check if an app exceeds its time limit
  async checkLimit(appId) {
    try {
      const usage = await appUsageService.getTodayUsage(appId);
      const limitInfo = this.appLimits[appId];
      if (limitInfo && usage) {
        return usage.timeSpent >= limitInfo.timeLimit;
      }
      return false;
    } catch (error) {
      console.error('Error checking limit:', error);
      return false;
    }
  }

  // Get remaining time for an app
  async getRemainingTime(appId) {
    try {
      const usage = await appUsageService.getTodayUsage(appId);
      const limitInfo = this.appLimits[appId];
      if (limitInfo && usage) {
        return Math.max(0, limitInfo.timeLimit - usage.timeSpent);
      }
      return null;  // No limit for this app
    } catch (error) {
      console.error('Error getting remaining time:', error);
      return null;
    }
  }

  // Set limits for an app
  async setAppLimit(appId, timeLimit) {
    try {
      this.appLimits[appId] = { timeLimit };
      await storageService.setAppLimits(this.appLimits);
    } catch (error) {
      console.error('Error setting app limit:', error);
    }
  }

  // Remove limits for an app
  async removeAppLimit(appId) {
    try {
      delete this.appLimits[appId];
      await storageService.setAppLimits(this.appLimits);
    } catch (error) {
      console.error('Error removing app limit:', error);
    }
  }

  // Get all app limits
  async getAppLimits() {
    return await this.loadAppLimits();
  }
}

export const limitChecker = new LimitChecker();
export default limitChecker;

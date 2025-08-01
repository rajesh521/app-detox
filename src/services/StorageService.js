import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LIMITS_KEY = 'app_limits';
const USER_SETTINGS_KEY = 'user_settings';
const USAGE_DATA_KEY = 'usage_data';
const DAILY_USAGE_KEY = 'daily_usage';

// Wrapper for AsyncStorage to manage app limits
export const storageService = {
  async getAppLimits() {
    try {
      const jsonValue = await AsyncStorage.getItem(APP_LIMITS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting app limits:', error);
    }
  },

  async setAppLimits(limits) {
    try {
      const jsonValue = JSON.stringify(limits);
      await AsyncStorage.setItem(APP_LIMITS_KEY, jsonValue);
    } catch (error) {
      console.error('Error setting app limits:', error);
    }
  },

  async clearAppLimits() {
    try {
      await AsyncStorage.removeItem(APP_LIMITS_KEY);
    } catch (error) {
      console.error('Error clearing app limits:', error);
    }
  },

  async getUserSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_SETTINGS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting user settings:', error);
    }
  },

  async setUserSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(USER_SETTINGS_KEY, jsonValue);
    } catch (error) {
      console.error('Error setting user settings:', error);
    }
  },

  async clearUserSettings() {
    try {
      await AsyncStorage.removeItem(USER_SETTINGS_KEY);
    } catch (error) {
      console.error('Error clearing user settings:', error);
    }
  },

  // Usage tracking methods
  async getUsageData() {
    try {
      const jsonValue = await AsyncStorage.getItem(USAGE_DATA_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error getting usage data:', error);
      return {};
    }
  },

  async setUsageData(usageData) {
    try {
      const jsonValue = JSON.stringify(usageData);
      await AsyncStorage.setItem(USAGE_DATA_KEY, jsonValue);
    } catch (error) {
      console.error('Error setting usage data:', error);
    }
  },

  async getDailyUsage(date) {
    try {
      const key = `${DAILY_USAGE_KEY}_${date}`;
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error getting daily usage:', error);
      return {};
    }
  },

  async setDailyUsage(date, usageData) {
    try {
      const key = `${DAILY_USAGE_KEY}_${date}`;
      const jsonValue = JSON.stringify(usageData);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error setting daily usage:', error);
    }
  },

  async updateAppUsage(appId, timeSpent) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyUsage = await this.getDailyUsage(today);
      
      if (!dailyUsage[appId]) {
        dailyUsage[appId] = { timeSpent: 0, sessions: 0 };
      }
      
      dailyUsage[appId].timeSpent += timeSpent;
      dailyUsage[appId].sessions += 1;
      dailyUsage[appId].lastUsed = Date.now();
      
      await this.setDailyUsage(today, dailyUsage);
      return dailyUsage[appId];
    } catch (error) {
      console.error('Error updating app usage:', error);
    }
  },

  async clearUsageData() {
    try {
      await AsyncStorage.removeItem(USAGE_DATA_KEY);
      // Clear all daily usage keys
      const keys = await AsyncStorage.getAllKeys();
      const dailyUsageKeys = keys.filter(key => key.startsWith(DAILY_USAGE_KEY));
      await AsyncStorage.multiRemove(dailyUsageKeys);
    } catch (error) {
      console.error('Error clearing usage data:', error);
    }
  },

};

export default storageService;

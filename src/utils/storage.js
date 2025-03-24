/**
 * Local storage utility functions for storing and retrieving data
 */

// Storage keys
const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    REMEMBER_ME: 'remember_me',
    THEME: 'theme',
    LAST_ROUTE: 'last_route',
    NOTIFICATION_SETTINGS: 'notification_settings',
  };
  
  /**
   * Set an item in local storage
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store
   */
  export const setItem = (key, value) => {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error storing data in localStorage:', error);
    }
  };
  
  /**
   * Get an item from local storage
   * @param {string} key - The key to retrieve the value for
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} The stored value or defaultValue if not found
   */
  export const getItem = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, if it fails return the raw value
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Remove an item from local storage
   * @param {string} key - The key to remove
   */
  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  };
  
  /**
   * Clear all items from local storage
   */
  export const clearStorage = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };
  
  /**
   * Set auth token in storage
   * @param {string} token - The authentication token
   */
  export const setAuthToken = (token) => {
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  };
  
  /**
   * Get auth token from storage
   * @returns {string|null} The authentication token or null
   */
  export const getAuthToken = () => {
    return getItem(STORAGE_KEYS.AUTH_TOKEN);
  };
  
  /**
   * Remove auth token from storage
   */
  export const removeAuthToken = () => {
    removeItem(STORAGE_KEYS.AUTH_TOKEN);
  };
  
  /**
   * Store user information
   * @param {object} user - The user object to store
   */
  export const setUser = (user) => {
    setItem(STORAGE_KEYS.USER, user);
  };
  
  /**
   * Get stored user information
   * @returns {object|null} The user object or null
   */
  export const getUser = () => {
    return getItem(STORAGE_KEYS.USER);
  };
  
  /**
   * Remove user information
   */
  export const removeUser = () => {
    removeItem(STORAGE_KEYS.USER);
  };
  
  /**
   * Store user's "remember me" preference
   * @param {boolean} remember - Whether to remember the user
   */
  export const setRememberMe = (remember) => {
    setItem(STORAGE_KEYS.REMEMBER_ME, remember);
  };
  
  /**
   * Get user's "remember me" preference
   * @returns {boolean} Whether to remember the user
   */
  export const getRememberMe = () => {
    return getItem(STORAGE_KEYS.REMEMBER_ME, false);
  };
  
  /**
   * Store user's theme preference
   * @param {string} theme - The theme preference ('light', 'dark', 'system')
   */
  export const setTheme = (theme) => {
    setItem(STORAGE_KEYS.THEME, theme);
  };
  
  /**
   * Get user's theme preference
   * @returns {string} The theme preference
   */
  export const getTheme = () => {
    return getItem(STORAGE_KEYS.THEME, 'light');
  };
  
  /**
   * Store the last visited route
   * @param {string} route - The route path
   */
  export const setLastRoute = (route) => {
    setItem(STORAGE_KEYS.LAST_ROUTE, route);
  };
  
  /**
   * Get the last visited route
   * @returns {string|null} The last route or null
   */
  export const getLastRoute = () => {
    return getItem(STORAGE_KEYS.LAST_ROUTE);
  };
  
  /**
   * Check if storage is available
   * @returns {boolean} Whether localStorage is available
   */
  export const isStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Store notification settings
   * @param {object} settings - The notification settings
   */
  export const setNotificationSettings = (settings) => {
    setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  };
  
  /**
   * Get notification settings
   * @returns {object} The notification settings
   */
  export const getNotificationSettings = () => {
    return getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
      enableEmail: true,
      enableBrowser: true,
      complaintsNotify: true,
      studentsNotify: true,
      staffNotify: true
    });
  };
  
  export default {
    setItem,
    getItem,
    removeItem,
    clearStorage,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    setUser,
    getUser,
    removeUser,
    setRememberMe,
    getRememberMe,
    setTheme,
    getTheme,
    setLastRoute,
    getLastRoute,
    isStorageAvailable,
    setNotificationSettings,
    getNotificationSettings,
    STORAGE_KEYS
  };
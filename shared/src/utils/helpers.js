/**
 * Helper Utilities
 * General utility functions
 */

import { DATE_FORMATS } from '../config/constants';

/**
 * Format date to display format
 * @param {Date|timestamp} date - Date to format
 * @param {string} format - Format string (default: DD/MM/YYYY)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  if (format === DATE_FORMATS.DISPLAY) {
    return `${day}/${month}/${year}`;
  }

  if (format === DATE_FORMATS.DISPLAY_WITH_TIME) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  if (format === DATE_FORMATS.ISO) {
    return `${year}-${month}-${day}`;
  }

  return dateObj.toLocaleDateString();
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from file name
 * @param {string} fileName - File name
 * @returns {string} File extension
 */
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

/**
 * Get initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials (e.g., "JD")
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Get full name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Full name
 */
export const getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array of objects by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Filter array of objects by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array<string>} searchKeys - Keys to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (array, searchTerm, searchKeys) => {
  if (!searchTerm) return array;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return array.filter((item) => {
    return searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerSearchTerm);
      }
      return false;
    });
  });
};

/**
 * Get time ago string (e.g., "2 hours ago")
 * @param {Date|timestamp} date - Date to compare
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - dateObj) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength, suffix = '...') => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
};

/**
 * Generate random color (for avatars)
 * @param {string} seed - Seed for consistent color
 * @returns {string} Color hex code
 */
export const generateColor = (seed) => {
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#16a085',
  ];

  if (!seed) return colors[0];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Convert timestamp to Date object
 * @param {Object} timestamp - Firebase timestamp
 * @returns {Date} Date object
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date(timestamp);
};

/**
 * Sleep function (for delays)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Result of function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};

/**
 * Check if running on iOS
 * @returns {boolean} True if iOS
 */
export const isIOS = () => {
  return Platform.OS === 'ios';
};

/**
 * Check if running on Android
 * @returns {boolean} True if Android
 */
export const isAndroid = () => {
  return Platform.OS === 'android';
};

/**
 * Format date to display in different formats
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type: 'full', 'date', 'time', 'relative', 'ago'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full') => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    switch (format) {
      case 'full':
        // Format: March 23, 2025, 2:30 PM
        return dateObj.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      
      case 'date':
        // Format: 03/23/2025
        return dateObj.toLocaleDateString('en-US');
      
      case 'time':
        // Format: 2:30 PM
        return dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      
      case 'relative':
        // Format: Today, Yesterday, or date
        return getRelativeDate(dateObj);
      
      case 'ago':
        // Format: 2 hours ago, 3 days ago, etc.
        return getTimeAgo(dateObj);
      
      default:
        return dateObj.toLocaleString('en-US');
    }
  };
  
  /**
   * Get relative date (Today, Yesterday, or formatted date)
   * @param {Date} date - The date to format
   * @returns {string} Relative date string
   */
  const getRelativeDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (dateOnly.getTime() === today.getTime()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })}`;
    }
    
    if (dateOnly.getTime() === yesterday.getTime()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })}`;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Get time ago format (2 hours ago, 3 days ago, etc.)
   * @param {Date} date - The date to format
   * @returns {string} Time ago string
   */
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    
    if (seconds < 60) {
      return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    }
    
    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    
    if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    
    if (days < 30) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    
    if (months < 12) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    
    return years === 1 ? '1 year ago' : `${years} years ago`;
  };
  
  /**
   * Format date as a duration (e.g., "2d 4h 30m")
   * @param {number} milliseconds - Duration in milliseconds
   * @returns {string} Formatted duration string
   */
  export const formatDuration = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) {
      return '0m';
    }
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    
    let result = '';
    
    if (days > 0) {
      result += `${days}d `;
    }
    
    if (remainingHours > 0) {
      result += `${remainingHours}h `;
    }
    
    if (remainingMinutes > 0 || result === '') {
      result += `${remainingMinutes}m`;
    }
    
    return result.trim();
  };
  
  export default formatDate;
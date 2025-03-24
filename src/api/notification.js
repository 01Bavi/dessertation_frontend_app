// src/api/notification.js
/**
 * Fetch notification by ID
 * @param {string|number} id 
 * @returns {Promise}
 */
export const fetchNotificationById = async (id) => {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          title: `Notification #${id}`,
          message: `This is the content of notification #${id}. It contains important information that you need to know.`,
          type: ['complaint', 'student', 'staff'][id % 3],
          isRead: false,
          createdAt: new Date(Date.now() - (id * 86400000)).toISOString(),
          resourceId: 1000 + parseInt(id),
          studentId: id % 3 === 1 ? `2023-${1000 + parseInt(id)}` : null
        });
      }, 800);
    });
  };
  
  /**
   * Mark notification as read
   * @param {string|number} id 
   * @returns {Promise}
   */
  export const markAsRead = async (id) => {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  };
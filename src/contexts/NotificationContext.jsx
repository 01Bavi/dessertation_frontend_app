import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Create notification context
const NotificationContext = createContext();

// Sample notification types and their configurations
const NOTIFICATION_TYPES = {
  SUCCESS: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-green-50 border-green-400 text-green-800',
    iconClassName: 'text-green-400',
  },
  ERROR: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-red-50 border-red-400 text-red-800',
    iconClassName: 'text-red-400',
  },
  WARNING: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    iconClassName: 'text-yellow-400',
  },
  INFO: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-blue-50 border-blue-400 text-blue-800',
    iconClassName: 'text-blue-400',
  },
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  // State for temporary notifications (toast messages)
  const [notifications, setNotifications] = useState([]);
  
  // State for persistent notifications (notification center)
  const [persistentNotifications, setPersistentNotifications] = useState([]);
  
  // State for unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // Load persistent notifications from API or localStorage on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real application, replace this with an API call
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setPersistentNotifications(parsedNotifications);
          
          // Update unread count
          const unread = parsedNotifications.filter(notification => !notification.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to add a temporary notification (toast)
  const addNotification = useCallback((type, message, duration = 5000) => {
    const id = Date.now();
    const newNotification = {
      id,
      type,
      message,
      createdAt: new Date(),
      ...NOTIFICATION_TYPES[type],
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Function to remove a temporary notification (toast)
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Function to add a persistent notification (to notification center)
  const addPersistentNotification = useCallback((data) => {
    const newNotification = {
      id: data.id || Date.now(),
      title: data.title,
      message: data.message,
      type: data.type || 'complaint',
      entityId: data.entityId,
      createdAt: data.createdAt || new Date(),
      isRead: false,
      ...data,
    };

    setPersistentNotifications(prev => {
      const updated = [newNotification, ...prev];
      
      // Save to localStorage (in a real app, you might want to sync with an API)
      localStorage.setItem('notifications', JSON.stringify(updated));
      
      return updated;
    });

    // Update unread count
    setUnreadCount(prev => prev + 1);

    return newNotification.id;
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback((id) => {
    setPersistentNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      );
      
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updated));
      
      return updated;
    });

    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setPersistentNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, isRead: true }));
      
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updated));
      
      return updated;
    });

    // Reset unread count
    setUnreadCount(0);
  }, []);

  // Function to clear a notification
  const clearNotification = useCallback((id) => {
    setPersistentNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;
      
      const updated = prev.filter(notification => notification.id !== id);
      
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updated));
      
      return updated;
    });

    // Update unread count if the notification was unread
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  // Function to clear all notifications
  const clearAllNotifications = useCallback(() => {
    setPersistentNotifications([]);
    
    // Clear localStorage
    localStorage.removeItem('notifications');
    
    // Reset unread count
    setUnreadCount(0);
  }, []);

  // Create convenience methods for different notification types
  const success = useCallback((message, duration) => {
    return addNotification('SUCCESS', message, duration);
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    return addNotification('ERROR', message, duration);
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    return addNotification('WARNING', message, duration);
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    return addNotification('INFO', message, duration);
  }, [addNotification]);

  // Values to provide through context
  const value = {
    // Toast notifications
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    
    // Persistent notifications
    persistentNotifications,
    addPersistentNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast Notifications Component */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`flex items-start p-4 rounded-md border shadow-sm ${notification.className}`}
            >
              <div className={`flex-shrink-0 ${notification.iconClassName}`}>
                {notification.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button 
                type="button" 
                className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => removeNotification(notification.id)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
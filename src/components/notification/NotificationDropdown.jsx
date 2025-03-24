import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const unreadCount = notifications ? notifications.filter(notification => !notification.isRead).length : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to appropriate page based on notification type
    if (notification.type === 'complaint') {
      navigate(`/complaints/${notification.entityId}`);
    } else if (notification.type === 'student') {
      navigate(`/students/${notification.entityId}`);
    } else if (notification.type === 'staff') {
      navigate(`/staffs/${notification.entityId}`);
    } else {
      navigate(`/notifications/${notification.id}`);
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'complaint':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'student':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        );
      case 'staff':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2 px-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {
                  onMarkAllAsRead();
                  setIsOpen(false);
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.slice(0, 7).map((notification) => (
                  <div
                    key={notification.id}
                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      {getNotificationIcon(notification.type)}
                      <div className="ml-3 flex-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
          {notifications && notifications.length > 7 && (
            <div className="border-t border-gray-200 py-2 px-4">
              <button
                className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const NotificationDropdown = () => {
  // This is sample data. In a real app, you would fetch this from the API
  const notifications = [
    {
      id: 1,
      title: 'New Complaint',
      message: 'A new complaint has been submitted',
      time: '10 minutes ago',
      link: '/complaints/1',
      read: false
    },
    {
      id: 2,
      title: 'Staff Assignment',
      message: 'A complaint has been assigned to staff',
      time: '1 hour ago',
      link: '/complaints/2',
      read: false
    },
    {
      id: 3,
      title: 'Complaint Resolved',
      message: 'A staff member has resolved a complaint',
      time: '3 hours ago',
      link: '/complaints/3',
      read: true
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2 px-4 bg-gray-100 border-b border-gray-200">
        <div className="text-gray-800 font-medium">Notifications</div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link 
              key={notification.id}
              to={notification.link}
              className={`block py-2 px-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <FaExclamationCircle className={`${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        )}
      </div>
      
      <div className="py-2 px-4 bg-gray-100 text-center">
        <Link to="/notifications" className="text-sm text-blue-500 hover:text-blue-700">
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
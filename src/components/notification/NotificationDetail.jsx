import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';

const NotificationDetail = ({ notification, isLoading, onMarkAsRead }) => {
  const navigate = useNavigate();

  // Mark as read when component mounts
  useEffect(() => {
    if (notification && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
  }, [notification, onMarkAsRead]);

  const handleBackClick = () => {
    navigate('/notifications');
  };

  const handleEntityClick = () => {
    if (!notification) return;

    if (notification.type === 'complaint') {
      navigate(`/complaints/${notification.entityId}`);
    } else if (notification.type === 'student') {
      navigate(`/students/${notification.entityId}`);
    } else if (notification.type === 'staff') {
      navigate(`/staffs/${notification.entityId}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'complaint':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'student':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        );
      case 'staff':
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Notification not found</h3>
        <p className="text-gray-500 mb-4">The notification you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={handleBackClick}>
          Back to Notifications
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackClick}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Notification Details</h1>
      </div>

      <Card className="mb-6">
        <div className="space-y-6">
          <div className="flex items-start">
            {getNotificationIcon(notification.type)}
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 whitespace-pre-line">{notification.message}</p>
          </div>

          {notification.entityId && (
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={handleEntityClick}
              >
                {notification.type === 'complaint' && 'View Complaint'}
                {notification.type === 'student' && 'View Student'}
                {notification.type === 'staff' && 'View Staff'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {notification.relatedInfo && (
        <Card title="Additional Information">
          <div className="space-y-4">
            {Object.entries(notification.relatedInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
                <span className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotificationDetail;
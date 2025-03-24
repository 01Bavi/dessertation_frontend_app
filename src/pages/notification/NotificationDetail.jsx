import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import NotificationDetail from '../../components/notification/NotificationDetail';
import Button from '../../components/common/Button';


const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const getNotificationDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchNotificationById(id);
        setNotification(data);
        setLoading(false);
        
        // If notification is unread, mark it as read
        if (data && !data.isRead) {
          handleMarkAsRead();
        }
      } catch (err) {
        setError('Failed to fetch notification details');
        setLoading(false);
      }
    };

    getNotificationDetails();
  }, [id]);

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(id);
      setNotification(prev => ({
        ...prev,
        isRead: true
      }));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoToResource = () => {
    // Navigate to the related resource based on notification type
    if (notification) {
      if (notification.type === 'complaint') {
        navigate(`/complaints/${notification.resourceId}`);
      } else if (notification.type === 'student') {
        navigate(`/students/${notification.resourceId}`);
      } else if (notification.type === 'staff') {
        navigate(`/staffs/${notification.resourceId}`);
      }
    }
  };

  return (
    <Layout>
      <div className="px-6 py-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackClick}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Notification Details</h1>
        </div>
        
        {actionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {actionSuccess}
          </div>
        )}

        <Card>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-500">{error}</div>
          ) : notification ? (
            <div className="p-6">
              <NotificationDetail notification={notification} />
              
              {/* Show timestamp in a styled format */}
              <div className="mt-4 text-sm text-gray-500">
                Received: {new Date(notification.createdAt).toLocaleString()}
              </div>

              {/* If the notification has related student ID, show it */}
              {notification.studentId && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Related Student ID: </p>
                  <p className="text-lg font-semibold">{notification.studentId}</p>
                </div>
              )}
              
              {/* Button to navigate to the resource that this notification is about */}
              {notification.resourceId && (
                <div className="mt-6">
                  <Button 
                    onClick={handleGoToResource}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">Notification not found</div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationDetailPage;
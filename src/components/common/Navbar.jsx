import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  return (
    <div className="bg-white shadow h-16 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      <div className="text-xl font-semibold text-gray-700">Complaint Management System</div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-200 relative"
          >
            <FaBell className="text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          {showNotifications && <NotificationDropdown />}
        </div>
        
        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200"
          >
            <FaUserCircle className="text-gray-600 text-2xl" />
            <span className="text-gray-700">{user?.name || 'Admin'}</span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <button 
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
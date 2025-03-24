// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiBell, BiUser } from 'react-icons/bi';
import NotificationDropdown from '../notification/NotificationDropdown';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img src="/assets/images/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-semibold">CMS Admin</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <BiBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && <NotificationDropdown />}
          </div>
          
          {/* Profile Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <BiUser className="h-5 w-5 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name || 'Admin'}</span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
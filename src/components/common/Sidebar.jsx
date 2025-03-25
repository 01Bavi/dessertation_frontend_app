import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUserTie, FaClipboardList } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome className="mr-3 text-xl" /> },
    { path: '/students', name: 'Students', icon: <FaUserGraduate className="mr-3 text-xl" /> },
    { path: '/staff', name: 'Staff', icon: <FaUserTie className="mr-3 text-xl" /> },
    { path: '/complaints', name: 'Complaints', icon: <FaClipboardList className="mr-3 text-xl" /> },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen fixed left-0">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>
      <nav className="mt-5">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center py-3 px-5 transition duration-200 hover:bg-gray-700 ${
                  isActive(item.path) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
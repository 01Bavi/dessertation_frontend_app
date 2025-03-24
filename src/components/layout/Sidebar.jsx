// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { BiHome, BiUser, BiUserVoice, BiMessageSquareDetail } from 'react-icons/bi';

const Sidebar = () => {
  const navItems = [
    {
      label: 'Dashboard',
      icon: <BiHome className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      label: 'Students',
      icon: <BiUser className="h-5 w-5" />,
      path: '/students',
    },
    {
      label: 'Staff',
      icon: <BiUserVoice className="h-5 w-5" />,
      path: '/staffs',
    },
    {
      label: 'Complaints',
      icon: <BiMessageSquareDetail className="h-5 w-5" />,
      path: '/complaints',
    },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0 overflow-y-auto">
      <div className="py-4">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
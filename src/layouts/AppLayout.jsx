import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import useAuth from '../hooks/useAuth';
import Loading from '../components/common/Loading';

const AppLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
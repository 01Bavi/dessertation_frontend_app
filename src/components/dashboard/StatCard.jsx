import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue', isLoading = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  const bgColorClass = colorClasses[color] || colorClasses.blue;
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 animate-pulse">
        <div className="flex items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center ${bgColorClass}`}>
            <div className="w-6 h-6 bg-current opacity-25 rounded"></div>
          </div>
          <div className="ml-5">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-16 mt-2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`rounded-full w-12 h-12 flex items-center justify-center ${bgColorClass}`}>
          {icon}
        </div>
        <div className="ml-5">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
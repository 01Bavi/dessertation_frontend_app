import React from 'react';

const Stats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Complaints</h2>
        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Recent (7 days)</h2>
        <p className="text-3xl font-bold text-green-600">{stats.recent}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">By Status</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            Pending: {stats.byStatus?.PENDING || 0}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Assigned: {stats.byStatus?.ASSIGNED || 0}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            In Progress: {stats.byStatus?.IN_PROGRESS || 0}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
            Completed: {stats.byStatus?.COMPLETED || 0}
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
            Dropped: {stats.byStatus?.DROPPED || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
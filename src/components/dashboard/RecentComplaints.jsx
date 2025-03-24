import React from 'react';
import { Link } from 'react-router-dom';

const RecentComplaints = ({ complaints, loading, error, page, totalPages, onPageChange, statusFilter, onStatusFilterChange, searchTerm, onSearchTermChange, onSearch }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'DROPPED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <div className="flex-1">
          <form onSubmit={onSearch} className="flex">
            <input
              type="text"
              className="border rounded-l-md px-3 py-2 w-full"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="flex items-center">
          <label className="mr-2">Filter:</label>
          <select
            className="border rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-4">No complaints found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Staff</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-b">
                  <td className="px-4 py-3">{complaint.title}</td>
                  <td className="px-4 py-3">{complaint.students?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{complaint.staffs?.name || 'Not Assigned'}</td>
                  <td className="px-4 py-3">{formatDate(complaint.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/complaint/${complaint.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      View
                    </Link>
                    
                    {complaint.status === 'PENDING' && (
                      <>
                        <Link
                          to={`/complaint/assign/${complaint.id}`}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Assign
                        </Link>
                        <Link
                          to={`/complaint/drop/${complaint.id}`}
                          className="text-red-600 hover:text-red-800"
                        >
                          Drop
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-2 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentComplaints;
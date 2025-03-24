import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import Filter from '../common/Filter';
import Button from '../common/Button';

const ComplaintList = ({ complaints, isLoading, totalPages, currentPage, onPageChange, onFilterChange }) => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' },
        { value: 'dropped', label: 'Dropped' }
      ]
    },
    {
      id: 'searchTerm',
      label: 'Search',
      type: 'text',
      placeholder: 'Search by ID, Title or Student'
    },
    {
      id: 'dateFrom',
      label: 'From Date',
      type: 'date'
    },
    {
      id: 'dateTo',
      label: 'To Date',
      type: 'date'
    }
  ];

  const handleViewComplaint = (id) => {
    navigate(`/complaints/${id}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterApply = (filterValues) => {
    setSelectedStatus(filterValues.status || 'all');
    onFilterChange(filterValues);
  };

  const handleFilterReset = () => {
    setSelectedStatus('all');
    onFilterChange({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Complaint Management</h2>
      </div>

      <Filter 
        filters={filters} 
        onApplyFilters={handleFilterApply} 
        onResetFilters={handleFilterReset} 
      />

      {complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No complaints found</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Student</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{complaint.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">{complaint.title}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{complaint.student.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{complaint.department}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewComplaint(complaint.id)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ComplaintList;
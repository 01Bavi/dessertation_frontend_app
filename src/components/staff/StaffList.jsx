import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import Filter from '../common/Filter';

const StaffList = ({ staffMembers, isLoading, totalPages, currentPage, onPageChange, onFilterChange }) => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: '', label: 'All Departments' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'CS', label: 'Computer Science' },
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
        { value: 'EE', label: 'Electrical Engineering' },
        { value: 'ECE', label: 'Electronics & Communication' },
        { value: 'ADMIN', label: 'Administration' }
      ]
    },
    {
      id: 'searchTerm',
      label: 'Search',
      type: 'text',
      placeholder: 'Search by ID, Name or Email'
    }
  ];

  const handleViewStaff = (id) => {
    navigate(`/staffs/${id}`);
  };

  const handleCreateStaff = () => {
    navigate('/staffs/create');
  };

  const handleFilterApply = (filterValues) => {
    setSelectedStatus(filterValues.status || 'all');
    onFilterChange(filterValues);
  };

  const handleFilterReset = () => {
    setSelectedStatus('all');
    onFilterChange({});
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
        <h2 className="text-xl font-bold text-gray-800">Staff Management</h2>
        <Button 
          variant="primary" 
          onClick={handleCreateStaff}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Staff
        </Button>
      </div>

      <Filter 
        filters={filters} 
        onApplyFilters={handleFilterApply} 
        onResetFilters={handleFilterReset} 
      />

      {staffMembers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No staff members found</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Designation</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{staff.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                        {staff.avatar ? (
                          <img 
                            src={staff.avatar} 
                            alt={staff.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            {staff.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{staff.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{staff.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{staff.department}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{staff.designation}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(staff.isActive)}`}>
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewStaff(staff.id)}
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

export default StaffList;
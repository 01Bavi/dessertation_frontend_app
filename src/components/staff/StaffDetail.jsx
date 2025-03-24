import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const StaffDetail = ({ staff, isLoading, onStatusChange, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (isLoading || !staff) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleEditClick = () => {
    navigate(`/staffs/edit/${staff.id}`);
  };

  const handleBackClick = () => {
    navigate('/staffs');
  };

  const handleDeleteConfirm = () => {
    onDelete(staff.id);
    setShowDeleteModal(false);
  };

  const handleStatusConfirm = () => {
    onStatusChange(staff.id, !staff.isActive);
    setShowStatusModal(false);
  };

  const departmentToLabel = (deptCode) => {
    const departments = {
      'IT': 'Information Technology',
      'CS': 'Computer Science',
      'ME': 'Mechanical Engineering',
      'CE': 'Civil Engineering',
      'EE': 'Electrical Engineering',
      'ECE': 'Electronics & Communication',
      'ADMIN': 'Administration'
    };
    return departments[deptCode] || deptCode;
  };

  const designationToLabel = (desigCode) => {
    const designations = {
      'HOD': 'Head of Department',
      'PROFESSOR': 'Professor',
      'ASST_PROFESSOR': 'Assistant Professor',
      'LECTURER': 'Lecturer',
      'LAB_INCHARGE': 'Lab Incharge',
      'ADMIN_STAFF': 'Administrative Staff'
    };
    return designations[desigCode] || desigCode;
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackClick}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Staff Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main staff details */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 p-4 flex justify-center md:justify-start">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {staff.profilePictureUrl ? (
                    <img 
                      src={staff.profilePictureUrl} 
                      alt={staff.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{staff.name}</h2>
                    <p className="text-sm text-gray-500">{designationToLabel(staff.designation)}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Staff ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">#{staff.id}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900">{departmentToLabel(staff.department)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{staff.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{staff.phoneNumber || '—'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{staff.address || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          {/* Complaints Handled Section */}
          {staff.complaints && staff.complaints.length > 0 && (
            <Card title="Complaints Handled" className="mt-6">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Title</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Student</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {staff.complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{complaint.id}</td>
                        <td className="px-3 py-4 text-sm text-gray-900 font-medium">{complaint.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{complaint.student.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            complaint.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
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
                            onClick={() => navigate(`/complaints/${complaint.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar with actions and stats */}
        <div className="space-y-6">
          <Card title="Actions">
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleEditClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Staff
              </Button>
              <Button
                variant={staff.isActive ? "warning" : "success"}
                fullWidth
                onClick={() => setShowStatusModal(true)}
              >
                {staff.isActive ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Deactivate Staff
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Activate Staff
                  </>
                )}
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowDeleteModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Staff
              </Button>
            </div>
          </Card>

          {/* Staff Performance Card */}
          {staff.performance && (
            <Card title="Performance">
              <dl className="grid grid-cols-1 gap-4">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Response Rate</dt>
                  <dd className="mt-1 flex justify-between items-center">
                    <div className="text-lg font-semibold text-gray-900">{staff.performance.responseRate}%</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      staff.performance.responseRate >= 80 ? 'bg-green-100 text-green-800' :
                      staff.performance.responseRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {staff.performance.responseRate >= 80 ? 'Good' :
                       staff.performance.responseRate >= 60 ? 'Average' : 'Poor'}
                    </span>
                  </dd>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Resolution Time (avg)</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{staff.performance.avgResolutionTime} days</dd>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Complaint Status</dt>
                  <dd className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Active</span>
                      <span>{staff.performance.activeComplaints}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Resolved</span>
                      <span>{staff.performance.resolvedComplaints}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Total</span>
                      <span>{staff.performance.totalComplaints}</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Staff Member"
        size="md"
        footer={
          <>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="ml-3"
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Deleting this staff member will remove all their account information and associations. Any complaints assigned to them may become unassigned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={staff.isActive ? "Deactivate Staff Member" : "Activate Staff Member"}
        size="md"
        footer={
          <>
            <Button
              variant={staff.isActive ? "warning" : "success"}
              onClick={handleStatusConfirm}
            >
              {staff.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(false)}
              className="ml-3"
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {staff.isActive 
              ? "Are you sure you want to deactivate this staff member? They will no longer be able to login or be assigned new complaints."
              : "Are you sure you want to activate this staff member? They will be able to login and be assigned new complaints."
            }
          </p>
          
          {staff.isActive && staff.performance && staff.performance.activeComplaints > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This staff member currently has {staff.performance.activeComplaints} active complaints assigned to them. Deactivating them will require reassigning these complaints.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StaffDetail;
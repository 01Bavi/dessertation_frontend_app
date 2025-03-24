import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const StudentDetail = ({ student, isLoading, onStatusChange, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (isLoading || !student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleEditClick = () => {
    navigate(`/students/edit/${student.id}`);
  };

  const handleBackClick = () => {
    navigate('/students');
  };

  const handleDeleteConfirm = () => {
    onDelete(student.id);
    setShowDeleteModal(false);
  };

  const handleStatusConfirm = () => {
    onStatusChange(student.id, !student.isActive);
    setShowStatusModal(false);
  };

  const departmentToLabel = (deptCode) => {
    const departments = {
      'IT': 'Information Technology',
      'CS': 'Computer Science',
      'ME': 'Mechanical Engineering',
      'CE': 'Civil Engineering',
      'EE': 'Electrical Engineering',
      'ECE': 'Electronics & Communication'
    };
    return departments[deptCode] || deptCode;
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
        <h1 className="text-xl font-bold text-gray-900">Student Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main student details */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 p-4 flex justify-center md:justify-start">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {student.profilePictureUrl ? (
                    <img 
                      src={student.profilePictureUrl} 
                      alt={student.name} 
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
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900">{departmentToLabel(student.department)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Batch</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.batch}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.phoneNumber || '—'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.address || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          {/* Complaints Section */}
          {student.complaints && student.complaints.length > 0 && (
            <Card title="Student Complaints" className="mt-6">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Title</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Department</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {student.complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{complaint.id}</td>
                        <td className="px-3 py-4 text-sm text-gray-900 font-medium">{complaint.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{complaint.department}</td>
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
                Edit Student
              </Button>
              <Button
                variant={student.isActive ? "warning" : "success"}
                fullWidth
                onClick={() => setShowStatusModal(true)}
              >
                {student.isActive ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Deactivate Student
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Activate Student
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
                Delete Student
              </Button>
            </div>
          </Card>

          {/* Student Stats Card */}
          {student.stats && (
            <Card title="Overview">
              <dl className="grid grid-cols-1 gap-4">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Total Complaints</dt>
                  <dd className="mt-1 flex justify-between items-center">
                    <div className="text-lg font-semibold text-gray-900">{student.stats.totalComplaints}</div>
                  </dd>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Complaint Status</dt>
                  <dd className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Pending</span>
                      <span>{student.stats.pendingComplaints}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>In Progress</span>
                      <span>{student.stats.activeComplaints}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Resolved</span>
                      <span>{student.stats.resolvedComplaints}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Closed</span>
                      <span>{student.stats.closedComplaints}</span>
                    </div>
                  </dd>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Registered Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </Card>
          )}
          
          {/* Related Resources */}
          <Card title="Quick Links">
            <div className="space-y-2">
              <a 
                href={`mailto:${student.email}`}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
              
              <button 
                className="flex items-center w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                onClick={() => navigate('/complaints/create', { state: { studentId: student.id } })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New Complaint
              </button>
              
              <button 
                className="flex items-center w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                onClick={() => window.print()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Profile
              </button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Student"
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
            Are you sure you want to delete this student? This action cannot be undone.
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
                  Deleting this student will remove all their account information and complaints from the system.
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
        title={student.isActive ? "Deactivate Student" : "Activate Student"}
        size="md"
        footer={
          <>
            <Button
              variant={student.isActive ? "warning" : "success"}
              onClick={handleStatusConfirm}
            >
              {student.isActive ? "Deactivate" : "Activate"}
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
            {student.isActive 
              ? "Are you sure you want to deactivate this student? They will no longer be able to login or submit new complaints."
              : "Are you sure you want to activate this student? They will be able to login and submit new complaints."
            }
          </p>
          
          {student.isActive && student.stats && student.stats.activeComplaints > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This student currently has {student.stats.activeComplaints} active complaints in the system. These complaints will remain active even if the student is deactivated.
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

export default StudentDetail;
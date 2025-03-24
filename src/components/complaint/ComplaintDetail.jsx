import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const ComplaintDetail = ({ complaint, isLoading, onAssign, onDrop }) => {
  const navigate = useNavigate();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  if (isLoading || !complaint) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  const handleAssignSubmit = () => {
    if (selectedStaffId) {
      onAssign(complaint.id, selectedStaffId);
      setShowAssignModal(false);
    }
  };

  const handleDropSubmit = () => {
    if (dropReason) {
      onDrop(complaint.id, dropReason);
      setShowDropModal(false);
    }
  };

  const handleBackClick = () => {
    navigate('/complaints');
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
        <h1 className="text-xl font-bold text-gray-900">Complaint #{complaint.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main complaint details */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Complaint Details">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(complaint.status)}`}>
                  {complaint.status}
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm">
                  <p className="whitespace-pre-line">{complaint.description}</p>
                </div>
              </div>

              {complaint.attachments && complaint.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Attachments</h4>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {complaint.attachments.map((attachment, index) => (
                      <li key={index} className="p-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate">{attachment.filename}</span>
                        </div>
                        <a 
                          href={attachment.url} 
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {complaint.staff && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Assigned Staff</h4>
                  <div className="mt-2 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {complaint.staff.avatar ? (
                        <img src={complaint.staff.avatar} alt={complaint.staff.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <span className="text-gray-500">{complaint.staff.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{complaint.staff.name}</p>
                      <p className="text-sm text-gray-500">{complaint.staff.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {complaint.comments && complaint.comments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Activity</h4>
                  <ul className="mt-2 space-y-4">
                    {complaint.comments.map((comment, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {comment.user.avatar ? (
                              <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full" />
                            ) : (
                              <span className="text-gray-500">{comment.user.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar with student info and actions */}
        <div className="space-y-6">
          <Card title="Student Information">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {complaint.student.avatar ? (
                  <img src={complaint.student.avatar} alt={complaint.student.name} className="h-10 w-10 rounded-full" />
                ) : (
                  <span className="text-gray-500">{complaint.student.name.charAt(0)}</span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{complaint.student.name}</p>
                <p className="text-sm text-gray-500">ID: {complaint.student.id}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Email:</dt>
                  <dd className="text-sm text-gray-900">{complaint.student.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Department:</dt>
                  <dd className="text-sm text-gray-900">{complaint.student.department}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Batch:</dt>
                  <dd className="text-sm text-gray-900">{complaint.student.batch}</dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card title="Actions">
            <div className="space-y-3">
              {complaint.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setShowAssignModal(true)}
                  >
                    Assign to Staff
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowDropModal(true)}
                  >
                    Drop Complaint
                  </Button>
                </>
              )}
              {complaint.status === 'assigned' && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowDropModal(true)}
                >
                  Drop Complaint
                </Button>
              )}
              {complaint.status === 'resolved' && (
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => onAssign(complaint.id, 'close')}
                >
                  Mark as Closed
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Assign Staff Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Complaint to Staff"
        size="md"
        footer={
          <>
            <Button
              variant="primary"
              onClick={handleAssignSubmit}
              disabled={!selectedStaffId}
            >
              Assign
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
              className="ml-3"
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Select a staff member to assign this complaint to.
          </p>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {(complaint.availableStaff || []).map((staff) => (
              <div 
                key={staff.id} 
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedStaffId === staff.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedStaffId(staff.id)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt={staff.name} className="h-10 w-10 rounded-full" />
                    ) : (
                      <span className="text-gray-500">{staff.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.department}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Current workload: {staff.activeComplaints} active complaints
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Drop Complaint Modal */}
      <Modal
        isOpen={showDropModal}
        onClose={() => setShowDropModal(false)}
        title="Drop Complaint"
        size="md"
        footer={
          <>
            <Button
              variant="danger"
              onClick={handleDropSubmit}
              disabled={!dropReason}
            >
              Drop Complaint
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDropModal(false)}
              className="ml-3"
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please provide a reason for dropping this complaint. This information will be shared with the student.
          </p>
          
          <div>
            <label htmlFor="dropReason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              id="dropReason"
              name="dropReason"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              placeholder="Enter reason for dropping the complaint..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintDetail;
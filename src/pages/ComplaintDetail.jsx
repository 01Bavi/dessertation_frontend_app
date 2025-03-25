import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaUserGraduate, 
  FaUserTie, 
  FaClock, 
  FaCalendarAlt, 
  FaTags, 
  FaExclamationTriangle,
  FaUserCog,
  FaTimesCircle
} from 'react-icons/fa';
import { 
  getComplaintById, 
  assignComplaint, 
  dropComplaint 
} from '../services/complaint';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import AssignComplaintModal from '../components/complaint/AssignComplaintModal';
import moment from 'moment';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id);
        setComplaint(data);
      } catch (error) {
        toast.error('Failed to fetch complaint details');
        navigate('/complaints');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaint();
  }, [id, navigate]);

  const handleAssignComplaint = async (complaintId, staffId, note) => {
    try {
      setActionLoading(true);
      await assignComplaint(complaintId, staffId, note);
      toast.success('Complaint assigned successfully');
      
      // Refresh complaint data
      const updatedComplaint = await getComplaintById(id);
      setComplaint(updatedComplaint);
    } catch (error) {
      toast.error(error.message || 'Failed to assign complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDropComplaint = async () => {
    if (!dropReason.trim()) {
      toast.error('Please provide a reason for dropping the complaint');
      return;
    }

    try {
      setActionLoading(true);
      await dropComplaint(id, dropReason);
      toast.success('Complaint dropped successfully');
      
      // Refresh complaint data
      const updatedComplaint = await getComplaintById(id);
      setComplaint(updatedComplaint);
      setDropModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to drop complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1" /> },
      ASSIGNED: { color: 'bg-blue-100 text-blue-800', icon: <FaUserCog className="mr-1" /> },
      IN_PROGRESS: { color: 'bg-purple-100 text-purple-800', icon: <FaUserCog className="mr-1" /> },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
      DROPPED: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> }
    };
    
    const badge = badges[status] || badges.PENDING;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.icon}
        {status}
      </span>
    );
  };
  
  if (loading) {
    return <Loading fullScreen text="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Complaint not found</h2>
          <p className="mt-2 text-gray-500">The requested complaint does not exist or has been deleted.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/complaints')}
            icon={<FaArrowLeft />}
          >
            Back to Complaints
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="light"
            icon={<FaArrowLeft />}
            onClick={() => navigate('/complaints')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Complaint Detail</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusBadge(complaint.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card title="Complaint Information">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{complaint.title}</h2>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <FaTags className="mr-1" />
                <span>Subject: {complaint.subject}</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-1" />
                <span>Submitted: {moment(complaint.created_at).format('MMMM D, YYYY [at] h:mm A')}</span>
              </div>
              {complaint.category && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Category: {complaint.category}
                  </span>
                  {complaint.priority && (
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      complaint.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Priority: {complaint.priority}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
              <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap">
                {complaint.body}
              </div>
            </div>
            
            {complaint.status === 'PENDING' && (
              <div className="flex justify-end space-x-3">
                <Button
                  variant="danger"
                  icon={<FaTimesCircle />}
                  onClick={() => setDropModalOpen(true)}
                >
                  Drop Complaint
                </Button>
                <Button
                  variant="primary"
                  icon={<FaUserTie />}
                  onClick={() => setAssignModalOpen(true)}
                >
                  Assign to Staff
                </Button>
              </div>
            )}
          </Card>
          
          {complaint.assigned_staff_id && (
            <Card title="Assignment Information" className="mt-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <FaUserTie className="text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-900">{complaint.staffs?.name || 'Staff Member'}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{complaint.staffs?.email || ''}</p>
                  <p className="text-sm text-gray-500">{complaint.staffs?.department || 'No Department'}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Assigned on: {moment(complaint.assigned_at).format('MMMM D, YYYY [at] h:mm A')}
                  </p>
                </div>
                
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    complaint.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                    complaint.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {complaint.status === 'ASSIGNED' ? 'Assigned' :
                     complaint.status === 'IN_PROGRESS' ? 'In Progress' :
                     complaint.status === 'COMPLETED' ? 'Completed' : 'Unknown'}
                  </span>
                </div>
              </div>
              
              {complaint.response && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes/Response</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap">
                    {complaint.response}
                  </div>
                </div>
              )}
              
              {(complaint.sentiment || complaint.ml_suggestion || complaint.estimated_resolve_time) && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">AI Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complaint.sentiment && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Sentiment</span>
                        <p className="mt-1 text-sm text-gray-800">{complaint.sentiment}</p>
                      </div>
                    )}
                    {complaint.estimated_resolve_time && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Estimated Resolution Time</span>
                        <p className="mt-1 text-sm text-gray-800">{complaint.estimated_resolve_time}</p>
                      </div>
                    )}
                    {complaint.ml_suggestion && (
                      <div className="md:col-span-2">
                        <span className="text-xs font-medium text-gray-500">Suggested Action</span>
                        <p className="mt-1 text-sm text-gray-800">{complaint.ml_suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {complaint.status === 'DROPPED' && (
            <Card title="Drop Information" className="mt-6">
              <div className="flex items-center mb-2">
                <FaTimesCircle className="text-red-500 mr-2" />
                <h3 className="font-medium text-gray-900">Complaint Dropped</h3>
              </div>
              <p className="text-sm text-gray-600">
                Dropped on: {moment(complaint.resolved_at).format('MMMM D, YYYY [at] h:mm A')}
              </p>
              
              {complaint.response && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Reason</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap">
                    {complaint.response}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
        
        <div>
          <Card title="Student Information">
            <div className="flex items-center mb-4">
              <FaUserGraduate className="text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-900">{complaint.students?.name || 'Student'}</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Student ID:</span>
                <span className="ml-2 text-gray-900">{complaint.students?.id_no || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 text-gray-900">{complaint.students?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Mobile:</span>
                <span className="ml-2 text-gray-900">{complaint.students?.mobile_no || 'N/A'}</span>
              </div>
            </div>
          </Card>
          
          <Card title="Timeline" className="mt-6">
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">Complaint Submitted</h4>
                  <p className="mt-1 text-xs text-gray-500">{moment(complaint.created_at).format('MMMM D, YYYY [at] h:mm A')}</p>
                </div>
              </div>
              
              {complaint.assigned_at && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserTie className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Assigned to Staff</h4>
                    <p className="mt-1 text-xs text-gray-500">{moment(complaint.assigned_at).format('MMMM D, YYYY [at] h:mm A')}</p>
                  </div>
                </div>
              )}
              
              {complaint.resolved_at && complaint.status === 'COMPLETED' && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Complaint Resolved</h4>
                    <p className="mt-1 text-xs text-gray-500">{moment(complaint.resolved_at).format('MMMM D, YYYY [at] h:mm A')}</p>
                  </div>
                </div>
              )}
              
              {complaint.resolved_at && complaint.status === 'DROPPED' && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTimesCircle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Complaint Dropped</h4>
                    <p className="mt-1 text-xs text-gray-500">{moment(complaint.resolved_at).format('MMMM D, YYYY [at] h:mm A')}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Drop Complaint Modal */}
      <Modal
        isOpen={dropModalOpen}
        onClose={() => setDropModalOpen(false)}
        title="Drop Complaint"
        size="md"
      >
        <div className="text-center mb-4">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Drop Complaint</h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to drop this complaint? This action will mark the complaint as not requiring further action.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="dropReason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for dropping *
          </label>
          <textarea
            id="dropReason"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Explain why this complaint is being dropped..."
            value={dropReason}
            onChange={(e) => setDropReason(e.target.value)}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="light"
            onClick={() => setDropModalOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDropComplaint}
            isLoading={actionLoading}
          >
            Drop Complaint
          </Button>
        </div>
      </Modal>
      
      {/* Assign Complaint Modal */}
      <AssignComplaintModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAssignComplaint}
        complaintId={complaint.id}
      />
    </div>
  );
};

export default ComplaintDetail;
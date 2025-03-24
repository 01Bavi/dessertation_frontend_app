import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ComplaintDetail from '../../components/complaint/ComplaintDetail';
import AssignComplaintModal from '../../components/complaint/AssignComplaintModal';
import Modal from '../../components/common/Modal';
import { getComplaintById, assignComplaint, dropComplaint } from '../../api/complaint';
import { getStaffList } from '../../api/staff';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropReason, setDropReason] = useState('');
  
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const getComplaintDetails = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id);
        setComplaint(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaint details');
        setLoading(false);
      }
    };

    getComplaintDetails();
  }, [id]);

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true);
      const { data } = await getStaffList({ status: 'active', role: 'handler' });
      setStaffList(data.slice(0, 3)); // Only get top 3 staff members
      setLoadingStaff(false);
    } catch (err) {
      setActionError('Failed to load staff list');
      setLoadingStaff(false);
    }
  };

  const handleAssignClick = () => {
    loadStaffList();
    setShowAssignModal(true);
  };

  const handleDropClick = () => {
    setShowDropModal(true);
  };

  const handleAssignSubmit = async (staffId) => {
    try {
      setProcessing(true);
      await assignComplaint(id, staffId);
      setActionSuccess('Complaint assigned successfully');
      setShowAssignModal(false);
      
      // Update complaint status
      setComplaint({
        ...complaint,
        status: 'assigned',
        assignedTo: staffList.find(staff => staff.id === staffId)
      });
      
      setProcessing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess('');
      }, 3000);
    } catch (err) {
      setActionError('Failed to assign complaint');
      setProcessing(false);
    }
  };

  const handleDropSubmit = async () => {
    if (!dropReason.trim()) {
      setActionError('Please provide a reason for dropping the complaint');
      return;
    }
    
    try {
      setProcessing(true);
      await dropComplaint(id, dropReason);
      setActionSuccess('Complaint dropped successfully');
      setShowDropModal(false);
      
      // Update complaint status
      setComplaint({
        ...complaint,
        status: 'dropped',
        dropReason: dropReason
      });
      
      setProcessing(false);
      setDropReason('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess('');
      }, 3000);
    } catch (err) {
      setActionError('Failed to drop complaint');
      setProcessing(false);
    }
  };

  const handleBackClick = () => {
    navigate('/complaints');
  };

  return (
    <Layout>
      <div className="px-6 py-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackClick}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Complaint Details</h1>
        </div>
        
        {actionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {actionSuccess}
          </div>
        )}
        
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {actionError}
            <button 
              className="float-right font-bold text-red-700" 
              onClick={() => setActionError('')}
            >
              &times;
            </button>
          </div>
        )}

        <Card>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-500">{error}</div>
          ) : complaint ? (
            <div className="p-6">
              <ComplaintDetail complaint={complaint} />
              
              {complaint.status === 'pending' && (
                <div className="mt-8 flex gap-4">
                  <Button 
                    onClick={handleAssignClick}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Assign Complaint
                  </Button>
                  <Button 
                    onClick={handleDropClick}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Drop Complaint
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">Complaint not found</div>
          )}
        </Card>
      </div>

      {/* Assign Complaint Modal */}
      <AssignComplaintModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        staffList={staffList}
        loading={loadingStaff}
        onAssign={handleAssignSubmit}
        processing={processing}
      />

      {/* Drop Complaint Modal */}
      <Modal
        isOpen={showDropModal}
        onClose={() => setShowDropModal(false)}
        title="Drop Complaint"
      >
        <div className="p-6">
          <p className="mb-4">Are you sure you want to drop this complaint? This action cannot be undone.</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Reason for dropping
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Enter reason for dropping the complaint"
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setShowDropModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDropSubmit}
              className="bg-red-600 hover:bg-red-700"
              loading={processing}
            >
              Drop Complaint
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ComplaintDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaBan, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStaffById, activateStaff, deactivateStaff, deleteStaff } from '../services/staff';
import { getComplaints } from '../services/complaint';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import moment from 'moment';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchStaffAndComplaints = async () => {
      try {
        setLoading(true);
        const staffData = await getStaffById(id);
        setStaff(staffData);
        
        // Fetch complaints assigned to this staff
        const complaintsData = await getComplaints(1, 100, '', '', null, id);
        setAssignedComplaints(complaintsData.data);
      } catch (error) {
        toast.error('Failed to fetch staff details');
        console.error('Error fetching staff details:', error);
        navigate('/staff');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaffAndComplaints();
  }, [id, navigate]);

  const handleDeleteStaff = async () => {
    try {
      setActionLoading(true);
      await deleteStaff(id);
      toast.success('Staff member deleted successfully');
      navigate('/staff');
    } catch (error) {
      toast.error(error.message || 'Failed to delete staff member');
    } finally {
      setActionLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setActionLoading(true);
      if (staff.is_active) {
        await deactivateStaff(id);
        toast.success('Staff member deactivated successfully');
      } else {
        await activateStaff(id);
        toast.success('Staff member activated successfully');
      }
      
      // Refresh staff data
      const updatedStaff = await getStaffById(id);
      setStaff(updatedStaff);
    } catch (error) {
      toast.error(error.message || `Failed to ${staff.is_active ? 'deactivate' : 'activate'} staff member`);
    } finally {
      setActionLoading(false);
      setStatusModalOpen(false);
    }
  };

  const complaintColumns = [
    {
      key: 'id',
      header: 'ID',
      width: '10%',
    },
    {
      key: 'title',
      header: 'Title',
      width: '30%',
    },
    {
      key: 'subject',
      header: 'Subject',
      width: '20%',
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      render: (complaint) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          complaint.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
          complaint.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
          complaint.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {complaint.status}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      width: '15%',
      render: (complaint) => moment(complaint.created_at).format('MMM D, YYYY'),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '10%',
      render: (complaint) => (
        <Link
          to={`/complaints/${complaint.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </Link>
      ),
    },
  ];

  if (loading) {
    return <Loading fullScreen text="Loading staff details..." />;
  }

  if (!staff) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Staff member not found</h2>
          <p className="mt-2 text-gray-500">The requested staff member does not exist or has been deleted.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/staff')}
            icon={<FaArrowLeft />}
          >
            Back to Staff
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
            onClick={() => navigate('/staff')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Details</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={staff.is_active ? 'warning' : 'success'}
            icon={staff.is_active ? <FaBan /> : <FaCheckCircle />}
            onClick={() => setStatusModalOpen(true)}
          >
            {staff.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          
          <Link to={`/staff/${id}/edit`}>
            <Button variant="secondary" icon={<FaEdit />}>
              Edit
            </Button>
          </Link>
          
          <Button
            variant="danger"
            icon={<FaTrash />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Staff ID</h3>
                <p className="mt-1 text-base text-gray-900">{staff.id_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">NIC Number</h3>
                <p className="mt-1 text-base text-gray-900">{staff.nic_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-base text-gray-900">{staff.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1 text-base text-gray-900">{moment(staff.date_of_birth).format('MMMM D, YYYY')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-base text-gray-900">{staff.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                <p className="mt-1 text-base text-gray-900">{staff.mobile_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-base text-gray-900">{staff.department || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
                <p className="mt-1 text-base text-gray-900">{staff.specialization || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.is_active ? (
                      <>
                        <FaCheckCircle className="mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                <p className="mt-1 text-base text-gray-900">{moment(staff.created_at).format('MMMM D, YYYY')}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Address Information">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-base text-gray-900">{staff.address || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">City</h3>
                <p className="mt-1 text-base text-gray-900">{staff.city || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">State</h3>
                <p className="mt-1 text-base text-gray-900">{staff.state || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Zip/Postal Code</h3>
                <p className="mt-1 text-base text-gray-900">{staff.zip || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Card title={`Assigned Complaints (${assignedComplaints.length})`} className="mb-6">
        {assignedComplaints.length > 0 ? (
          <Table
            columns={complaintColumns}
            data={assignedComplaints}
            onRowClick={(complaint) => navigate(`/complaints/${complaint.id}`)}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No complaints assigned to this staff member.
          </div>
        )}
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Staff"
        size="md"
      >
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Delete Staff Account</h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete {staff.name}'s account? This action cannot be undone.
            All data associated with this staff member will be permanently removed.
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              variant="light"
              onClick={() => setDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteStaff}
              isLoading={actionLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Status Change Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={staff.is_active ? "Deactivate Staff" : "Activate Staff"}
        size="md"
      >
        <div className="text-center">
          {staff.is_active ? (
            <FaBan className="mx-auto h-12 w-12 text-yellow-400" />
          ) : (
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
          )}
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {staff.is_active ? "Deactivate Staff Account" : "Activate Staff Account"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {staff.is_active 
              ? `Are you sure you want to deactivate ${staff.name}'s account? They will not be able to login or handle complaints.`
              : `Are you sure you want to activate ${staff.name}'s account? They will be able to login and handle complaints.`
            }
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              variant="light"
              onClick={() => setStatusModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={staff.is_active ? "warning" : "success"}
              onClick={handleToggleStatus}
              isLoading={actionLoading}
            >
              {staff.is_active ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffDetail;
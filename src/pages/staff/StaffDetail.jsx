import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BiArrowBack, 
  BiPencil, 
  BiTrash, 
  BiCheck, 
  BiX,
  BiEnvelope,
  BiPhone,
  BiCalendar,
  BiBriefcase,
  BiTask
} from 'react-icons/bi';
import { 
  getStaff, 
  updateStaffStatus, 
  deleteStaff 
} from '../../api/staff';
import Modal from '../../components/common/Modal';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff(id);
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await updateStaffStatus(id, newStatus);
      setStaff((prev) => ({
        ...prev,
        isActive: newStatus,
      }));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteStaff(id);
      navigate('/staff', { 
        state: { message: 'Staff member deleted successfully' } 
      });
    } catch (err) {
      console.error('Failed to delete staff:', err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 text-center">
          <p>{error || 'Staff member not found'}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate('/staff')}
          >
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/staff')}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <BiArrowBack className="mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Staff Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                {staff.avatar ? (
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-800">{staff.name}</h2>
                <p className="text-gray-600">{staff.staffId}</p>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      staff.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{staff.position}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/staff/${id}/edit`}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <BiPencil className="mr-1" /> Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <BiTrash className="mr-1" /> Delete
              </button>
              {staff.isActive ? (
                <button
                  onClick={() => handleStatusUpdate(false)}
                  disabled={statusUpdateLoading}
                  className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <BiX className="mr-1" /> Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(true)}
                  disabled={statusUpdateLoading}
                  className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50"
                >
                  <BiCheck className="mr-1" /> Activate
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <BiEnvelope className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{staff.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiPhone className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{staff.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Employment Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <BiBriefcase className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{staff.department}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiCalendar className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p>{staff.joinDate || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiTask className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Complaint Capacity</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (staff.activeComplaints / staff.maxComplaints) > 0.8 
                            ? 'bg-red-500' 
                            : (staff.activeComplaints / staff.maxComplaints) > 0.5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (staff.activeComplaints / staff.maxComplaints) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {staff.activeComplaints} of {staff.maxComplaints}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Assigned Complaints</h3>
          {staff.assignedComplaints && staff.assignedComplaints.length > 0 ? (
            <div className="space-y-4">
              {staff.assignedComplaints.map((complaint) => (
                <div key={complaint.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{complaint.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Student: {complaint.studentName} ({complaint.studentId})
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {complaint.description.length > 100 
                          ? `${complaint.description.substring(0, 100)}...` 
                          : complaint.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaint.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : complaint.status === 'inprogress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {complaint.status === 'inprogress' 
                        ? 'In Progress' 
                        : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No complaints are currently assigned to this staff member.</p>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <Modal
          title="Delete Staff Member"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-6">
            <p className="mb-4">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffDetail;
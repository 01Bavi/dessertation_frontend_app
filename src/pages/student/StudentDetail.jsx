
// src/pages/student/StudentDetail.jsx
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
  BiBookOpen
} from 'react-icons/bi';
import { 
  getStudent, 
  updateStudentStatus, 
  deleteStudent 
} from '../../api/student';
import Modal from '../../components/common/Modal';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const data = await getStudent(id);
      setStudent(data);
    } catch (err) {
      setError('Failed to load student details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await updateStudentStatus(id, newStatus);
      setStudent((prev) => ({
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
      await deleteStudent(id);
      navigate('/students', { 
        state: { message: 'Student deleted successfully' } 
      });
    } catch (err) {
      console.error('Failed to delete student:', err);
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

  if (error || !student) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 text-center">
          <p>{error || 'Student not found'}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate('/students')}
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/students')}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <BiArrowBack className="mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <BiUser className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                <p className="text-gray-600">{student.studentId}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    student.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/students/${id}/edit`}
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
              {student.isActive ? (
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <BiEnvelope className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{student.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiPhone className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{student.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiCalendar className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{student.dob || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <BiBookOpen className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p>{student.course}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BiCalendar className="mt-1 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Year of Admission</p>
                  <p>{student.admissionYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Complaint History</h3>
          {student.complaints && student.complaints.length > 0 ? (
            <div className="space-y-4">
              {student.complaints.map((complaint) => (
                <div key={complaint.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{complaint.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaint.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
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
            <p className="text-gray-500">No complaints filed by this student.</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Student"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to delete {student.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetail;
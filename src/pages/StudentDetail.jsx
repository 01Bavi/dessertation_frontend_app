import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaBan, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudentById, activateStudent, deactivateStudent, deleteStudent } from '../services/student';
import { getComplaints } from '../services/complaint';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import moment from 'moment';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchStudentAndComplaints = async () => {
      try {
        setLoading(true);
        const studentData = await getStudentById(id);
        setStudent(studentData);
        
        // Fetch complaints made by this student
        const complaintsData = await getComplaints(1, 100, '', '', id);
        setComplaints(complaintsData.data);
      } catch (error) {
        toast.error('Failed to fetch student details');
        console.error('Error fetching student details:', error);
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentAndComplaints();
  }, [id, navigate]);

  const handleDeleteStudent = async () => {
    try {
      setActionLoading(true);
      await deleteStudent(id);
      toast.success('Student deleted successfully');
      navigate('/students');
    } catch (error) {
      toast.error(error.message || 'Failed to delete student');
    } finally {
      setActionLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setActionLoading(true);
      if (student.is_active) {
        await deactivateStudent(id);
        toast.success('Student deactivated successfully');
      } else {
        await activateStudent(id);
        toast.success('Student activated successfully');
      }
      
      // Refresh student data
      const updatedStudent = await getStudentById(id);
      setStudent(updatedStudent);
    } catch (error) {
      toast.error(error.message || `Failed to ${student.is_active ? 'deactivate' : 'activate'} student`);
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
    return <Loading fullScreen text="Loading student details..." />;
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Student not found</h2>
          <p className="mt-2 text-gray-500">The requested student does not exist or has been deleted.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/students')}
            icon={<FaArrowLeft />}
          >
            Back to Students
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
            onClick={() => navigate('/students')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={student.is_active ? 'warning' : 'success'}
            icon={student.is_active ? <FaBan /> : <FaCheckCircle />}
            onClick={() => setStatusModalOpen(true)}
          >
            {student.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          
          <Link to={`/students/${id}/edit`}>
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
                <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                <p className="mt-1 text-base text-gray-900">{student.id_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">NIC Number</h3>
                <p className="mt-1 text-base text-gray-900">{student.nic_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-base text-gray-900">{student.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1 text-base text-gray-900">{moment(student.date_of_birth).format('MMMM D, YYYY')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-base text-gray-900">{student.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                <p className="mt-1 text-base text-gray-900">{student.mobile_no}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {student.is_active ? (
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
                <p className="mt-1 text-base text-gray-900">{moment(student.created_at).format('MMMM D, YYYY')}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Address Information">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-base text-gray-900">{student.address || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">City</h3>
                <p className="mt-1 text-base text-gray-900">{student.city || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">State</h3>
                <p className="mt-1 text-base text-gray-900">{student.state || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Zip/Postal Code</h3>
                <p className="mt-1 text-base text-gray-900">{student.zip || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Card title={`Complaints (${complaints.length})`} className="mb-6">
        {complaints.length > 0 ? (
          <Table
            columns={complaintColumns}
            data={complaints}
            onRowClick={(complaint) => navigate(`/complaints/${complaint.id}`)}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No complaints found for this student.
          </div>
        )}
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Student"
        size="md"
      >
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Delete Student Account</h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete {student.name}'s account? This action cannot be undone.
            All data associated with this student will be permanently removed.
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
              onClick={handleDeleteStudent}
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
        title={student.is_active ? "Deactivate Student" : "Activate Student"}
        size="md"
      >
        <div className="text-center">
          {student.is_active ? (
            <FaBan className="mx-auto h-12 w-12 text-yellow-400" />
          ) : (
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
          )}
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {student.is_active ? "Deactivate Student Account" : "Activate Student Account"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {student.is_active 
              ? `Are you sure you want to deactivate ${student.name}'s account? They will not be able to login or submit complaints.`
              : `Are you sure you want to activate ${student.name}'s account? They will be able to login and submit complaints.`
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
              variant={student.is_active ? "warning" : "success"}
              onClick={handleToggleStatus}
              isLoading={actionLoading}
            >
              {student.is_active ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetail;
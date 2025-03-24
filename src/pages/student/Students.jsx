import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, activateStudent, deactivateStudent, deleteStudent } from '../../api/student';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(-1); // -1: All, 1: Active, 0: Inactive
  
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getStudents(page, 10, searchTerm, activeFilter);
      
      if (response.error) {
        setError(response.error.message || 'Failed to fetch students');
      } else {
        setStudents(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching students');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, [page, activeFilter]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchStudents();
  };
  
  const handleActivate = async (id) => {
    try {
      const response = await activateStudent(id);
      
      if (response.error) {
        setError(response.error.message || 'Failed to activate student');
      } else {
        setSuccessMessage('Student activated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Update the student in the list
        setStudents(students.map(student => 
          student.id === id ? { ...student, is_active: true } : student
        ));
      }
    } catch (err) {
      setError(err.message || 'An error occurred while activating student');
    }
  };
  
  const handleDeactivate = async (id) => {
    try {
      const response = await deactivateStudent(id);
      
      if (response.error) {
        setError(response.error.message || 'Failed to deactivate student');
      } else {
        setSuccessMessage('Student deactivated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Update the student in the list
        setStudents(students.map(student => 
          student.id === id ? { ...student, is_active: false } : student
        ));
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deactivating student');
    }
  };
  
  const handleDelete = async (id) => {
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await deleteStudent(id);
      
      if (response.error) {
        setError(response.error.message || 'Failed to delete student');
      } else {
        setSuccessMessage('Student deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Remove the student from the list
        setStudents(students.filter(student => student.id !== id));
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting student');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Students</h1>
        
        <Link
          to="/student/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Student
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                className="border rounded-l-md px-3 py-2 w-full"
                placeholder="Search by name, ID, or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2">Filter:</label>
            <select
              className="border rounded-md px-3 py-2"
              value={activeFilter}
              onChange={(e) => setActiveFilter(parseInt(e.target.value))}
            >
              <option value="-1">All Students</option>
              <option value="1">Active Only</option>
              <option value="0">Inactive Only</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID No.</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Mobile</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3">{student.id_no}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.email}</td>
                    <td className="px-4 py-3">{student.mobile_no}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(student.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/student/edit/${student.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        
                        {student.is_active ? (
                          <button
                            onClick={() => handleDeactivate(student.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(student.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Activate
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="mx-2 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )};
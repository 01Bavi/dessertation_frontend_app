import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaFilter, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getStudents } from '../services/student';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(-1); // -1: All, 1: Active, 0: Inactive
  const [searching, setSearching] = useState(false);

  const fetchStudents = async (page = 1, search = '', isActive = -1) => {
    try {
      setLoading(true);
      const response = await getStudents(page, 10, search, isActive);
      setStudents(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchTerm, filterActive);
  }, [currentPage, filterActive]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearching(true);
    fetchStudents(1, searchTerm, filterActive);
  };

  const handleFilterChange = (value) => {
    setFilterActive(value);
    setCurrentPage(1);
  };

  const handleRowClick = (student) => {
    navigate(`/students/${student.id}`);
  };

  const columns = [
    {
      key: 'id_no',
      header: 'ID',
      width: '15%',
    },
    {
      key: 'name',
      header: 'Name',
      width: '25%',
    },
    {
      key: 'email',
      header: 'Email',
      width: '25%',
    },
    {
      key: 'mobile_no',
      header: 'Mobile',
      width: '15%',
    },
    {
      key: 'is_active',
      header: 'Status',
      width: '10%',
      render: (student) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          student.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
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
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '10%',
      render: (student) => (
        <div className="flex space-x-2 justify-end">
          <Link
            to={`/students/${student.id}`}
            className="text-blue-600 hover:text-blue-900"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <Link to="/students/new">
          <Button variant="primary" icon={<FaUserPlus />}>
            Add New Student
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by ID, name, or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
                disabled={searching}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Filter Dropdown */}
          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              value={filterActive}
              onChange={(e) => handleFilterChange(parseInt(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="-1">All Students</option>
              <option value="1">Active Only</option>
              <option value="0">Inactive Only</option>
            </select>
          </div>
        </div>
      </Card>

      {loading && !students.length ? (
        <Loading />
      ) : (
        <>
          <Table
            columns={columns}
            data={students}
            onRowClick={handleRowClick}
            isLoading={loading && students.length > 0}
          />
          
          {totalCount > 0 ? (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <div className="mt-2 text-sm text-gray-500 text-center">
                Showing {students.length} of {totalCount} students
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No students found. Try adjusting your search or filter.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Students;
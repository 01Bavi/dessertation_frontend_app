import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { getComplaints } from '../services/complaint';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import moment from 'moment';

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchComplaints = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const response = await getComplaints(page, 10, status, search);
      setComplaints(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchComplaints(currentPage, searchTerm, filterStatus);
  }, [currentPage, filterStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearching(true);
    fetchComplaints(1, searchTerm, filterStatus);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleRowClick = (complaint) => {
    navigate(`/complaints/${complaint.id}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'DROPPED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      width: '8%',
    },
    {
      key: 'title',
      header: 'Title',
      width: '25%',
    },
    {
      key: 'subject',
      header: 'Subject',
      width: '15%',
    },
    {
      key: 'students',
      header: 'Student',
      width: '15%',
      render: (complaint) => complaint.students?.name || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      render: (complaint) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(complaint.status)}`}>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/complaints/${complaint.id}`);
          }}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Complaints</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage student complaints and assign them to staff members
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by title, subject or body..."
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
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </div>
        </div>
      </Card>

      {loading && !complaints.length ? (
        <Loading />
      ) : (
        <>
          <Table
            columns={columns}
            data={complaints}
            onRowClick={handleRowClick}
            isLoading={loading && complaints.length > 0}
          />
          
          {totalCount > 0 ? (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <div className="mt-2 text-sm text-gray-500 text-center">
                Showing {complaints.length} of {totalCount} complaints
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No complaints found. Try adjusting your search or filter.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Complaints;
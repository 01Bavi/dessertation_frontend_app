import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ComplaintList from '../../components/complaint/ComplaintList';
import Pagination from '../../components/common/Pagination';
import Filter from '../../components/common/Filter';
import Card from '../../components/common/Card';
import { fetchComplaints } from '../../api/complaint';

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    date: ''
  });

  useEffect(() => {
    const getComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetchComplaints({
          page: currentPage,
          pageSize,
          ...filters
        });
        setComplaints(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaints');
        setLoading(false);
      }
    };

    getComplaints();
  }, [currentPage, pageSize, filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleComplaintClick = (id) => {
    navigate(`/complaints/${id}`);
  };

  const filterOptions = {
    status: [
      { value: '', label: 'All Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'assigned', label: 'Assigned' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'dropped', label: 'Dropped' }
    ],
    priority: [
      { value: '', label: 'All Priorities' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  };

  return (
    <Layout>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Complaints Management</h1>
        </div>
        
        <Card className="mb-6">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Filters</h2>
            <Filter 
              options={filterOptions} 
              filters={filters} 
              onFilter={handleFilter}
            />
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-500">{error}</div>
          ) : complaints.length === 0 ? (
            <div className="text-center p-6 text-gray-500">No complaints found</div>
          ) : (
            <>
              <ComplaintList 
                complaints={complaints} 
                onComplaintClick={handleComplaintClick} 
              />
              <div className="px-4 py-4 border-t border-gray-200">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Complaints;
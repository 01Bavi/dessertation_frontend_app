import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchComplaints, getComplaintStats } from '../../api/complaint';
import Stats from '../../components/dashboard/Stats';
import RecentComplaints from '../../components/dashboard/RecentComplaints';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    byStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getComplaints(page, 10, statusFilter, searchTerm);
      
      if (response.error) {
        setError(response.error.message || 'Failed to fetch complaints');
      } else {
        setComplaints(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching complaints');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    setStatsLoading(true);
    
    try {
      const response = await getComplaintStats();
      
      if (response.error) {
        console.error('Failed to fetch stats:', response.error);
      } else {
        setStats(response);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [page, statusFilter]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchComplaints();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        
        <div className="flex space-x-4">
          <Link
            to="/student"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Manage Students
          </Link>
          <Link
            to="/staff"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Manage Staff
          </Link>
        </div>
      </div>
      
      <Stats stats={stats} loading={statsLoading} />
      
      <RecentComplaints 
        complaints={complaints}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Dashboard;
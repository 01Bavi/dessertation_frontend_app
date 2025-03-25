import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaUserGraduate, FaUserTie, FaClock } from 'react-icons/fa';
import StatCard from '../components/dashboard/StatCard';
import ComplaintChart from '../components/dashboard/ComplaintChart';
import RecentComplaints from '../components/dashboard/RecentComplaints';
import { getComplaintStats, getComplaints } from '../services/complaint';
import { getStudents } from '../services/student';
import { getStaff } from '../services/staff';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch complaint stats
        const statsResponse = await getComplaintStats();
        setStats(statsResponse);
        
        // Fetch recent complaints
        const complaintsResponse = await getComplaints(1, 5);
        setRecentComplaints(complaintsResponse.data);
        
        // Fetch student count
        const studentsResponse = await getStudents(1, 1);
        setStudentCount(studentsResponse.totalCount);
        
        // Fetch staff count
        const staffResponse = await getStaff(1, 1);
        setStaffCount(staffResponse.totalCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={<FaClipboardList className="w-6 h-6" />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Complaints"
          value={stats?.byStatus?.PENDING || 0}
          icon={<FaClock className="w-6 h-6" />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Students"
          value={studentCount}
          icon={<FaUserGraduate className="w-6 h-6" />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Staff"
          value={staffCount}
          icon={<FaUserTie className="w-6 h-6" />}
          color="purple"
          isLoading={isLoading}
        />
      </div>
      
      {/* Charts and recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplaintChart stats={stats} isLoading={isLoading} />
        <RecentComplaints complaints={recentComplaints} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
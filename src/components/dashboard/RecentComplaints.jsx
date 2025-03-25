import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Card from '../common/Card';
import { FaCheckCircle, FaExclamationCircle, FaClock, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const RecentComplaints = ({ complaints, isLoading }) => {
  // Define status badges with colors and icons
  const statusBadge = (status) => {
    const badges = {
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <FaClock className="mr-1" />,
        text: 'Pending'
      },
      ASSIGNED: {
        color: 'bg-blue-100 text-blue-800',
        icon: <FaExclamationCircle className="mr-1" />,
        text: 'Assigned'
      },
      IN_PROGRESS: {
        color: 'bg-purple-100 text-purple-800',
        icon: <FaSpinner className="mr-1" />,
        text: 'In Progress'
      },
      COMPLETED: {
        color: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="mr-1" />,
        text: 'Completed'
      },
      DROPPED: {
        color: 'bg-red-100 text-red-800',
        icon: <FaTimesCircle className="mr-1" />,
        text: 'Dropped'
      }
    };
    
    const badge = badges[status] || badges.PENDING;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };
  
  if (isLoading) {
    return (
      <Card title="Recent Complaints" isLoading={true} />
    );
  }
  
  if (!complaints || complaints.length === 0) {
    return (
      <Card title="Recent Complaints">
        <div className="text-center py-4 text-gray-500">
          No complaints found
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Recent Complaints" headerAction={
      <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">
        View All
      </Link>
    }>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="py-4">
              <Link to={`/complaints/${complaint.id}`} className="block hover:bg-gray-50 -mx-5 px-5">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-medium text-gray-900 truncate">{complaint.title}</p>
                    <div className="mt-1">
                      <span className="text-sm text-gray-500 mr-3">
                        {complaint.students ? complaint.students.name : 'Student'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {moment(complaint.created_at).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div>
                    {statusBadge(complaint.status)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default RecentComplaints;
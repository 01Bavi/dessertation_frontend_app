import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Student Management
import Students from './pages/student/Students';
import CreateStudent from './pages/student/CreateStudent';
import EditStudent from './pages/student/EditStudent';

// Staff Management
import Staffs from './pages/staff/Staffs';
import CreateStaff from './pages/staff/CreateStaff';
// import EditStaff from './pages/staff/EditStaff';

// Complaint Management
import Complaints from './pages/complaint/Complaints';
import ComplaintDetail from './pages/complaint/ComplaintDetail';
//import AssignComplaint from './pages/complaint/AssignComplaint';
//import DropComplaint from './pages/complaint/DropComplaint';

// Not Found
//import NotFound from './pages/NotFound';

// Auth Middleware
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Student Routes */}
        <Route path="student">
          <Route index element={<Students />} />
          <Route path="create" element={<CreateStudent />} />
          <Route path="edit/:id" element={<EditStudent />} />
        </Route>
        
        {/* Staff Routes */}
        <Route path="staff">
          <Route index element={<Staffs />} />
          <Route path="create" element={<CreateStaff />} />
          <Route path="edit/:id" element={<EditStaff />} />
        </Route>
        
        {/* Complaint Routes */}
        <Route path="complaint">
          <Route index element={<Complaints />} />
          <Route path=":id" element={<ComplaintDetail />} />
          <Route path="assign/:id" element={<AssignComplaint />} />
          <Route path="drop/:id" element={<DropComplaint />} />
        </Route>
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

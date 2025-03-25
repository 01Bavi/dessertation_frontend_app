import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AppLayout from './layouts/AppLayout';
import Loading from './components/common/Loading';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const OtpVerification = lazy(() => import('./pages/OtpVerification'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const StudentDetail = lazy(() => import('./pages/StudentDetail'));
const StudentCreate = lazy(() => import('./pages/StudentCreate'));
const StudentEdit = lazy(() => import('./pages/StudentEdit'));
const Staff = lazy(() => import('./pages/Staff'));
const StaffDetail = lazy(() => import('./pages/StaffDetail'));
const StaffCreate = lazy(() => import('./pages/StaffCreate'));
const StaffEdit = lazy(() => import('./pages/StaffEdit'));
const Complaints = lazy(() => import('./pages/Complaints'));
const ComplaintDetail = lazy(() => import('./pages/ComplaintDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            
            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Student routes */}
              <Route path="students" element={<Students />} />
              <Route path="students/new" element={<StudentCreate />} />
              <Route path="students/:id" element={<StudentDetail />} />
              <Route path="students/:id/edit" element={<StudentEdit />} />
              
              {/* Staff routes */}
              <Route path="staff" element={<Staff />} />
              <Route path="staff/new" element={<StaffCreate />} />
              <Route path="staff/:id" element={<StaffDetail />} />
              <Route path="staff/:id/edit" element={<StaffEdit />} />
              
              {/* Complaint routes */}
              <Route path="complaints" element={<Complaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
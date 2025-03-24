// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { sendOtp, verifyOtp, logout } from '../api/auth';
import { useNotification } from '../contexts/NotificationContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { success, error: showError } = useNotification ? useNotification() : { success: () => {}, error: () => {} };

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, token, isAuthenticated, loading, error, setUser, setToken, setIsAuthenticated, setLoading, setError } = context;

  const handleSendOtp = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendOtp(email);
      if (response.success) {
        success('OTP has been sent to your email.');
        return true;
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
        showError(response.message || 'Failed to send OTP. Please try again.');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      showError(err.message || 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await verifyOtp(email, otp);
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        
        success('Login successful!');
        return true;
      } else {
        setError('Invalid OTP. Please try again.');
        showError('Invalid OTP. Please try again.');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      showError(err.message || 'Invalid OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      success('Logged out successfully.');
      return true;
    } catch (err) {
      showError('Failed to log out. Please try again.');
      console.error('Logout error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleVerifyOtp,
    logout: handleLogout,
    sendOtp: handleSendOtp,
    updateUser
  };
};

export default useAuth;
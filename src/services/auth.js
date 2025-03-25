import axiosInstance from '../utils/axiosInstance';

export const sendOtp = async (email) => {
  try {
    const response = await axiosInstance.post('/api/admin/auth/send-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post('/api/admin/auth/check-otp', { email, otp });
    // Store the token and user info
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      }));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
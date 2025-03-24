import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/auth/send-otp`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/auth/check-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }

};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/auth/logout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
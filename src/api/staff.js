import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getStaffs = async (page = 1, limit = 10, search = '', isActive = -1) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('search', search);
    params.append('is_active', isActive);
    
    const response = await axios.get(
      `${API_URL}/api/admin/staff/all?${params.toString()}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStaffById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/staff/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/staff/new`,
      staffData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateStaff = async (staffData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/staff/edit`,
      staffData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/staff/delete`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const activateStaff = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/staff/activate`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deactivateStaff = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/staff/deactivate`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
import axiosInstance from '../utils/axiosInstance';

export const getStaff = async (page = 1, limit = 10, search = '', isActive = -1) => {
  try {
    const response = await axiosInstance.get('/api/admin/staffs/all', {
      params: { page, limit, search, is_active: isActive }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getStaffById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/staffs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await axiosInstance.post('/api/admin/staffs/new', staffData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const updateStaff = async (staffData) => {
  try {
    const response = await axiosInstance.post('/api/admin/staffs/edit', staffData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/staffs/delete', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const activateStaff = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/staffs/activate', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deactivateStaff = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/staffs/deactivate', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
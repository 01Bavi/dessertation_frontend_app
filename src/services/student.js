import axiosInstance from '../utils/axiosInstance';

export const getStudents = async (page = 1, limit = 10, search = '', isActive = -1) => {
  try {
    const response = await axiosInstance.get('/api/admin/students/all', {
      params: { page, limit, search, is_active: isActive }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post('/api/admin/students/new', studentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const updateStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post('/api/admin/students/edit', studentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/students/delete', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const activateStudent = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/students/activate', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deactivateStudent = async (id) => {
  try {
    const response = await axiosInstance.post('/api/admin/students/deactivate', { id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
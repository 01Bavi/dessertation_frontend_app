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

export const getStudents = async (page = 1, limit = 10, search = '', isActive = -1) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('search', search);
    params.append('is_active', isActive);
    
    const response = await axios.get(
      `${API_URL}/api/admin/students/all?${params.toString()}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/students/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/students/new`,
      studentData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/students/edit`,
      studentData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/students/delete`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const activateStudent = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/students/activate`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deactivateStudent = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/students/deactivate`,
      { id },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
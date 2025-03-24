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

export const fetchComplaints  = async (page = 1, limit = 10, status = '', search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await axios.get(
      `${API_URL}/api/admin/complaints/all?${params.toString()}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getComplaintById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/complaints/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getComplaintStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/complaints/stats`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignComplaint = async (complaintId, staffId, note) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/complaints/assign`,
      {
        complaint_id: complaintId,
        staff_id: staffId,
        note: note
      },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const dropComplaint = async (complaintId, reason) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/complaints/drop`,
      {
        complaint_id: complaintId,
        reason: reason
      },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStaffList = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/complaints/staffs`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
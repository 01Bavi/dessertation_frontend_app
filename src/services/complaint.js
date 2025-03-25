import axiosInstance from '../utils/axiosInstance';

export const getComplaints = async (page = 1, limit = 10, status = '', search = '', studentId = null, assignedStaffId = null) => {
  try {
    const response = await axiosInstance.get('/api/admin/complaints/all', {
      params: { 
        page, 
        limit, 
        status, 
        search,
        student_id: studentId, 
        assigned_staff_id: assignedStaffId 
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getComplaintById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/complaints/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getAvailableStaff = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/complaints/staffs');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const assignComplaint = async (complaintId, staffId, note = '') => {
  try {
    const response = await axiosInstance.post('/api/admin/complaints/assign', {
      complaint_id: complaintId,
      staff_id: staffId,
      note
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const dropComplaint = async (complaintId, reason) => {
  try {
    const response = await axiosInstance.post('/api/admin/complaints/drop', {
      complaint_id: complaintId,
      reason
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getComplaintStats = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/complaints/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
// src/pages/staff/CreateStaff.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStaff } from '../../api/staff';

const CreateStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    staffId: '',
    department: '',
    position: '',
    phone: '',
    joinDate: '',
    maxComplaints: 10,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.staffId) newErrors.staffId = 'Staff ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createStaff(formData);
      navigate('/staffs', {
        state: { message: 'Staff member created successfully' }
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to create staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/staffs')}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Staff</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
                Staff ID *
              </label>
              <input
                type="text"
                id="staffId"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.staffId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.staffId && <div className="mt-1 text-sm text-red-600">{errors.staffId}</div>}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a department</option>
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Technical">Technical</option>
                <option value="Support">Support</option>
                <option value="Facilities">Facilities</option>
              </select>
              {errors.department && <div className="mt-1 text-sm text-red-600">{errors.department}</div>}
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.position && <div className="mt-1 text-sm text-red-600">{errors.position}</div>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                Join Date
              </label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="maxComplaints" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Complaints *
              </label>
              <input
                type="number"
                id="maxComplaints"
                name="maxComplaints"
                min="1"
                max="50"
                value={formData.maxComplaints}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-1 text-sm text-gray-500">
                Maximum number of complaints this staff member can handle at once
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active Staff
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/staffs')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;

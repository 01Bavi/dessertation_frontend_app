import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const StudentForm = ({ student, onSubmit, isLoading, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    batch: '',
    phoneNumber: '',
    address: '',
    profilePicture: null,
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Initialize form data when student prop changes (in edit mode)
  useEffect(() => {
    if (student && isEditMode) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        studentId: student.studentId || '',
        department: student.department || '',
        batch: student.batch || '',
        phoneNumber: student.phoneNumber || '',
        address: student.address || '',
        profilePicture: null,
        password: '',
        confirmPassword: '',
      });
      
      // Set profile picture preview
      if (student.profilePictureUrl) {
        setPreviewUrl(student.profilePictureUrl);
      }
    }
  }, [student, isEditMode]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.batch) newErrors.batch = 'Batch is required';
    
    // Phone validation
    if (formData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }
    
    // Password validation (only in create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create FormData object to handle file upload
    const submitData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'profilePicture') {
        if (formData.profilePicture) {
          submitData.append(key, formData.profilePicture);
        }
      } else if (key !== 'confirmPassword') {
        // Don't include confirmPassword in API submission
        submitData.append(key, formData[key]);
      }
    });
    
    // Add student ID if in edit mode
    if (isEditMode && student?.id) {
      submitData.append('id', student.id);
    }
    
    onSubmit(submitData);
  };
  
  const departmentOptions = [
    { value: '', label: 'Select Department' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'CS', label: 'Computer Science' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'ECE', label: 'Electronics & Communication' }
  ];
  
  const batchOptions = [
    { value: '', label: 'Select Batch' },
    { value: '2020-2024', label: '2020-2024' },
    { value: '2021-2025', label: '2021-2025' },
    { value: '2022-2026', label: '2022-2026' },
    { value: '2023-2027', label: '2023-2027' },
    { value: '2024-2028', label: '2024-2028' }
  ];
  
  return (
    <Card className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="text-center">
                <div className="mb-4">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <label htmlFor="profilePicture" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Photo
                  </label>
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  disabled={isEditMode} // Email cannot be changed in edit mode
                />
                
                <Input
                  id="studentId"
                  name="studentId"
                  label="Student ID"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  error={errors.studentId}
                  required
                  disabled={isEditMode} // Student ID cannot be changed in edit mode
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`shadow-sm block w-full sm:text-sm rounded-md ${
                      errors.department 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  >
                    {departmentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                    Batch<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className={`shadow-sm block w-full sm:text-sm rounded-md ${
                      errors.batch 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  >
                    {batchOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.batch && (
                    <p className="mt-1 text-sm text-red-600">{errors.batch}</p>
                  )}
                </div>
              </div>
              
              <Input
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
              />
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          {!isEditMode && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Account Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required={!isEditMode}
                  helperText="Password must be at least 8 characters"
                />
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  required={!isEditMode}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditMode ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StudentForm;
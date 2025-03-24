import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const ProfileForm = ({ profile, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    bio: '',
    profilePicture: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Initialize form data when profile prop changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        department: profile.department || '',
        designation: profile.designation || '',
        bio: profile.bio || '',
        profilePicture: null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Set profile picture preview
      if (profile.profilePictureUrl) {
        setPreviewUrl(profile.profilePictureUrl);
      }
    }
  }, [profile]);
  
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
    
    // Validate profile info
    if (activeTab === 'profile') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (formData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number is invalid';
      }
    }
    
    // Validate password change
    if (activeTab === 'password') {
      if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.newPassword !== formData.confirmPassword) {
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
    
    if (activeTab === 'profile') {
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('department', formData.department);
      submitData.append('designation', formData.designation);
      submitData.append('bio', formData.bio);
      
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }
      
      onSave(submitData, 'profile');
    } else if (activeTab === 'password') {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      onSave(passwordData, 'password');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
    
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    if (profile) {
      // Reset form to original profile data
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        department: profile.department || '',
        designation: profile.designation || '',
        bio: profile.bio || '',
        profilePicture: null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      if (profile.profilePictureUrl) {
        setPreviewUrl(profile.profilePictureUrl);
      } else {
        setPreviewUrl('');
      }
    }
    
    setErrors({});
    setIsEditing(false);
  };
  
  return (
    <Card>
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            type="button"
            className={`pb-4 text-sm font-medium ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            type="button"
            className={`pb-4 text-sm font-medium ${
              activeTab === 'password' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {activeTab === 'profile' && (
          <div className="space-y-6">
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
                  
                  {isEditing && (
                    <div className="mt-2">
                      <label htmlFor="profilePicture" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Change Photo
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
                  )}
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
                  disabled={!isEditing}
                  required
                />
                
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  disabled={!isEditing}
                  required
                />
                
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                  disabled={!isEditing}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="department"
                    name="department"
                    label="Department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    id="designation"
                    name="designation"
                    label="Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className={`shadow-sm block w-full sm:text-sm rounded-md ${
                      isEditing 
                        ? 'focus:ring-blue-500 focus:border-blue-500 border-gray-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'password' && (
          <div className="space-y-6 max-w-lg">
            <Input
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              error={errors.currentPassword}
              disabled={!isEditing}
              required
            />
            
            <Input
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              disabled={!isEditing}
              required
              helperText="Password must be at least 8 characters"
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              disabled={!isEditing}
              required
            />
          </div>
        )}
        
        <div className="mt-8 flex justify-end space-x-3">
          {!isEditing ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;
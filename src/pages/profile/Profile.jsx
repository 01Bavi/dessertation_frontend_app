import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProfileForm from '../../components/profile/ProfileForm';
import { fetchAdminProfile, updateAdminProfile, changePassword } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminProfile();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile details');
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setFormError('');
      const updatedProfile = await updateAdminProfile(updatedData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      
      // Update the user context if needed
      updateUser({
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setFormError('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('New password and confirmation do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setFormError('');
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password changed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setFormError('Failed to change password. Please check your current password.');
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setFormError('');
  };

  return (
    <Layout>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Card>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : profile ? (
            <div className="p-6">
              {!isEditing && !isChangingPassword ? (
                <div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {profile.profilePicture ? (
                        <img 
                          src={profile.profilePicture} 
                          alt="Profile" 
                          className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                          {profile.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                      <p className="text-gray-600">System Administrator</p>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile.phone || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Last Login</p>
                          <p className="font-medium">
                            {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Account Created</p>
                          <p className="font-medium">
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-4">
                        <Button 
                          onClick={handleEdit}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Edit Profile
                        </Button>
                        <Button 
                          onClick={handlePasswordChange}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isEditing ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
                  
                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {formError}
                    </div>
                  )}
                  
                  <ProfileForm 
                    profile={profile} 
                    onSubmit={handleProfileUpdate} 
                    onCancel={handleCancel}
                  />
                </div>
              ) : isChangingPassword ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                  
                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {formError}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Update Password
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">Profile not found</div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
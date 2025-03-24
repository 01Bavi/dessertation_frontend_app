import React, { useState } from 'react';
import { verifyOtp } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const OtpForm = ({ email, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await verifyOtp(email, otp);
      
      if (response.error) {
        setError(response.error.message || 'Invalid OTP');
      } else {
        // Store token and user info in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          role: 'admin'
        }));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="otp">
          Enter OTP sent to {email}
        </label>
        <input
          id="otp"
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      
      <button
        type="button"
        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
        onClick={onBack}
      >
        Back
      </button>
    </form>
  );
};

export default OtpForm;
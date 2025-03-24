import React, { useState } from 'react';
import { sendOtp } from '../../api/auth';

const LoginForm = ({ onOtpSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await sendOtp(email);
      if (response.error) {
        setError(response.error.message || 'Failed to send OTP');
      } else {
        onOtpSent(email);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
    </form>
  );
};

export default LoginForm;
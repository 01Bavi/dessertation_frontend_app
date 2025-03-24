// src/pages/auth/Otp.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const refs = Array(6).fill(0).map(() => useRef(null));
  const navigate = useNavigate();
  const { login, sendOtp } = useAuth();
  const email = sessionStorage.getItem('userEmail');

  useEffect(() => {
    // Focus first input on mount
    refs[0].current?.focus();
    
    // Start countdown for resend OTP
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [resendDisabled]);

  useEffect(() => {
    // Redirect to login if no email in storage
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus last input after paste
      refs[5].current?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      await sendOtp(email);
      setResendDisabled(true);
      setCountdown(30);
      setError('');
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    try {
      setLoading(true);
      const success = await login(email, otpValue);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter OTP</h2>
        
        {email && (
          <p className="text-center text-gray-600 mb-6">
            Please enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="flex justify-center space-x-2 sm:space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={refs[index]}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <button 
              type="submit" 
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="text-sm text-gray-600">
              {resendDisabled ? (
                <p>Resend OTP in {countdown} seconds</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
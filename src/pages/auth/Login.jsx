import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import OtpForm from '../../components/auth/OtpForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const handleOtpSent = (email) => {
    setEmail(email);
    setOtpSent(true);
  };
  
  const handleBack = () => {
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
        
        {!otpSent ? (
          <LoginForm onOtpSent={handleOtpSent} />
        ) : (
          <OtpForm email={email} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default Login;
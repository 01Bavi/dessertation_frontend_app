import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { verifyOtp, sendOtp } from '../services/auth';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { FaKey, FaArrowLeft } from 'react-icons/fa';

const OtpVerification = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get the email from localStorage
    const storedEmail = localStorage.getItem('tempEmail');
    if (!storedEmail) {
      toast.error('Please enter your email first');
      navigate('/login');
      return;
    }
    setEmail(storedEmail);

    // Clean up function to remove the countdown timer
    return () => {
      if (countdown > 0) {
        clearInterval(countdownInterval);
      }
    };
  }, [navigate]);

  useEffect(() => {
    let countdownInterval;
    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            setResendDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdown]);

  // Validation schema
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required('OTP is required')
      .matches(/^[0-9]+$/, 'OTP must only contain numbers')
      .min(6, 'OTP must be at least 6 digits')
      .max(6, 'OTP cannot be more than 6 digits'),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await verifyOtp(email, values.otp);
      
      if (response.token) {
        login({
          id: response.id,
          name: response.name,
          email: response.email,
        });
        
        toast.success('Login successful!');
        // Remove the temporary email from localStorage
        localStorage.removeItem('tempEmail');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      await sendOtp(email);
      toast.success('OTP resent successfully! Check your email.');
      setCountdown(60); // Disable resend for 60 seconds
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
      setResendDisabled(false);
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('tempEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the OTP sent to <span className="font-medium text-blue-600">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ otp: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="otp"
                      name="otp"
                      type="text"
                      autoComplete="one-time-code"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="123456"
                    />
                  </div>
                  <ErrorMessage name="otp" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isSubmitting}
                  >
                    Verify & Login
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <FaArrowLeft className="mr-1" /> Back to Login
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    className={`text-sm ${
                      resendDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Resend OTP'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
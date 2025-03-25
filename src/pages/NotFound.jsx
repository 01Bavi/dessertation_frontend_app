import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <FaExclamationTriangle className="mx-auto h-16 w-16 text-yellow-400" />
        <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">404</h1>
        <h2 className="text-center text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaArrowLeft className="mr-2" />
            Go back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
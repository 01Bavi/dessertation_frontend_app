// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, getUser } from '../utils/storage';

// Create Auth Context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load auth state from storage when component mounts
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = getAuthToken();
        const storedUser = getUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Auth context value
  const contextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    setUser,
    setToken,
    setIsAuthenticated,
    setLoading,
    setError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/api';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  username: '',
  get_username: () => {},
  logout: () => {}, // Add logout placeholder
  loading: true, // Add loading state
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); // Track initial auth check

  // Function to clear auth state
  const clearAuth = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    setUsername('');
  };

  const checkAuthAndFetchUser = useCallback(async () => {
    // console.log("checkAuthAndFetchUser called"); // Debug log
    const token = localStorage.getItem('access');
    let authenticated = false;
    let fetchedUsername = '';

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        if (expiry_date >= current_time) {
          // Token exists and is not expired
          authenticated = true;
          try {
            const response = await api.get('/get_username'); // Use root path if needed
            fetchedUsername = response.data.username;
          } catch (error) {
            console.error("Error fetching username:", error.response ? error.response.data : error.message);
            authenticated = false; // Mark as not authenticated
            clearAuth(); // Clear invalid token
          }
        } else {
          console.log("Token expired.");
          clearAuth();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        clearAuth(); // Clear invalid token
      }
    } else {
        if (isAuthenticated) setIsAuthenticated(false);
        if (username) setUsername('');
    }

    // Update state based on checks
    setIsAuthenticated(authenticated);
    setUsername(fetchedUsername);
    setLoading(false); // Mark initial check as complete
  }, [isAuthenticated, username]); // Dependencies to ensure state updates correctly

  // Run the check on initial component mount
  useEffect(() => {
    setLoading(true);
    checkAuthAndFetchUser();
  }, [checkAuthAndFetchUser]); // Dependency array includes the function itself

  // Logout function
  const logout = () => {
    clearAuth();
    console.log("User logged out.");
  };

  // Expose necessary values and functions
  const authValue = {
    isAuthenticated,
    setIsAuthenticated, // Still needed by Login/Register to trigger state change
    username,
    get_username: checkAuthAndFetchUser, // Expose function to refresh username
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
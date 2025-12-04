import React, { createContext, useEffect, useState, useCallback } from 'react'; // Added useCallback
import { jwtDecode } from 'jwt-decode';
import api from '@/api'; // Your configured axios instance with interceptor

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

  // --- Combined checkAuth and get_username ---
  // useCallback prevents recreating the function on every render
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
            // --- Fetch username ONLY if token seems valid ---
            // The 'api' interceptor will add the token header automatically
            const response = await api.get('/get_username'); // Use root path if needed
            fetchedUsername = response.data.username;
            // console.log("Username fetched successfully:", fetchedUsername); // Debug log
          } catch (error) {
            // Error fetching username even with a seemingly valid token
            console.error("Error fetching username:", error.response ? error.response.data : error.message);
            // This might happen if the token is invalid on the server side (e.g., blacklisted)
            authenticated = false; // Mark as not authenticated
            clearAuth(); // Clear invalid token
          }
        } else {
          console.log("Token expired.");
          // --- Optional: Implement token refresh logic here ---
          // If refresh fails or isn't implemented, clear auth
          clearAuth();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        clearAuth(); // Clear invalid token
      }
    } else {
        // console.log("No access token found."); // Debug log
        // Ensure state reflects logged out status if no token
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
    setLoading(true); // Start loading on mount
    checkAuthAndFetchUser();
  }, [checkAuthAndFetchUser]); // Dependency array includes the function itself

  // Logout function
  const logout = () => {
    clearAuth();
    // Optionally redirect user after logout
    // navigate('/login');
    console.log("User logged out.");
  };

  // Expose necessary values and functions
  const authValue = {
    isAuthenticated,
    setIsAuthenticated, // Still needed by Login/Register to trigger state change
    username,
    get_username: checkAuthAndFetchUser, // Renamed function call
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={authValue}>
      {/* Only render children when initial check is done */}
      {!loading ? children : null /* Or show a loading spinner */}
    </AuthContext.Provider>
  );
}
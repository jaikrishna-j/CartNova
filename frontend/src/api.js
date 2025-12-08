import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Prefer runtime-configurable API base URL via env (Vite uses VITE_ prefix)
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: BASE_URL,
});

// --- Request Interceptor ---
// This code runs BEFORE each request using the 'api' instance is sent.
// It's responsible for adding the Authorization header.
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("access");

    if (token) {
      try {
        // 2. Decode to check expiry (optional but good practice)
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        // 3. If token exists and is not expired, add the header
        if (expiry_date > current_time) {
          config.headers.Authorization = `Bearer ${token}`;
          // console.log("Interceptor adding token:", token); // Uncomment for debugging
        } else {
          // Optional: Handle expired token case here (e.g., try refreshing)
          console.log("Token found but expired.");
          // You might want to remove the expired token from localStorage
          // localStorage.removeItem("access");
          // localStorage.removeItem("refresh");
          // Potentially redirect to login or attempt refresh here
        }
      } catch (error) {
         console.error("Error decoding token:", error);
         // Handle cases where the token is invalid
         localStorage.removeItem("access");
         localStorage.removeItem("refresh");
         // Potentially redirect to login
      }
    } else {
        // console.log("No token found in localStorage."); // Uncomment for debugging
    }
    // 4. Return the (potentially modified) request config
    return config;
  },
  (error) => {
    // Handle errors during request setup
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (useful for handling token refresh later)
// api.interceptors.response.use(...)

export default api;
import axios from 'axios';

/**
 * Reusable Axios instance with base configuration.
 *
 * Usage:
 *   import api from '@/services/api';
 *   const { data } = await api.get('/health');
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// =====================================================
// Request Interceptor
// =====================================================
api.interceptors.request.use(
  (config) => {
    // Attach auth token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// Response Interceptor
// =====================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized — clear stored token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (status === 403) {
        // Forbidden
        console.error('Access denied');
      }

      if (status === 500) {
        console.error('Server error');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

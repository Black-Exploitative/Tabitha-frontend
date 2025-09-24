// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('th_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Handle 304 Not Modified responses
    if (response.status === 304) {
      console.log('Received 304 Not Modified, using cached data');
      // For 304 responses, axios typically includes the cached data
      return response.data || response;
    }
    
    // Return the full response data for successful requests
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle specific error codes
    switch (status) {
      case 400:
        toast.error(data?.message || 'Bad request.');
        break;
        
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('th_token');
        localStorage.removeItem('th_user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
          toast.error('Session expired. Please login again.');
        }
        break;
      
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      
      case 404:
        // Don't show toast for 404s as they're often handled by components
        break;
      
      case 422:
        // Validation errors
        if (data?.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => toast.error(err.msg || err.message));
        } else {
          toast.error(data?.message || 'Validation error.');
        }
        break;
      
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      
      default:
        // Don't show toast for other errors as they might be handled by components
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
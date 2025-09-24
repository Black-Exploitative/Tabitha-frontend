// src/services/auth.js - Enhanced error handling
import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await api.post('/auth/login', credentials);
      
      // Handle different response structures
      const token = response.token;
      const user = response.data?.user || response.user;
      
      if (!token || !user) {
        console.error('Invalid login response:', response);
        throw new Error('Invalid login response');
      }
      
      // Store with consistent key names
      localStorage.setItem('th_token', token);
      localStorage.setItem('th_user', JSON.stringify(user));
      
      console.log('Login successful');
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // Create staff account (admin only)
  createStaffAccount: async (staffData) => {
    try {
      console.log('Creating staff account:', { email: staffData.email });
      
      const response = await api.post('/auth/createStaffAccount', staffData);
      console.log('Staff creation response:', response);
      
      return response.data?.user || response.user;
    } catch (error) {
      console.error('Staff creation error:', error);
      
      // Handle validation errors specifically
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationMessages = errorData.errors.map(err => err.message || err.msg).join(', ');
          throw new Error(`Validation failed: ${validationMessages}`);
        }
        throw new Error(errorData.message || 'Invalid request data');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to create staff account');
    }
  },

  // Get current user (API call to verify token)
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data?.user || response.user;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  // Other methods remain the same...
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('th_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('th_token');
      localStorage.removeItem('th_user');
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await api.patch('/auth/updateMe', updates);
      const updatedUser = response.data?.user || response.user;
      
      localStorage.setItem('th_user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.patch('/auth/updatePassword', passwordData);
      return response.data || response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password update failed');
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('th_token');
    const user = localStorage.getItem('th_user');
    return !!(token && user);
  },

  getToken: () => {
    return localStorage.getItem('th_token');
  }
};

export default authService;
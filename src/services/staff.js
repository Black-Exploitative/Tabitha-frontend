// src/services/staff.js - Fixed to handle different response scenarios
import api from './api';

export const staffService = {
  // Get all staff with optional filters
  getStaff: async (params = {}) => {
    try {
      const response = await api.get('/staff', { params });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff');
    }
  },

  // Get staff member by ID - Fixed to handle cached responses
  getStaffById: async (id) => {
    try {
      console.log(`Fetching staff with ID: ${id}`);
      
      const response = await api.get(`/staff/${id}`, {
        // Add cache busting headers
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Staff API response:', response);
      
      // Handle different response structures
      if (response.status === 'success' && response.data) {
        if (response.data.staff) {
          // Backend returns: { status: 'success', data: { staff: {...} } }
          return { data: response.data.staff };
        } else if (response.data) {
          // Backend returns: { status: 'success', data: {...} }
          return { data: response.data };
        }
      }
      
      // Fallback - if response has direct data
      if (response.data) {
        return { data: response.data };
      }
      
      throw new Error('Invalid response structure');
      
    } catch (error) {
      console.error('Staff service error:', error);
      
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown error';
        
        switch (status) {
          case 404:
            throw new Error('Staff member not found');
          case 400:
            throw new Error('Invalid staff ID format');
          case 403:
            throw new Error('You do not have permission to view this staff member');
          case 500:
            throw new Error('Server error while fetching staff member');
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error('Unable to connect to server');
      } else {
        throw new Error(error.message || 'Failed to fetch staff member');
      }
    }
  },

  // Update staff member
  updateStaff: async (id, updates) => {
    try {
      const response = await api.patch(`/staff/${id}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update staff member');
    }
  },

  // Deactivate staff member
  deactivateStaff: async (id) => {
    try {
      const response = await api.delete(`/staff/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate staff member');
    }
  },

  // Get staff statistics
  getStaffStats: async () => {
    try {
      const response = await api.get('/staff/stats');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff statistics');
    }
  },

  // Update staff permissions (admin only)
  updateStaffPermissions: async (id, permissionData) => {
    try {
      const response = await api.patch(`/staff/${id}/permissions`, permissionData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update permissions');
    }
  }
};

export default staffService;
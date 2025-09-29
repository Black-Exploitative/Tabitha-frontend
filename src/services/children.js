// src/services/children.js - Fixed token key
import api from './api'; // Use the main api service instead

export const childrenService = {
  // Get all children with optional filters
  getChildren: async (params = {}) => {
    try {
      const response = await api.get('/children', { params });
      // Handle nested response structure
      return response.data?.children || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch children');
    }
  },

  // Get child by ID
  getChild: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      // Handle nested response structure
      return response.data?.child || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch child');
    }
  },

  // Create new child
  createChild: async (childData) => {
    try {
      // Transform data to match backend expectations
      const transformedData = {
        ...childData,
        // Ensure arrays are properly formatted
        allergies: Array.isArray(childData.allergies) ? childData.allergies : 
                  (childData.allergies ? [childData.allergies] : []),
        medical_conditions: Array.isArray(childData.medical_conditions) ? childData.medical_conditions : 
                           (childData.medical_conditions ? [{ 
                             condition: childData.medical_conditions,
                             diagnosed_date: new Date(),
                             current_treatment: '',
                             notes: ''
                           }] : [])
      };
      
      const response = await api.post('/children', transformedData);
      return response.data?.child || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create child record');
    }
  },

  // Update child
  updateChild: async (id, updates) => {
    try {
      // Transform data to match backend expectations
      const transformedData = {
        ...updates,
        // Ensure arrays are properly formatted
        allergies: Array.isArray(updates.allergies) ? updates.allergies : 
                  (updates.allergies ? [updates.allergies] : []),
        medical_conditions: Array.isArray(updates.medical_conditions) ? updates.medical_conditions : 
                           (updates.medical_conditions ? [{ 
                             condition: updates.medical_conditions,
                             diagnosed_date: new Date(),
                             current_treatment: '',
                             notes: ''
                           }] : [])
      };
      
      const response = await api.patch(`/children/${id}`, transformedData);
      return response.data?.child || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update child');
    }
  },

  // Delete child
  deleteChild: async (id) => {
    try {
      const response = await api.delete(`/children/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete child');
    }
  },

  // Search children
  searchChildren: async (query) => {
    try {
      const response = await api.get('/children/search', { params: { q: query } });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  // Get child statistics
  getChildStats: async () => {
    try {
      const response = await api.get('/children/stats');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  // Upload child photo
  uploadPhoto: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post(`/children/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Photo upload failed');
    }
  }
};

export default childrenService;
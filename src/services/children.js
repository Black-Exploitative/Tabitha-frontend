// src/services/children.js - Fixed token key
import api from './api'; // Use the main api service instead

export const childrenService = {
  // Get all children with optional filters
  getChildren: async (params = {}) => {
    try {
      const response = await api.get('/children', { params });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch children');
    }
  },

  // Get child by ID
  getChild: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch child');
    }
  },

  // Create new child
  createChild: async (childData) => {
    try {
      const response = await api.post('/children', childData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create child record');
    }
  },

  // Update child
  updateChild: async (id, updates) => {
    try {
      const response = await api.patch(`/children/${id}`, updates);
      return response;
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
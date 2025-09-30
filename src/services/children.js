// src/services/children.js - Fixed token key
import api from './api'; // Use the main api service instead

export const childrenService = {
  // Helper function to transform child data before sending to API
  transformChildDataForAPI: (formData) => {
    // Deep clone to avoid mutations
    const data = JSON.parse(JSON.stringify(formData));
    
    // Transform allergies to array
    if (data.allergies) {
      if (typeof data.allergies === 'string') {
        // Split by comma if string, or wrap in array
        data.allergies = data.allergies.includes(',') 
          ? data.allergies.split(',').map(a => a.trim())
          : [data.allergies.trim()];
      } else if (!Array.isArray(data.allergies)) {
        data.allergies = [data.allergies];
      }
    } else {
      data.allergies = [];
    }
    
    // Transform medical_conditions to proper object array
    if (data.medical_conditions) {
      if (typeof data.medical_conditions === 'string') {
        // Convert string to object array
        const conditions = data.medical_conditions.includes(',')
          ? data.medical_conditions.split(',').map(c => c.trim())
          : [data.medical_conditions.trim()];
        
        data.medical_conditions = conditions.map(condition => ({
          condition: condition,
          diagnosed_date: new Date(),
          current_treatment: '',
          notes: ''
        }));
      } else if (Array.isArray(data.medical_conditions)) {
        // Check if array items are strings or objects
        if (data.medical_conditions.length > 0 && typeof data.medical_conditions[0] === 'string') {
          data.medical_conditions = data.medical_conditions.map(condition => ({
            condition: condition,
            diagnosed_date: new Date(),
            current_treatment: '',
            notes: ''
          }));
        }
      } else if (typeof data.medical_conditions === 'object') {
        // Single object, wrap in array
        data.medical_conditions = [data.medical_conditions];
      }
    } else {
      data.medical_conditions = [];
    }
    
    // Ensure dates are in ISO format
    if (data.date_of_birth) {
      data.date_of_birth = new Date(data.date_of_birth).toISOString();
    }
    if (data.admission_date) {
      data.admission_date = new Date(data.admission_date).toISOString();
    }
    
     // Sanitize string fields
     const stringFields = ['first_name', 'last_name', 'middle_name', 'lga', 'school_name', 'ambition'];
     stringFields.forEach(field => {
       if (data[field] && typeof data[field] === 'string') {
         data[field] = data[field].trim();
       }
     });
     
     // Remove empty strings and null values
     Object.keys(data).forEach(key => {
       if (data[key] === '' || data[key] === null || data[key] === undefined) {
         delete data[key];
       }
     });
     
     return data;
  },

  // Create child with proper data transformation
  createChild: async (childData) => {
    try {
      const transformedData = childrenService.transformChildDataForAPI(childData);
      
      const response = await api.post('/children', transformedData);
      return response.data?.child || response.data;
    } catch (error) {
      console.error('Create child error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create child record');
    }
  },

  // Update child with proper data transformation
  updateChild: async (id, updates) => {
    try {
      const transformedData = childrenService.transformChildDataForAPI(updates);
      
      const response = await api.patch(`/children/${id}`, transformedData);
      return response.data?.child || response.data;
    } catch (error) {
      console.error('Update child error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update child');
    }
  },

  // Other methods remain the same...
  getChildren: async (params = {}) => {
    try {
      const response = await api.get('/children', { params });
      // Handle nested response structure from API
      // API returns: { status: "success", results: 9, pagination: {...}, data: { children: [...] } }
      const data = response.data?.data || response.data;
      
      // Add total count from pagination if available
      if (response.data?.pagination?.total) {
        data.total = response.data.pagination.total;
      }
      
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch children');
    }
  },

  getChild: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      // Handle nested response structure from API
      // API returns: { status: "success", data: { child: {...} } }
      return response.data?.data?.child || response.data?.child || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch child');
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
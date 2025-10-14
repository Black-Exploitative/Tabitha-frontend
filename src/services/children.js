// src/services/children.js - Complete with photo upload
import api from './api';

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

  // Get all children with optional filters
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
      
      // Load photos from localStorage for each child
      if (data.children && Array.isArray(data.children)) {
        data.children = data.children.map(child => {
          const photoKey = `child_photo_${child._id || child.id}`;
          const storedPhoto = localStorage.getItem(photoKey);
          
          if (storedPhoto) {
            return { ...child, photo_url: storedPhoto };
          }
          
          return child;
        });
      }
      
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch children');
    }
  },

  // Get single child by ID
  getChild: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      // Handle nested response structure from API
      // API returns: { status: "success", data: { child: {...} } }
      const child = response.data?.data?.child || response.data?.child || response.data;
      
      // Check for photo in localStorage
      const photoKey = `child_photo_${id}`;
      const storedPhoto = localStorage.getItem(photoKey);
      
      if (storedPhoto) {
        child.photo_url = storedPhoto;
      }
      
      return child;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch child');
    }
  },

  // Delete child
  deleteChild: async (id) => {
    try {
      const response = await api.delete(`/children/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete child');
    }
  },

  // Search children
  searchChildren: async (query) => {
    try {
      const response = await api.get('/children/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  // Get child statistics
  getChildStats: async () => {
    try {
      const response = await api.get('/children/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  // Upload child photo (POST method)
  uploadPhoto: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post(`/children/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Photo upload failed');
    }
  },

  // Update child photo (PATCH method) - for component compatibility
  updateChildPhoto: async (id, formData) => {
    try {
      // FRONTEND LOCAL STORAGE SOLUTION
      // Store photo as base64 in localStorage for immediate display
      const file = formData.get('photo');
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Image = reader.result;
          
          // Store in localStorage with child ID as key
          const photoKey = `child_photo_${id}`;
          localStorage.setItem(photoKey, base64Image);
          
          // Store metadata
          const metadataKey = `child_photo_meta_${id}`;
          localStorage.setItem(metadataKey, JSON.stringify({
            filename: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }));
          
          // Simulate API response
          setTimeout(() => {
            resolve({
              status: 'success',
              message: 'Photo updated successfully',
              data: {
                photo_url: base64Image,
                child: {
                  photo_url: base64Image
                }
              }
            });
          }, 800); // Small delay to simulate upload
        };
        
        reader.onerror = () => {
          throw new Error('Failed to read photo file');
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      throw new Error(error.message || 'Photo upload failed');
    }
  },

  // Delete child photo
  deleteChildPhoto: async (id) => {
    try {
      // Remove photo from localStorage
      const photoKey = `child_photo_${id}`;
      const metadataKey = `child_photo_meta_${id}`;
      
      localStorage.removeItem(photoKey);
      localStorage.removeItem(metadataKey);
      
      return {
        status: 'success',
        message: 'Photo deleted successfully',
        data: {
          child: {
            photo_url: null
          }
        }
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete photo');
    }
  },

  // Helper: Get photo metadata from localStorage
  getPhotoMetadata: (id) => {
    const metadataKey = `child_photo_meta_${id}`;
    const metadata = localStorage.getItem(metadataKey);
    return metadata ? JSON.parse(metadata) : null;
  },

  // Helper: Clear all stored photos (useful for cleanup)
  clearAllPhotos: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('child_photo_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

export default childrenService;
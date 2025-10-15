// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tabitha-backend.vercel.app/';

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
    // Handle 304 Not Modified
    if (response.status === 304) {
      console.log('304 Not Modified - using cached data');
      return response.data || response;
    }
    
    // Handle 200-299 success responses
    return response.data;
  },
  (error) => {
    // Enhanced error handling
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(new Error('Network error'));
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        // Validation errors
        if (data?.errors && Array.isArray(data.errors)) {
          // Show first error only in toast
          const firstError = data.errors[0];
          toast.error(firstError.msg || firstError.message || data.message);
        } else {
          toast.error(data?.message || 'Bad request. Please check your input.');
        }
        break;
        
      case 401:
        // Unauthorized - clear token and redirect
        localStorage.removeItem('th_token');
        localStorage.removeItem('th_user');
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
          toast.error('Your session has expired. Please login again.');
        }
        break;
      
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      
      case 404:
        // Let components handle 404s
        console.log('Resource not found:', error.config?.url);
        break;
      
      case 409:
        // Conflict (e.g., duplicate entry)
        toast.error(data?.message || 'This record already exists.');
        break;
      
      case 422:
        // Unprocessable entity (validation)
        if (data?.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => toast.error(err.msg || err.message));
        } else {
          toast.error(data?.message || 'Validation error.');
        }
        break;
      
      case 500:
        toast.error('Server error. Please try again later or contact support.');
        break;
      
      case 503:
        toast.error('Service temporarily unavailable. Please try again later.');
        break;
      
      default:
        toast.error(data?.message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export const settingsAPI = {
  // Profile Settings
  updateProfile: (data) => api.put('/settings/profile', data),
  uploadProfilePhoto: (formData) => api.post('/settings/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Security Settings
  changePassword: (data) => api.post('/settings/security/password', data),
  enable2FA: () => api.post('/settings/security/2fa/enable'),
  disable2FA: () => api.post('/settings/security/2fa/disable'),
  getSessions: () => api.get('/settings/security/sessions'),
  revokeSession: (sessionId) => api.delete(`/settings/security/sessions/${sessionId}`),
  
  // Notification Settings
  getNotificationSettings: () => api.get('/settings/notifications'),
  updateNotificationSettings: (data) => api.put('/settings/notifications', data),
  
  // System Settings (Admin only)
  getSystemSettings: () => api.get('/settings/system'),
  updateSystem: (data) => api.put('/settings/system', data),
  
  // Privacy Settings
  getPrivacySettings: () => api.get('/settings/privacy'),
  updatePrivacySettings: (data) => api.put('/settings/privacy', data),
  
  // Backup & Restore
  createBackup: () => api.post('/settings/backup/create'),
  getBackupHistory: () => api.get('/settings/backup/history'),
  downloadBackup: (backupId) => api.get(`/settings/backup/download/${backupId}`, {
    responseType: 'blob'
  }),
  restoreBackup: (formData) => api.post('/settings/backup/restore', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Account Management
  deleteAccount: (data) => api.post('/settings/account/delete', data),
  
  // System Info
  getSystemInfo: () => api.get('/settings/info'),
  checkUpdates: () => api.get('/settings/updates/check'),
};

export const healthAPI = {
  // Health Records
  getHealthRecords: (params) => api.get('/health/records', { params }),
  getHealthRecord: (id) => api.get(`/health/records/${id}`),
  createHealthRecord: (data) => api.post('/health/records', data),
  updateHealthRecord: (id, data) => api.put(`/health/records/${id}`, data),
  deleteHealthRecord: (id) => api.delete(`/health/records/${id}`),
  
  // Medical Checkups
  getCheckups: (params) => api.get('/health/checkups', { params }),
  scheduleCheckup: (data) => api.post('/health/checkups', data),
  updateCheckup: (id, data) => api.put(`/health/checkups/${id}`, data),
  
  // Vaccinations
  getVaccinations: (params) => api.get('/health/vaccinations', { params }),
  recordVaccination: (data) => api.post('/health/vaccinations', data),
  
  // Health Statistics
  getHealthStats: () => api.get('/health/stats'),
};

export const educationAPI = {
  // Education Records
  getEducationRecords: (params) => api.get('/education/records', { params }),
  getEducationRecord: (id) => api.get(`/education/records/${id}`),
  createEducationRecord: (data) => api.post('/education/records', data),
  updateEducationRecord: (id, data) => api.put(`/education/records/${id}`, data),
  
  // School Information
  getSchools: () => api.get('/education/schools'),
  addSchool: (data) => api.post('/education/schools', data),
  
  // Academic Progress
  getProgress: (childId) => api.get(`/education/progress/${childId}`),
  updateProgress: (childId, data) => api.put(`/education/progress/${childId}`, data),
  
  // Education Statistics
  getEducationStats: () => api.get('/education/stats'),
};

export const activitiesAPI = {
  // Activities
  getActivities: (params) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  
  // Activity Participation
  getParticipants: (activityId) => api.get(`/activities/${activityId}/participants`),
  addParticipant: (activityId, data) => api.post(`/activities/${activityId}/participants`, data),
  removeParticipant: (activityId, participantId) => api.delete(`/activities/${activityId}/participants/${participantId}`),
  
  // Activity Categories
  getCategories: () => api.get('/activities/categories'),
  
  // Activity Statistics
  getActivityStats: () => api.get('/activities/stats'),
};

export default api;
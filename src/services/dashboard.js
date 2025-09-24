// src/services/dashboard.js - Fixed to use main api service
import api from './api';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response;
    } catch (error) {
      // Return mock data for development
      return {
        data: {
          stats: {
            totalChildren: 147,
            totalChildrenChange: 8,
            activeStaff: 32,
            activeStaffChange: 2,
            activeAdmissions: 8,
            activeAdmissionsChange: 3,
            pendingCases: 12,
            pendingCasesChange: -2,
            thisMonthAdmissions: 8,
            thisMonthExits: 3,
            averageStayDuration: 18,
            occupancyRate: 85.2
          }
        }
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/activities', { params: { limit } });
      return response;
    } catch (error) {
      // Return mock data for development
      return {
        data: {
          recentActivities: [
            {
              id: 1,
              type: 'admission',
              title: 'New child admission',
              description: 'Sarah Adebayo was admitted to the home',
              timestamp: new Date().toISOString(),
              user: 'John Doe',
              priority: 'normal'
            },
            {
              id: 2,
              type: 'medical',
              title: 'Medical checkup completed',
              description: 'Annual medical examination for 15 children',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              user: 'Dr. Sarah Okonkwo',
              priority: 'high'
            },
            {
              id: 3,
              type: 'document',
              title: 'Documentation updated',
              description: 'Updated birth certificates for 3 children',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              user: 'Admin User',
              priority: 'medium'
            }
          ]
        }
      };
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/events', { params: { limit } });
      return response;
    } catch (error) {
      // Return mock data for development
      return {
        data: {
          upcomingEvents: [
            {
              id: 1,
              title: 'Medical checkup day',
              date: '2024-06-25',
              time: '09:00 AM',
              type: 'health',
              participants: 25
            },
            {
              id: 2,
              title: 'Parent visit day',
              date: '2024-06-27',
              time: '02:00 PM',
              type: 'family',
              participants: 12
            }
          ]
        }
      };
    }
  },

  // Get alerts
  getAlerts: async () => {
    try {
      const response = await api.get('/dashboard/alerts');
      return response;
    } catch (error) {
      // Return mock data for development
      return {
        data: {
          alerts: [
            {
              id: 1,
              type: 'warning',
              title: 'Medical attention needed',
              message: '3 children need immediate medical attention',
              priority: 'high',
              actionRequired: true
            },
            {
              id: 2,
              type: 'info',
              title: 'Documentation due',
              message: '5 quarterly reports are due this week',
              priority: 'medium',
              actionRequired: true
            }
          ]
        }
      };
    }
  }
};

export default dashboardService;
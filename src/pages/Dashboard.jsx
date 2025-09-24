// src/pages/Dashboard.jsx - Fixed version
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboard';
import { 
  FaChild, 
  FaUsers, 
  FaUserPlus, 
  FaExclamationTriangle 
} from 'react-icons/fa';

// Import components
import LoadingSpinner from '../components/UI/Loading/LoadingSpinner';
import Button from '../components/UI/Button/Button';
import StatsCard from '../components/Dashboard/StatsCard';
import WelcomeWidget from '../components/Dashboard/WelcomeWidget';
import RecentActivity from '../components/Dashboard/RecentActivity';
import UpcomingEvents from '../components/Dashboard/UpcomingEvents';
import AlertsWidget from '../components/Dashboard/AlertsWidget';

import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Mock data fallback
  const mockData = {
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
    },
    recentActivities: [
      {
        id: 1,
        type: 'admission',
        title: 'New child admission',
        description: 'Sarah Adebayo was admitted to the home',
        time: '2 hours ago',
        user: 'John Doe',
        priority: 'normal'
      },
      {
        id: 2,
        type: 'medical',
        title: 'Medical checkup completed',
        description: 'Annual medical examination for 15 children',
        time: '5 hours ago',
        user: 'Dr. Sarah Okonkwo',
        priority: 'high'
      },
      {
        id: 3,
        type: 'document',
        title: 'Documentation updated',
        description: 'Updated birth certificates for 3 children',
        time: '1 day ago',
        user: 'Admin User',
        priority: 'medium'
      }
    ],
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
    ],
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
  };

  const data = dashboardData?.data || mockData;

  if (isLoading) {
    return (
      <div className="th-dashboard-loading">
        <LoadingSpinner size="xl" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>Unable to load dashboard data. Please try again.</p>
        <Button 
          onClick={refetch} 
          variant="primary"
          icon={<FaExclamationTriangle />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="th-dashboard th-fade-in" style={{ padding: '2rem 0', minHeight: '100vh', background: 'var(--th-bg-dashboard, #f7f8fa)' }}>
      {/* Welcome Section */}
      <WelcomeWidget user={user} />
      {/* Stats Cards Grid */}
      <div className="th-stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        margin: '2rem 0',
        width: '100%'
      }}>
        <StatsCard
          title="Total Children"
          value={data.stats.totalChildren}
          change={data.stats.totalChildrenChange}
          icon={FaChild}
          color="primary"
          trend={data.stats.totalChildrenChange > 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Active Staff"
          value={data.stats.activeStaff}
          change={data.stats.activeStaffChange}
          icon={FaUsers}
          color="secondary"
          trend={data.stats.activeStaffChange > 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="New Admissions"
          value={data.stats.activeAdmissions}
          change={data.stats.activeAdmissionsChange}
          icon={FaUserPlus}
          color="accent"
          trend={data.stats.activeAdmissionsChange > 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Pending Cases"
          value={data.stats.pendingCases}
          change={data.stats.pendingCasesChange}
          icon={FaExclamationTriangle}
          color="warm"
          trend={data.stats.pendingCasesChange > 0 ? 'up' : 'down'}
        />
      </div>
      {/* Dashboard Content */}
      <div className="th-dashboard-content" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '2.5rem',
        alignItems: 'flex-start',
        width: '100%'
      }}>
        <div className="th-dashboard-main">
          <RecentActivity activities={data.recentActivities} />
          <UpcomingEvents events={data.upcomingEvents} />   
        </div>
        <div className="th-dashboard-sidebar">
          <AlertsWidget alerts={data.alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
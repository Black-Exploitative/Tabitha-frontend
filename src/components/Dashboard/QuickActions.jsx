import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaUserPlus, 
  FaFileAlt, 
  FaCalendarPlus,
  FaUpload,
  FaSearch,
  FaPrint,
  FaCog
} from 'react-icons/fa';
import Button from '../UI/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      id: 'add-child',
      title: 'Add Child',
      description: 'Register a new child',
      icon: FaPlus,
      color: 'primary',
      action: () => navigate('/children/add'),
      permission: 'children.create'
    },
    {
      id: 'add-staff',
      title: 'Add Staff',
      description: 'Register new staff member',
      icon: FaUserPlus,
      color: 'secondary',
      action: () => navigate('/staff/add'),
      permission: 'staff.create'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create custom reports',
      icon: FaFileAlt,
      color: 'accent',
      action: () => navigate('/reports/generate'),
      permission: 'reports.create'
    },
    {
      id: 'schedule-event',
      title: 'Schedule Event',
      description: 'Add calendar event',
      icon: FaCalendarPlus,
      color: 'success',
      action: () => navigate('/calendar/add'),
      permission: 'calendar.create'
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Upload',
      description: 'Upload multiple files',
      icon: FaUpload,
      color: 'warning',
      action: () => navigate('/upload/bulk'),
      permission: 'documents.create'
    },
    {
      id: 'advanced-search',
      title: 'Advanced Search',
      description: 'Search with filters',
      icon: FaSearch,
      color: 'info',
      action: () => navigate('/search/advanced'),
      permission: null
    },
    {
      id: 'print-reports',
      title: 'Print Reports',
      description: 'Print ready reports',
      icon: FaPrint,
      color: 'dark',
      action: () => navigate('/reports/print'),
      permission: 'reports.read'
    },
    {
      id: 'system-settings',
      title: 'Settings',
      description: 'System configuration',
      icon: FaCog,
      color: 'muted',
      action: () => navigate('/settings'),
      permission: 'admin'
    }
  ];

  // Filter actions based on user permissions
  const availableActions = quickActions.filter(action => {
    if (!action.permission) return true;
    if (user?.role === 'super_admin') return true;
    return user?.permissions?.includes(action.permission) || false;
  });

  // Show only first 6 actions in the widget
  const displayActions = availableActions.slice(0, 6);

  return (
    <div className="th-quick-actions-widget">
      <div className="th-widget-header">
        <h3 className="th-widget-title">Quick Actions</h3>
        <p className="th-widget-subtitle">
          Common tasks and shortcuts
        </p>
      </div>
      
      <div className="th-quick-actions-grid">
        {displayActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`th-quick-action-btn th-action-${action.color}`}
              onClick={action.action}
              title={action.description}
            >
              <div className="th-action-icon">
                <Icon />
              </div>
              <div className="th-action-content">
                <span className="th-action-title">{action.title}</span>
                <span className="th-action-description">{action.description}</span>
              </div>
              <div className="th-action-indicator"></div>
            </button>
          );
        })}
      </div>
      
      {availableActions.length > 6 && (
        <div className="th-widget-footer">
          <Button
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => navigate('/actions')}
          >
            View All Actions ({availableActions.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
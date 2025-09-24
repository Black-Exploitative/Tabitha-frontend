import React, { useState } from 'react';
import { 
  FaChild, 
  FaUserMd, 
  FaGraduationCap, 
  FaTrophy,
  FaHeart,
  FaUserPlus,
  FaFileAlt,
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaShare
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Button from '../UI/Button/Button';
import './RecentActivity.css';

const RecentActivity = ({ activities = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getActivityIcon = (type) => {
    const iconMap = {
      admission: FaChild,
      health: FaUserMd,
      education: FaGraduationCap,
      achievement: FaTrophy,
      care: FaHeart,
      staff: FaUserPlus,
      document: FaFileAlt,
    };
    return iconMap[type] || FaFileAlt;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      admission: 'primary',
      health: 'accent',
      education: 'secondary',
      achievement: 'warning',
      care: 'success',
      staff: 'info',
      document: 'muted',
    };
    return colorMap[type] || 'muted';
  };

  const getPriorityBadge = (priority) => {
    const badgeMap = {
      high: { color: 'error', label: 'High' },
      medium: { color: 'warning', label: 'Medium' },
      low: { color: 'success', label: 'Low' },
    };
    return badgeMap[priority] || badgeMap.low;
  };

  const displayActivities = showAll ? activities : activities.slice(0, 5);

  const formatTime = (timeString) => {
    try {
      return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    } catch {
      return timeString;
    }
  };

  const handleActivityAction = (action, activity) => {
    switch (action) {
      case 'view':
        setSelectedActivity(activity);
        break;
      case 'edit':
        console.log('Edit activity:', activity);
        break;
      case 'share':
        console.log('Share activity:', activity);
        break;
      default:
        break;
    }
  };

  return (
    <div className="th-recent-activity-widget th-widget">
      <div className="th-widget-header">
        <div className="th-activity-header">
          <div>
            <h3 className="th-widget-title">Recent Activity</h3>
            <p className="th-widget-subtitle">
              Latest updates and actions in the system
            </p>
          </div>
          <div className="th-activity-filter">
            <select className="th-activity-filter-select">
              <option value="all">All Activities</option>
              <option value="admission">Admissions</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="achievement">Achievements</option>
            </select>
          </div>
        </div>
      </div>

      <div className="th-activity-list">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            const priority = getPriorityBadge(activity.priority);

            return (
              <div 
                key={activity.id} 
                className={`th-activity-item th-activity-${color}`}
              >
                <div className="th-activity-timeline">
                  <div className={`th-activity-icon th-icon-${color}`}>
                    <Icon />
                  </div>
                  <div className="th-activity-line"></div>
                </div>

                <div className="th-activity-content">
                  <div className="th-activity-header">
                    <div className="th-activity-meta">
                      <h4 className="th-activity-title">{activity.title}</h4>
                      <div className="th-activity-badges">
                        <span className={`th-priority-badge th-badge-${priority.color}`}>
                          {priority.label}
                        </span>
                        <span className={`th-type-badge th-badge-${color}`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="th-activity-actions">
                      <button 
                        className="th-activity-action-btn"
                        onClick={() => handleActivityAction('view', activity)}
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="th-activity-action-btn"
                        onClick={() => handleActivityAction('edit', activity)}
                        title="Edit activity"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="th-activity-action-btn"
                        onClick={() => handleActivityAction('share', activity)}
                        title="Share activity"
                      >
                        <FaShare />
                      </button>
                    </div>
                  </div>

                  <p className="th-activity-description">
                    {activity.description}
                  </p>

                  <div className="th-activity-footer">
                    <div className="th-activity-user">
                      <div className="th-user-avatar-sm">
                        {activity.user?.charAt(0) || 'U'}
                      </div>
                      <span className="th-user-name">{activity.user}</span>
                    </div>
                    <span className="th-activity-time">
                      {formatTime(activity.time)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="th-activity-empty">
            <div className="th-empty-icon">
              <FaFileAlt />
            </div>
            <h4>No Recent Activity</h4>
            <p>No activities have been recorded yet.</p>
          </div>
        )}
      </div>

      {activities.length > 5 && (
        <div className="th-widget-footer">
          <Button
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All Activities (${activities.length})`}
          </Button>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="th-activity-modal-overlay" onClick={() => setSelectedActivity(null)}>
          <div className="th-activity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <h3>{selectedActivity.title}</h3>
              <button 
                className="th-modal-close"
                onClick={() => setSelectedActivity(null)}
              >
                ×
              </button>
            </div>
            <div className="th-modal-content">
              <p>{selectedActivity.description}</p>
              <div className="th-modal-meta">
                <p><strong>Type:</strong> {selectedActivity.type}</p>
                <p><strong>Priority:</strong> {selectedActivity.priority}</p>
                <p><strong>User:</strong> {selectedActivity.user}</p>
                <p><strong>Time:</strong> {formatTime(selectedActivity.time)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
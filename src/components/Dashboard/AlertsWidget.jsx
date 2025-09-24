import React, { useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaBell,
  FaBellSlash
} from 'react-icons/fa';
import Button from '../UI/Button/Button';
import './AlertsWidget.css';

const AlertsWidget = ({ alerts = [] }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const getAlertIcon = (type) => {
    const iconMap = {
      warning: FaExclamationTriangle,
      info: FaInfoCircle,
      success: FaCheckCircle,
      error: FaExclamationTriangle,
    };
    return iconMap[type] || FaInfoCircle;
  };

  const getAlertColor = (type) => {
    const colorMap = {
      warning: 'warning',
      info: 'info',
      success: 'success',
      error: 'error',
    };
    return colorMap[type] || 'info';
  };

  const getPriorityLabel = (priority) => {
    const priorityMap = {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
    };
    return priorityMap[priority] || 'Normal';
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const markAsRead = (alertId) => {
    // In real app, this would make an API call
    console.log('Marking alert as read:', alertId);
  };

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));
  const displayAlerts = showAll ? activeAlerts : activeAlerts.slice(0, 3);
  const highPriorityCount = activeAlerts.filter(alert => alert.priority === 'high').length;

  return (
    <div className="th-alerts-widget th-widget">
      <div className="th-widget-header">
        <div className="th-alerts-header">
          <div className="th-alerts-title-section">
            <h3 className="th-widget-title">
              <FaBell className="th-title-icon" />
              System Alerts
              {highPriorityCount > 0 && (
                <span className="th-high-priority-count">{highPriorityCount}</span>
              )}
            </h3>
            <p className="th-widget-subtitle">
              Important notifications and action items
            </p>
          </div>
          
          {activeAlerts.length > 0 && (
            <div className="th-alerts-actions">
              <button
                className="th-alerts-action-btn"
                onClick={() => setDismissedAlerts(new Set(alerts.map(a => a.id)))}
                title="Dismiss all alerts"
              >
                <FaBellSlash />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="th-alerts-list">
        {displayAlerts.length > 0 ? (
          displayAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const color = getAlertColor(alert.type);

            return (
              <div 
                key={alert.id} 
                className={`th-alert-item th-alert-${color} ${
                  alert.priority === 'high' ? 'th-alert-high-priority' : ''
                }`}
              >
                <div className="th-alert-content">
                  <div className="th-alert-header">
                    <div className={`th-alert-icon th-icon-${color}`}>
                      <Icon />
                    </div>
                    <div className="th-alert-meta">
                      <h4 className="th-alert-title">{alert.title}</h4>
                      <div className="th-alert-badges">
                        <span className={`th-priority-badge th-priority-${alert.priority}`}>
                          {getPriorityLabel(alert.priority)}
                        </span>
                        {alert.actionRequired && (
                          <span className="th-action-required-badge">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="th-alert-message">{alert.message}</p>

                  <div className="th-alert-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                      icon={<FaEye />}
                    >
                      View Details
                    </Button>
                    
                    <button
                      className="th-dismiss-btn"
                      onClick={() => dismissAlert(alert.id)}
                      title="Dismiss alert"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {alert.priority === 'high' && (
                  <div className="th-alert-pulse"></div>
                )}
              </div>
            );
          })
        ) : (
          <div className="th-alerts-empty">
            <div className="th-empty-icon">
              <FaCheckCircle />
            </div>
            <h4>All Clear!</h4>
            <p>No active alerts at the moment. Great job!</p>
          </div>
        )}
      </div>

      {activeAlerts.length > 3 && (
        <div className="th-widget-footer">
          <Button
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All Alerts (${activeAlerts.length})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
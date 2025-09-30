import React, { useState } from 'react';
import { FaBell, FaCheck, FaTrash, FaSearch } from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New child admission',
      message: 'Sarah Adebayo has been admitted to the home',
      time: '2 minutes ago',
      unread: true,
      action: '/children'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Medical checkup due',
      message: '5 children need medical checkups this week',
      time: '1 hour ago',
      unread: true,
      action: '/health'
    },
    {
      id: 3,
      type: 'success',
      title: 'Report generated',
      message: 'Monthly report is ready for download',
      time: '3 hours ago',
      unread: false,
      action: '/reports'
    },
    {
      id: 4,
      type: 'info',
      title: 'Staff meeting scheduled',
      message: 'Weekly staff meeting tomorrow at 10 AM',
      time: '5 hours ago',
      unread: true,
      action: '/calendar'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Documentation overdue',
      message: '3 children have overdue documentation',
      time: '1 day ago',
      unread: false,
      action: '/documents'
    },
    {
      id: 6,
      type: 'success',
      title: 'Vaccination completed',
      message: 'Ahmed Ibrahim received his scheduled vaccination',
      time: '2 days ago',
      unread: false,
      action: '/children/2'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && notification.unread) ||
      (filter === 'read' && !notification.unread) ||
      notification.type === filter;
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  return (
    <div className="th-notifications-page">
      {/* Header */}
      <div className="th-notifications-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaBell className="th-title-icon" />
              Notifications
            </h1>
            <p className="th-page-subtitle">
              Stay updated with important alerts and updates
            </p>
          </div>
          
          <div className="th-page-actions">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={<FaCheck />}
                onClick={markAllAsRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="th-notifications-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaBell />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{notifications.length}</span>
            <span className="th-stat-label">Total</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon unread">
            <FaBell />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{unreadCount}</span>
            <span className="th-stat-label">Unread</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon info">
            <span>ℹ️</span>
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">
              {notifications.filter(n => n.type === 'info').length}
            </span>
            <span className="th-stat-label">Info</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon warning">
            <span>⚠️</span>
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">
              {notifications.filter(n => n.type === 'warning').length}
            </span>
            <span className="th-stat-label">Warnings</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="th-notifications-controls">
        <div className="th-controls-left">
          <div className="th-search-input-group">
            <FaSearch className="th-search-icon" />
            <input
              type="text"
              className="th-search-input"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="th-filter-group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="th-filter-select"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="th-notifications-content">
        {filteredNotifications.length > 0 ? (
          <div className="th-notifications-list">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`th-notification-card ${
                  notification.unread ? 'th-notification-unread' : ''
                }`}
              >
                <div className="th-notification-card-header">
                  <div className="th-notification-icon">
                    <span>{getNotificationIcon(notification.type)}</span>
                  </div>
                  <div className="th-notification-meta">
                    <h3 className="th-notification-title">{notification.title}</h3>
                    <span className="th-notification-time">{notification.time}</span>
                  </div>
                  <div className="th-notification-actions">
                    {notification.unread && (
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={<FaCheck />}
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<FaTrash />}
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                      className="th-delete-btn"
                    />
                  </div>
                </div>
                
                <div className="th-notification-card-body">
                  <p className="th-notification-message">{notification.message}</p>
                </div>
                
                {notification.action && (
                  <div className="th-notification-card-footer">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = notification.action}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="th-notifications-empty">
            <div className="th-empty-icon">
              <FaBell />
            </div>
            <h3>No Notifications Found</h3>
            <p>
              {searchQuery || filter !== 'all'
                ? 'No notifications match your current search and filter criteria.'
                : 'You have no notifications at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaBell, 
  FaSearch, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../UI/Button/Button';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Mock notifications with more variety
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New child admission',
      message: 'Sarah Adebayo has been admitted to the home',
      time: '2 minutes ago',
      unread: true,
      action: '/children/1'
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
    }
  ]);

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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action);
    }
    setNotificationsOpen(false);
  };

  return (
    <header className="th-header">
      <div className="th-header-container">
        {/* Left Section */}
        <div className="th-header-left">
          <button
            className="th-sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          
          <Link to="/dashboard" className="th-header-brand">
            <div className="th-header-logo">
              <span>TH</span>
            </div>
            <div className="th-header-brand-text">
              <h1>Tabitha Home</h1>
              <span>Management System</span>
            </div>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="th-header-search">
          <form onSubmit={handleSearch} className="th-search-form">
            <div className="th-search-input-group">
              <FaSearch className="th-search-icon" />
              <input
                type="text"
                className="th-search-input"
                placeholder="Search children, staff, or records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="glass"
                size="sm"
                className="th-search-btn"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="th-header-right">
          {/* Theme Toggle */}
          <button
            className="th-header-icon-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          {/* Notifications */}
          <div className="th-header-dropdown" ref={notificationsRef}>
            <button
              className="th-header-icon-btn th-notifications-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="th-notification-badge">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="th-dropdown-menu th-notifications-dropdown">
                <div className="th-dropdown-header">
                  <h3>Notifications</h3>
                  <div className="th-notification-actions">
                    {unreadCount > 0 && (
                      <button
                        className="th-mark-all-read-btn"
                        onClick={markAllAsRead}
                        title="Mark all as read"
                      >
                        Mark all read
                      </button>
                    )}
                    <span className="th-notification-count">
                      {unreadCount} unread
                    </span>
                  </div>
                </div>
                
                <div className="th-notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`th-notification-item ${
                          notification.unread ? 'th-notification-unread' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`th-notification-icon th-notification-${notification.type}`}>
                          <div className="th-notification-dot"></div>
                        </div>
                        <div className="th-notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="th-notification-time">
                            {notification.time}
                          </span>
                        </div>
                        {notification.unread && (
                          <div className="th-unread-indicator"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="th-no-notifications">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="th-dropdown-footer">
                  <Link to="/notifications" className="th-view-all-btn">
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="th-header-dropdown" ref={userMenuRef}>
            <button
              className="th-user-menu-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
            >
              <div className="th-user-avatar">
                {user?.photo ? (
                  <img src={user.photo} alt={user.first_name} />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="th-user-info">
                <span className="th-user-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="th-user-role">{user?.position}</span>
              </div>
              <FaChevronDown className="th-dropdown-arrow" />
            </button>

            {userMenuOpen && (
              <div className="th-dropdown-menu th-user-dropdown">
                <div className="th-dropdown-header">
                  <div className="th-user-avatar-large">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.first_name} />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <div className="th-user-details">
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p>{user?.email}</p>
                    <span className="th-user-badge">{user?.position}</span>
                  </div>
                </div>

                <div className="th-dropdown-section">
                  <Link to="/profile" className="th-dropdown-item">
                    <FaUser className="th-dropdown-icon" />
                    My Profile
                  </Link>
                  <Link to="/settings" className="th-dropdown-item">
                    <FaCog className="th-dropdown-icon" />
                    Settings
                  </Link>
                </div>

                <div className="th-dropdown-footer">
                  <button
                    className="th-dropdown-item th-logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="th-dropdown-icon" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
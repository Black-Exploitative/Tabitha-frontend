import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChild,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaHeart,
  FaGraduationCap,
  FaUserMd,
  FaCalendarAlt,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Main',
      items: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: FaHome,
          description: 'Overview & Statistics'
        }
      ]
    },
    {
      section: 'Management',
      items: [
        {
          path: '/children',
          label: 'Children',
          icon: FaChild,
          description: 'Manage child records',
          permission: 'children.read'
        },
        {
          path: '/staff',
          label: 'Staff',
          icon: FaUsers,
          description: 'Staff management',
          permission: 'staff.read'
        }
      ]
    },
    {
      section: 'Care & Development',
      items: [
        {
          path: '/health',
          label: 'Health',
          icon: FaUserMd,
          description: 'Medical & health tracking',
          permission: 'health.read'
        },
        {
          path: '/education',
          label: 'Education',
          icon: FaGraduationCap,
          description: 'School & learning',
          permission: 'education.read'
        },
        {
          path: '/activities',
          label: 'Activities',
          icon: FaHeart,
          description: 'Programs & events',
          permission: 'activities.read'
        }
      ]
    },
    {
      section: 'Reports & Tools',
      items: [
        {
          path: '/reports',
          label: 'Reports',
          icon: FaChartBar,
          description: 'Analytics & insights',
          permission: 'reports.read'
        },
        {
          path: '/documents',
          label: 'Documents',
          icon: FaFileAlt,
          description: 'Files & docs',
          permission: 'documents.read'
        },
        {
          path: '/calendar',
          label: 'Calendar',
          icon: FaCalendarAlt,
          description: 'Events & schedules'
        }
      ]
    },
    {
      section: 'System',
      items: [
        {
          path: '/settings',
          label: 'Settings',
          icon: FaCog,
          description: 'Configuration',
          permission: 'admin'
        }
      ]
    }
  ];

  // Check if user has permission for a menu item
  const hasPermission = (permission) => {
    if (!permission) return true;
    if (user?.role === 'super_admin') return true;
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <>
      <aside className={`th-sidebar ${isOpen ? 'th-sidebar-open' : ''}`}>
        {/* Mobile-only header with close button */}
        <div className="th-sidebar-mobile-header">
          <button
            className="th-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="th-sidebar-nav">
          {navigationItems.map(section => (
            <div key={section.section} className="th-nav-section">
              <h3 className="th-nav-section-title">{section.section}</h3>
              
              <ul className="th-nav-list">
                {section.items
                  .filter(item => hasPermission(item.permission))
                  .map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || 
                      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    
                    return (
                      <li key={item.path} className="th-nav-item">
                        <NavLink
                          to={item.path}
                          className={`th-nav-link ${isActive ? 'th-nav-link-active' : ''}`}
                          onClick={onClose}
                        >
                          <div className="th-nav-icon">
                            <Icon />
                          </div>
                          <div className="th-nav-content">
                            <span className="th-nav-label">{item.label}</span>
                            <span className="th-nav-description">
                              {item.description}
                            </span>
                          </div>
                          <div className="th-nav-indicator"></div>
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Compact User Footer */}
        <div className="th-sidebar-footer">
          <div className="th-sidebar-user-card">
            <div className="th-sidebar-avatar">
              {user?.photo ? (
                <img src={user.photo} alt={user.first_name} />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="th-sidebar-user-info">
              <h4>{user?.first_name} {user?.last_name}</h4>
              <p>{user?.position}</p>
              <span className="th-sidebar-status">Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
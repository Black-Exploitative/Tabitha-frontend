// src/pages/settings/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  FaCog,
  FaUser,
  FaLock,
  FaBell,
  FaDatabase,
  FaShieldAlt,
  FaInfoCircle,
  FaUsers,
  FaPalette,
  FaGlobe,
  FaSave,
  FaCamera,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCheckCircle,
  FaDownload,
  FaUpload,
  FaTrash
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { settingsAPI } from '../../services/api';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    position: user?.position || '',
    department: user?.department || '',
    bio: user?.bio || ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    organization_name: 'Tabitha Home Orphanage',
    organization_email: 'info@tabithahome.org',
    organization_phone: '+234 XXX XXX XXXX',
    organization_address: 'Lagos, Nigeria',
    timezone: 'Africa/Lagos',
    language: 'English',
    date_format: 'DD/MM/YYYY',
    currency: 'NGN'
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    medical_alerts: true,
    education_updates: true,
    activity_reminders: true,
    staff_updates: false,
    system_updates: true
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'staff',
    data_sharing: false,
    analytics: true,
    two_factor_auth: false
  });

  // Tabs Configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'system', label: 'System', icon: FaCog },
    { id: 'privacy', label: 'Privacy', icon: FaShieldAlt },
    { id: 'backup', label: 'Backup', icon: FaDatabase },
    { id: 'about', label: 'About', icon: FaInfoCircle }
  ];

  // Only show Users tab for admins
  if (user?.role === 'super_admin' || user?.role === 'admin') {
    tabs.splice(3, 0, { id: 'users', label: 'Users', icon: FaUsers });
  }

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => settingsAPI.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      updateUser(profileData);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => settingsAPI.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    }
  });

  // Update System Settings Mutation
  const updateSystemMutation = useMutation({
    mutationFn: (data) => settingsAPI.updateSystem(data),
    onSuccess: () => {
      toast.success('System settings updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update system settings');
    }
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    updateSystemMutation.mutate(systemSettings);
  };

  const handleBackup = () => {
    toast.success('Backup initiated. You will receive an email when complete.');
  };

  const handleRestore = () => {
    toast.success('Restore initiated. Please wait...');
  };

  return (
    <div className="th-settings">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaCog className="th-title-icon" />
              Settings
            </h1>
            <p className="th-page-subtitle">
              Manage your account, system preferences, and application settings
            </p>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div className="th-settings-container">
        {/* Settings Sidebar */}
        <div className="th-settings-sidebar">
          <div className="th-settings-tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`th-settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="th-tab-icon" />
                  <span className="th-tab-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="th-settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">Profile Information</h2>
                  <p className="th-section-subtitle">Update your personal information and profile picture</p>
                </div>
                {!isEditing ? (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="th-section-actions">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleProfileSubmit}
                      loading={updateProfileMutation.isLoading}
                      icon={<FaSave />}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="th-profile-content">
                {/* Profile Picture */}
                <div className="th-profile-photo-section">
                  <div className="th-profile-photo-large">
                    {user?.photo_url ? (
                      <img src={user.photo_url} alt={user.first_name} />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" icon={<FaCamera />}>
                      Change Photo
                    </Button>
                  )}
                </div>

                {/* Profile Form */}
                <div className="th-profile-form">
                  <div className="th-form-grid">
                    <div className="th-form-group">
                      <label className="th-form-label">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                        className="th-form-input"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                        className="th-form-input"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Email</label>
                      <div className="th-input-with-icon">
                        <FaEnvelope className="th-input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="th-form-input"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Phone</label>
                      <div className="th-input-with-icon">
                        <FaPhone className="th-input-icon" />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="th-form-input"
                          placeholder="+234 XXX XXX XXXX"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={profileData.position}
                        onChange={handleProfileChange}
                        className="th-form-input"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={profileData.department}
                        onChange={handleProfileChange}
                        className="th-form-input"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="th-form-group th-full-width">
                      <label className="th-form-label">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="th-form-textarea"
                        rows="4"
                        placeholder="Tell us about yourself..."
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">Security Settings</h2>
                  <p className="th-section-subtitle">Manage your password and security preferences</p>
                </div>
              </div>

              <div className="th-security-content">
                {/* Change Password */}
                <div className="th-security-card">
                  <h3 className="th-card-title">
                    <FaKey />
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="th-form-grid">
                      <div className="th-form-group th-full-width">
                        <label className="th-form-label">Current Password</label>
                        <input
                          type="password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className="th-form-input"
                          required
                        />
                      </div>

                      <div className="th-form-group">
                        <label className="th-form-label">New Password</label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className="th-form-input"
                          required
                        />
                      </div>

                      <div className="th-form-group">
                        <label className="th-form-label">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="th-form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="th-form-actions">
                      <Button 
                        type="submit" 
                        variant="primary"
                        loading={changePasswordMutation.isLoading}
                        icon={<FaSave />}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="th-security-card">
                  <div className="th-card-header-flex">
                    <div>
                      <h3 className="th-card-title">
                        <FaShieldAlt />
                        Two-Factor Authentication
                      </h3>
                      <p className="th-card-description">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.two_factor_auth}
                        onChange={() => handlePrivacyToggle('two_factor_auth')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="th-security-card">
                  <h3 className="th-card-title">Active Sessions</h3>
                  <div className="th-sessions-list">
                    <div className="th-session-item">
                      <div className="th-session-info">
                        <h4>Chrome on Windows</h4>
                        <p>Lagos, Nigeria • Current Session</p>
                      </div>
                      <span className="th-session-badge active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">Notification Preferences</h2>
                  <p className="th-section-subtitle">Choose what notifications you want to receive</p>
                </div>
                <Button variant="primary" icon={<FaSave />}>
                  Save Preferences
                </Button>
              </div>

              <div className="th-notifications-content">
                <div className="th-notification-group">
                  <h3 className="th-group-title">Notification Channels</h3>
                  
                  <div className="th-notification-item">
                    <div className="th-notification-info">
                      <FaEnvelope className="th-notification-icon" />
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                      </div>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_notifications}
                        onChange={() => handleNotificationToggle('email_notifications')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="th-notification-item">
                    <div className="th-notification-info">
                      <FaPhone className="th-notification-icon" />
                      <div>
                        <h4>SMS Notifications</h4>
                        <p>Receive notifications via SMS</p>
                      </div>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.sms_notifications}
                        onChange={() => handleNotificationToggle('sms_notifications')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="th-notification-item">
                    <div className="th-notification-info">
                      <FaBell className="th-notification-icon" />
                      <div>
                        <h4>Push Notifications</h4>
                        <p>Receive notifications in browser</p>
                      </div>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push_notifications}
                        onChange={() => handleNotificationToggle('push_notifications')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="th-notification-group">
                  <h3 className="th-group-title">Notification Types</h3>
                  
                  {Object.entries({
                    medical_alerts: 'Medical Alerts',
                    education_updates: 'Education Updates',
                    activity_reminders: 'Activity Reminders',
                    staff_updates: 'Staff Updates',
                    system_updates: 'System Updates'
                  }).map(([key, label]) => (
                    <div key={key} className="th-notification-item">
                      <div className="th-notification-info">
                        <div>
                          <h4>{label}</h4>
                        </div>
                      </div>
                      <label className="th-toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings[key]}
                          onChange={() => handleNotificationToggle(key)}
                        />
                        <span className="th-toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">System Settings</h2>
                  <p className="th-section-subtitle">Configure system-wide preferences</p>
                </div>
                <Button 
                  variant="primary" 
                  icon={<FaSave />}
                  onClick={handleSystemSubmit}
                  loading={updateSystemMutation.isLoading}
                >
                  Save Settings
                </Button>
              </div>

              <div className="th-system-content">
                <form onSubmit={handleSystemSubmit}>
                  <div className="th-form-grid">
                    <div className="th-form-group th-full-width">
                      <label className="th-form-label">
                        <FaBuilding />
                        Organization Name
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={systemSettings.organization_name}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">
                        <FaEnvelope />
                        Organization Email
                      </label>
                      <input
                        type="email"
                        name="organization_email"
                        value={systemSettings.organization_email}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">
                        <FaPhone />
                        Organization Phone
                      </label>
                      <input
                        type="tel"
                        name="organization_phone"
                        value={systemSettings.organization_phone}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      />
                    </div>

                    <div className="th-form-group th-full-width">
                      <label className="th-form-label">
                        <FaMapMarkerAlt />
                        Organization Address
                      </label>
                      <input
                        type="text"
                        name="organization_address"
                        value={systemSettings.organization_address}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      />
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">
                        <FaGlobe />
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={systemSettings.timezone}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      >
                        <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Language</label>
                      <select
                        name="language"
                        value={systemSettings.language}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      >
                        <option value="English">English</option>
                        <option value="Yoruba">Yoruba</option>
                        <option value="Igbo">Igbo</option>
                        <option value="Hausa">Hausa</option>
                      </select>
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Date Format</label>
                      <select
                        name="date_format"
                        value={systemSettings.date_format}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div className="th-form-group">
                      <label className="th-form-label">Currency</label>
                      <select
                        name="currency"
                        value={systemSettings.currency}
                        onChange={handleSystemChange}
                        className="th-form-input"
                      >
                        <option value="NGN">₦ Nigerian Naira (NGN)</option>
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                      </select>
                    </div>

                    <div className="th-form-group th-full-width">
                      <label className="th-form-label">
                        <FaPalette />
                        Theme
                      </label>
                      <div className="th-theme-selector">
                        <button
                          type="button"
                          className={`th-theme-option ${theme === 'light' ? 'active' : ''}`}
                          onClick={toggleTheme}
                        >
                          Light Mode
                        </button>
                        <button
                          type="button"
                          className={`th-theme-option ${theme === 'dark' ? 'active' : ''}`}
                          onClick={toggleTheme}
                        >
                          Dark Mode
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">Privacy & Data</h2>
                  <p className="th-section-subtitle">Control your privacy and data settings</p>
                </div>
              </div>

              <div className="th-privacy-content">
                <div className="th-privacy-card">
                  <div className="th-card-header-flex">
                    <div>
                      <h3 className="th-card-title">Profile Visibility</h3>
                      <p className="th-card-description">
                        Control who can see your profile
                      </p>
                    </div>
                    <select
                      value={privacySettings.profile_visibility}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, profile_visibility: e.target.value }))}
                      className="th-form-input"
                      style={{ width: '200px' }}
                    >
                      <option value="public">Everyone</option>
                      <option value="staff">Staff Only</option>
                      <option value="admin">Admins Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="th-privacy-card">
                  <div className="th-card-header-flex">
                    <div>
                      <h3 className="th-card-title">Data Sharing</h3>
                      <p className="th-card-description">
                        Allow anonymous data sharing for improvements
                      </p>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.data_sharing}
                        onChange={() => handlePrivacyToggle('data_sharing')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="th-privacy-card">
                  <div className="th-card-header-flex">
                    <div>
                      <h3 className="th-card-title">Analytics</h3>
                      <p className="th-card-description">
                        Help us improve by collecting usage data
                      </p>
                    </div>
                    <label className="th-toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.analytics}
                        onChange={() => handlePrivacyToggle('analytics')}
                      />
                      <span className="th-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="th-privacy-card danger">
                  <h3 className="th-card-title">
                    <FaTrash />
                    Delete Account
                  </h3>
                  <p className="th-card-description">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="danger" icon={<FaTrash />}>
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">Backup & Restore</h2>
                  <p className="th-section-subtitle">Manage your data backups</p>
                </div>
              </div>

              <div className="th-backup-content">
                <div className="th-backup-card">
                  <div className="th-backup-icon">
                    <FaDownload />
                  </div>
                  <h3 className="th-card-title">Create Backup</h3>
                  <p className="th-card-description">
                    Download a complete backup of your data including children records, staff information, and documents.
                  </p>
                  <Button variant="primary" icon={<FaDownload />} onClick={handleBackup}>
                    Create Backup Now
                  </Button>
                </div>

                <div className="th-backup-card">
                  <div className="th-backup-icon">
                    <FaUpload />
                  </div>
                  <h3 className="th-card-title">Restore Backup</h3>
                  <p className="th-card-description">
                    Restore your data from a previous backup file. This will overwrite current data.
                  </p>
                  <Button variant="outline" icon={<FaUpload />} onClick={handleRestore}>
                    Restore from Backup
                  </Button>
                </div>

                <div className="th-backup-history">
                  <h3 className="th-section-subtitle">Backup History</h3>
                  <div className="th-backup-list">
                    <div className="th-backup-item">
                      <div className="th-backup-info">
                        <h4>Full Backup - June 2024</h4>
                        <p>June 25, 2024 at 10:30 AM • 245 MB</p>
                      </div>
                      <Button variant="ghost" size="sm" icon={<FaDownload />}>
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="th-settings-section">
              <div className="th-section-header">
                <div>
                  <h2 className="th-section-title">About</h2>
                  <p className="th-section-subtitle">System information and version details</p>
                </div>
              </div>

              <div className="th-about-content">
                <div className="th-about-card">
                  <div className="th-about-logo">
                    <FaBuilding />
                  </div>
                  <h2 className="th-about-title">Tabitha Home</h2>
                  <p className="th-about-subtitle">Orphanage Management System</p>
                  
                  <div className="th-about-info">
                    <div className="th-info-item">
                      <span className="th-info-label">Version</span>
                      <span className="th-info-value">1.0.0</span>
                    </div>
                    <div className="th-info-item">
                      <span className="th-info-label">Build</span>
                      <span className="th-info-value">2024.06.001</span>
                    </div>
                    <div className="th-info-item">
                      <span className="th-info-label">Environment</span>
                      <span className="th-info-value">Production</span>
                    </div>
                    <div className="th-info-item">
                      <span className="th-info-label">License</span>
                      <span className="th-info-value">Commercial</span>
                    </div>
                  </div>

                  <div className="th-about-links">
                    <a href="#" className="th-about-link">Documentation</a>
                    <a href="#" className="th-about-link">Support</a>
                    <a href="#" className="th-about-link">Privacy Policy</a>
                    <a href="#" className="th-about-link">Terms of Service</a>
                  </div>

                  <p className="th-about-copyright">
                    © 2024 Tabitha Home. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
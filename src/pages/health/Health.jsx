// src/pages/health/Health.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaUserMd,
  FaHeartbeat,
  FaSyringe,
  FaPills,
  FaStethoscope,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaFileDownload
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { healthAPI } from '../../services/api';
import './Health.css';

const Health = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('overview'); // overview, records, vaccinations, checkups

  // Mock data - replace with actual API calls
  const healthStats = {
    total_children: 48,
    checkups_due: 12,
    vaccinations_due: 8,
    active_treatments: 5,
    critical_cases: 2
  };

  const upcomingCheckups = [
    {
      id: 1,
      child_name: 'Chidinma Okafor',
      child_id: 'TH-2024-001',
      checkup_type: 'General Checkup',
      due_date: '2024-07-02',
      priority: 'High',
      status: 'Pending'
    },
    {
      id: 2,
      child_name: 'Ibrahim Yusuf',
      child_id: 'TH-2024-015',
      checkup_type: 'Dental Checkup',
      due_date: '2024-07-05',
      priority: 'Medium',
      status: 'Scheduled'
    }
  ];

  const vaccinationsDue = [
    {
      id: 1,
      child_name: 'Amara Nwankwo',
      child_id: 'TH-2024-025',
      vaccine: 'Hepatitis B (2nd dose)',
      due_date: '2024-06-30',
      priority: 'High'
    }
  ];

  const recentRecords = [
    {
      id: 1,
      child_name: 'Fatima Hassan',
      child_id: 'TH-2024-008',
      record_type: 'Medical Visit',
      date: '2024-06-25',
      provider: 'Dr. Adebayo Johnson',
      diagnosis: 'Common Cold',
      status: 'Completed'
    }
  ];

  return (
    <div className="th-health">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaUserMd className="th-title-icon" />
              Health Management
            </h1>
            <p className="th-page-subtitle">
              Medical records, vaccinations, and health tracking for all children
            </p>
          </div>
          
          <div className="th-header-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<FaFileDownload />}
            >
              Export Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FaPlus />}
              onClick={() => navigate('/health/add-record')}
            >
              Add Health Record
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="th-health-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon th-primary">
            <FaHeartbeat />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{healthStats.total_children}</h3>
            <p className="th-stat-label">Total Children</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-warning">
            <FaCalendarCheck />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{healthStats.checkups_due}</h3>
            <p className="th-stat-label">Checkups Due</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-success">
            <FaSyringe />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{healthStats.vaccinations_due}</h3>
            <p className="th-stat-label">Vaccinations Due</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-accent">
            <FaPills />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{healthStats.active_treatments}</h3>
            <p className="th-stat-label">Active Treatments</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-error">
            <FaExclamationTriangle />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{healthStats.critical_cases}</h3>
            <p className="th-stat-label">Critical Cases</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="th-health-tabs">
        <button
          className={`th-tab ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          <FaStethoscope />
          Overview
        </button>
        <button
          className={`th-tab ${selectedView === 'records' ? 'active' : ''}`}
          onClick={() => setSelectedView('records')}
        >
          <FaFileDownload />
          Medical Records
        </button>
        <button
          className={`th-tab ${selectedView === 'vaccinations' ? 'active' : ''}`}
          onClick={() => setSelectedView('vaccinations')}
        >
          <FaSyringe />
          Vaccinations
        </button>
        <button
          className={`th-tab ${selectedView === 'checkups' ? 'active' : ''}`}
          onClick={() => setSelectedView('checkups')}
        >
          <FaCalendarCheck />
          Checkups
        </button>
      </div>

      {/* Content Area */}
      <div className="th-health-content">
        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="th-overview-grid">
            {/* Upcoming Checkups */}
            <div className="th-health-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaCalendarCheck />
                  Upcoming Checkups
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                {upcomingCheckups.map(checkup => (
                  <div key={checkup.id} className="th-checkup-item">
                    <div className="th-checkup-main">
                      <h4 className="th-checkup-child">{checkup.child_name}</h4>
                      <p className="th-checkup-type">{checkup.checkup_type}</p>
                    </div>
                    <div className="th-checkup-meta">
                      <span className={`th-priority-badge ${checkup.priority.toLowerCase()}`}>
                        {checkup.priority}
                      </span>
                      <span className="th-checkup-date">{checkup.due_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vaccinations Due */}
            <div className="th-health-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaSyringe />
                  Vaccinations Due
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                {vaccinationsDue.map(vaccine => (
                  <div key={vaccine.id} className="th-vaccine-item">
                    <div className="th-vaccine-main">
                      <h4 className="th-vaccine-child">{vaccine.child_name}</h4>
                      <p className="th-vaccine-name">{vaccine.vaccine}</p>
                    </div>
                    <div className="th-vaccine-meta">
                      <span className={`th-priority-badge ${vaccine.priority.toLowerCase()}`}>
                        {vaccine.priority}
                      </span>
                      <span className="th-vaccine-date">{vaccine.due_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Medical Records */}
            <div className="th-health-card th-full-width">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaHeartbeat />
                  Recent Medical Records
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                <div className="th-records-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Child Name</th>
                        <th>Record Type</th>
                        <th>Date</th>
                        <th>Provider</th>
                        <th>Diagnosis</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRecords.map(record => (
                        <tr key={record.id}>
                          <td>
                            <div className="th-child-cell">
                              <strong>{record.child_name}</strong>
                              <span className="th-child-id">{record.child_id}</span>
                            </div>
                          </td>
                          <td>{record.record_type}</td>
                          <td>{record.date}</td>
                          <td>{record.provider}</td>
                          <td>{record.diagnosis}</td>
                          <td>
                            <span className={`th-status-badge ${record.status.toLowerCase()}`}>
                              {record.status}
                            </span>
                          </td>
                          <td>
                            <Button variant="ghost" size="xs">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would show filtered content */}
        {selectedView !== 'overview' && (
          <div className="th-tab-placeholder">
            <FaChartLine className="th-placeholder-icon" />
            <h3>Coming Soon</h3>
            <p>This view is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;
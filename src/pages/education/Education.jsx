// src/pages/education/Education.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaTrophy,
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaChartBar,
  FaCalendarAlt,
  FaStar,
  FaAward,
  FaUserGraduate,
  FaFileDownload
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { educationAPI } from '../../services/api';
import './Education.css';

const Education = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('overview'); // overview, performance, attendance, reports
  const [selectedTerm, setSelectedTerm] = useState('current');

  // Mock data - replace with actual API calls
  const educationStats = {
    total_enrolled: 42,
    primary_students: 28,
    secondary_students: 14,
    average_attendance: 94,
    honor_roll: 8,
    needs_support: 5
  };

  const performanceData = [
    {
      id: 1,
      child_name: 'Chidinma Okafor',
      child_id: 'TH-2024-001',
      class: 'Primary 5',
      average_score: 92,
      attendance: 98,
      rank: 1,
      status: 'Excellent'
    },
    {
      id: 2,
      child_name: 'Ibrahim Yusuf',
      child_id: 'TH-2024-015',
      class: 'JSS 2',
      average_score: 78,
      attendance: 95,
      rank: 12,
      status: 'Good'
    },
    {
      id: 3,
      child_name: 'Fatima Hassan',
      child_id: 'TH-2024-008',
      class: 'Primary 3',
      average_score: 88,
      attendance: 96,
      rank: 3,
      status: 'Very Good'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      child_name: 'Amara Nwankwo',
      achievement: 'First Place - Mathematics Competition',
      date: '2024-06-20',
      type: 'Academic'
    },
    {
      id: 2,
      child_name: 'Tunde Adebayo',
      achievement: 'Perfect Attendance - Term 2',
      date: '2024-06-18',
      type: 'Attendance'
    }
  ];

  const upcomingExams = [
    {
      id: 1,
      subject: 'Mathematics',
      class: 'Primary 5',
      date: '2024-07-05',
      students: 12
    },
    {
      id: 2,
      subject: 'English Language',
      class: 'JSS 2',
      date: '2024-07-08',
      students: 8
    }
  ];

  const getPerformanceColor = (status) => {
    const colors = {
      'Excellent': 'success',
      'Very Good': 'primary',
      'Good': 'accent',
      'Fair': 'warning',
      'Needs Support': 'error'
    };
    return colors[status] || 'muted';
  };

  return (
    <div className="th-education">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaGraduationCap className="th-title-icon" />
              Education Management
            </h1>
            <p className="th-page-subtitle">
              Academic tracking, performance monitoring, and educational records
            </p>
          </div>
          
          <div className="th-header-actions">
            <select 
              className="th-term-selector"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="current">Current Term</option>
              <option value="term1">Term 1 - 2024</option>
              <option value="term2">Term 2 - 2024</option>
              <option value="term3">Term 3 - 2024</option>
            </select>
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
              onClick={() => navigate('/education/add-record')}
            >
              Add Record
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="th-education-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon th-primary">
            <FaUserGraduate />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.total_enrolled}</h3>
            <p className="th-stat-label">Total Enrolled</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-success">
            <FaBook />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.primary_students}</h3>
            <p className="th-stat-label">Primary Students</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-accent">
            <FaChalkboardTeacher />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.secondary_students}</h3>
            <p className="th-stat-label">Secondary Students</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-info">
            <FaCalendarAlt />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.average_attendance}%</h3>
            <p className="th-stat-label">Avg Attendance</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-warning">
            <FaTrophy />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.honor_roll}</h3>
            <p className="th-stat-label">Honor Roll</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-error">
            <FaFileAlt />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{educationStats.needs_support}</h3>
            <p className="th-stat-label">Needs Support</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="th-education-tabs">
        <button
          className={`th-tab ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          <FaChartBar />
          Overview
        </button>
        <button
          className={`th-tab ${selectedView === 'performance' ? 'active' : ''}`}
          onClick={() => setSelectedView('performance')}
        >
          <FaStar />
          Performance
        </button>
        <button
          className={`th-tab ${selectedView === 'attendance' ? 'active' : ''}`}
          onClick={() => setSelectedView('attendance')}
        >
          <FaCalendarAlt />
          Attendance
        </button>
        <button
          className={`th-tab ${selectedView === 'reports' ? 'active' : ''}`}
          onClick={() => setSelectedView('reports')}
        >
          <FaFileAlt />
          Report Cards
        </button>
      </div>

      {/* Content Area */}
      <div className="th-education-content">
        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="th-overview-grid">
            {/* Student Performance */}
            <div className="th-education-card th-full-width">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaStar />
                  Student Performance
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                <div className="th-performance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Average Score</th>
                        <th>Attendance</th>
                        <th>Rank</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map(student => (
                        <tr key={student.id}>
                          <td>
                            <div className="th-student-cell">
                              <strong>{student.child_name}</strong>
                              <span className="th-student-id">{student.child_id}</span>
                            </div>
                          </td>
                          <td>{student.class}</td>
                          <td>
                            <div className="th-score-cell">
                              <div className="th-score-bar">
                                <div 
                                  className="th-score-fill"
                                  style={{ width: `${student.average_score}%` }}
                                />
                              </div>
                              <span className="th-score-text">{student.average_score}%</span>
                            </div>
                          </td>
                          <td>{student.attendance}%</td>
                          <td>
                            <span className="th-rank-badge">#{student.rank}</span>
                          </td>
                          <td>
                            <span className={`th-status-badge ${getPerformanceColor(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="ghost" 
                              size="xs"
                              onClick={() => navigate(`/children/${student.child_id}/education`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="th-education-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaAward />
                  Recent Achievements
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                {recentAchievements.map(achievement => (
                  <div key={achievement.id} className="th-achievement-item">
                    <div className="th-achievement-icon">
                      <FaTrophy />
                    </div>
                    <div className="th-achievement-details">
                      <h4 className="th-achievement-student">{achievement.child_name}</h4>
                      <p className="th-achievement-title">{achievement.achievement}</p>
                      <div className="th-achievement-meta">
                        <span className={`th-achievement-type ${achievement.type.toLowerCase()}`}>
                          {achievement.type}
                        </span>
                        <span className="th-achievement-date">{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="th-education-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaFileAlt />
                  Upcoming Exams
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="th-card-body">
                {upcomingExams.map(exam => (
                  <div key={exam.id} className="th-exam-item">
                    <div className="th-exam-main">
                      <h4 className="th-exam-subject">{exam.subject}</h4>
                      <p className="th-exam-class">{exam.class}</p>
                    </div>
                    <div className="th-exam-meta">
                      <span className="th-exam-students">{exam.students} students</span>
                      <span className="th-exam-date">{exam.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would show filtered content */}
        {selectedView !== 'overview' && (
          <div className="th-tab-placeholder">
            <FaChartBar className="th-placeholder-icon" />
            <h3>Coming Soon</h3>
            <p>This view is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
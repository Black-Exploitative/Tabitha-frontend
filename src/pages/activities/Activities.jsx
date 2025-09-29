// src/pages/activities/Activities.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaHeart,
  FaFootballBall,
  FaMusic,
  FaPalette,
  FaPlus,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaImage,
  FaFileDownload,
  FaChartBar
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { activitiesAPI } from '../../services/api';
import './Activities.css';

const Activities = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('all'); // all, sports, arts, education, social
  const [selectedFilter, setSelectedFilter] = useState('upcoming'); // upcoming, ongoing, completed

  // Mock data - replace with actual API calls
  const activityStats = {
    total_activities: 24,
    active_programs: 8,
    participants: 42,
    upcoming_events: 5,
    completed_this_month: 12
  };

  const upcomingActivities = [
    {
      id: 1,
      title: 'Football Tournament',
      category: 'Sports',
      date: '2024-07-05',
      time: '14:00',
      location: 'Main Field',
      participants: 16,
      coordinator: 'Coach Adebayo',
      status: 'Upcoming',
      image: null
    },
    {
      id: 2,
      title: 'Art Exhibition',
      category: 'Arts',
      date: '2024-07-10',
      time: '10:00',
      location: 'Activity Hall',
      participants: 12,
      coordinator: 'Miss Kemi',
      status: 'Upcoming',
      image: null
    },
    {
      id: 3,
      title: 'Music Recital',
      category: 'Arts',
      date: '2024-07-15',
      time: '16:00',
      location: 'Assembly Hall',
      participants: 8,
      coordinator: 'Mr. Ibrahim',
      status: 'Upcoming',
      image: null
    }
  ];

  const ongoingPrograms = [
    {
      id: 1,
      name: 'Weekly Sports Training',
      category: 'Sports',
      schedule: 'Every Wednesday & Saturday',
      participants: 22,
      duration: '2 hours',
      progress: 65
    },
    {
      id: 2,
      name: 'Music Lessons',
      category: 'Arts',
      schedule: 'Every Tuesday & Thursday',
      participants: 15,
      duration: '1.5 hours',
      progress: 80
    }
  ];

  const recentHighlights = [
    {
      id: 1,
      title: 'Children\'s Day Celebration',
      date: '2024-05-27',
      category: 'Social',
      participants: 45,
      photos: 24,
      rating: 5
    },
    {
      id: 2,
      title: 'Inter-House Sports Competition',
      date: '2024-06-15',
      category: 'Sports',
      participants: 38,
      photos: 42,
      rating: 5
    }
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'Sports': FaFootballBall,
      'Arts': FaPalette,
      'Music': FaMusic,
      'Education': FaChartBar,
      'Social': FaHeart
    };
    return icons[category] || FaHeart;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sports': 'success',
      'Arts': 'primary',
      'Music': 'accent',
      'Education': 'info',
      'Social': 'warning'
    };
    return colors[category] || 'muted';
  };

  return (
    <div className="th-activities">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaHeart className="th-title-icon" />
              Activities & Events
            </h1>
            <p className="th-page-subtitle">
              Programs, events, and extracurricular activities for children
            </p>
          </div>
          
          <div className="th-header-actions">
            <select 
              className="th-filter-selector"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              icon={<FaFileDownload />}
            >
              Export Calendar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FaPlus />}
              onClick={() => navigate('/activities/add')}
            >
              Add Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="th-activities-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon th-primary">
            <FaHeart />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{activityStats.total_activities}</h3>
            <p className="th-stat-label">Total Activities</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-success">
            <FaCalendarAlt />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{activityStats.active_programs}</h3>
            <p className="th-stat-label">Active Programs</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-accent">
            <FaUsers />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{activityStats.participants}</h3>
            <p className="th-stat-label">Participants</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-warning">
            <FaClock />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{activityStats.upcoming_events}</h3>
            <p className="th-stat-label">Upcoming Events</p>
          </div>
        </div>

        <div className="th-stat-card">
          <div className="th-stat-icon th-info">
            <FaStar />
          </div>
          <div className="th-stat-details">
            <h3 className="th-stat-value">{activityStats.completed_this_month}</h3>
            <p className="th-stat-label">Completed This Month</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="th-activities-tabs">
        <button
          className={`th-tab ${selectedView === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedView('all')}
        >
          <FaHeart />
          All Activities
        </button>
        <button
          className={`th-tab ${selectedView === 'sports' ? 'active' : ''}`}
          onClick={() => setSelectedView('sports')}
        >
          <FaFootballBall />
          Sports
        </button>
        <button
          className={`th-tab ${selectedView === 'arts' ? 'active' : ''}`}
          onClick={() => setSelectedView('arts')}
        >
          <FaPalette />
          Arts & Crafts
        </button>
        <button
          className={`th-tab ${selectedView === 'music' ? 'active' : ''}`}
          onClick={() => setSelectedView('music')}
        >
          <FaMusic />
          Music
        </button>
      </div>

      {/* Content Area */}
      <div className="th-activities-content">
        <div className="th-activities-grid">
          {/* Upcoming Activities */}
          <div className="th-activities-section">
            <div className="th-section-header">
              <h2 className="th-section-title">
                <FaCalendarAlt />
                Upcoming Activities
              </h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="th-activities-list">
              {upcomingActivities.map(activity => {
                const CategoryIcon = getCategoryIcon(activity.category);
                const categoryColor = getCategoryColor(activity.category);

                return (
                  <div key={activity.id} className="th-activity-card">
                    <div className="th-activity-header">
                      <div className={`th-activity-icon ${categoryColor}`}>
                        <CategoryIcon />
                      </div>
                      <div className="th-activity-main">
                        <h3 className="th-activity-title">{activity.title}</h3>
                        <span className={`th-activity-category ${categoryColor}`}>
                          {activity.category}
                        </span>
                      </div>
                    </div>

                    <div className="th-activity-details">
                      <div className="th-activity-detail">
                        <FaCalendarAlt className="th-detail-icon" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="th-activity-detail">
                        <FaClock className="th-detail-icon" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="th-activity-detail">
                        <FaMapMarkerAlt className="th-detail-icon" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="th-activity-detail">
                        <FaUsers className="th-detail-icon" />
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>

                    <div className="th-activity-footer">
                      <span className="th-activity-coordinator">
                        Coordinator: {activity.coordinator}
                      </span>
                      <Button variant="ghost" size="xs">View Details</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="th-activities-sidebar">
            {/* Ongoing Programs */}
            <div className="th-sidebar-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaClock />
                  Ongoing Programs
                </h3>
              </div>
              <div className="th-card-body">
                {ongoingPrograms.map(program => (
                  <div key={program.id} className="th-program-item">
                    <div className="th-program-header">
                      <h4 className="th-program-name">{program.name}</h4>
                      <span className={`th-program-category ${getCategoryColor(program.category)}`}>
                        {program.category}
                      </span>
                    </div>
                    <p className="th-program-schedule">{program.schedule}</p>
                    <div className="th-program-meta">
                      <span className="th-program-participants">
                        <FaUsers /> {program.participants} students
                      </span>
                      <span className="th-program-duration">{program.duration}</span>
                    </div>
                    <div className="th-program-progress">
                      <div className="th-progress-bar">
                        <div 
                          className="th-progress-fill"
                          style={{ width: `${program.progress}%` }}
                        />
                      </div>
                      <span className="th-progress-text">{program.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Highlights */}
            <div className="th-sidebar-card">
              <div className="th-card-header">
                <h3 className="th-card-title">
                  <FaStar />
                  Recent Highlights
                </h3>
              </div>
              <div className="th-card-body">
                {recentHighlights.map(highlight => (
                  <div key={highlight.id} className="th-highlight-item">
                    <div className="th-highlight-image">
                      <FaImage />
                      <span className="th-photo-count">{highlight.photos}</span>
                    </div>
                    <div className="th-highlight-details">
                      <h4 className="th-highlight-title">{highlight.title}</h4>
                      <div className="th-highlight-meta">
                        <span className="th-highlight-date">{highlight.date}</span>
                        <span className="th-highlight-category">
                          {highlight.category}
                        </span>
                      </div>
                      <div className="th-highlight-footer">
                        <span className="th-highlight-participants">
                          <FaUsers /> {highlight.participants}
                        </span>
                        <div className="th-highlight-rating">
                          {[...Array(highlight.rating)].map((_, i) => (
                            <FaStar key={i} className="th-star-filled" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
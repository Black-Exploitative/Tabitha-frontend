// src/pages/calendar/Calendar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaUserMd,
  FaGraduationCap,
  FaFootballBall,
  FaBirthdayCake,
  FaCalendarCheck
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import './Calender.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Medical Checkup - Chidinma',
      type: 'medical',
      date: '2024-07-02',
      time: '09:00',
      duration: '30 min',
      location: 'Medical Room',
      attendees: ['Dr. Adebayo', 'Nurse Joy']
    },
    {
      id: 2,
      title: 'Football Tournament',
      type: 'sports',
      date: '2024-07-05',
      time: '14:00',
      duration: '3 hours',
      location: 'Main Field',
      attendees: ['16 children', 'Coach Adebayo']
    },
    {
      id: 3,
      title: 'School Exams Begin',
      type: 'education',
      date: '2024-07-08',
      time: '08:00',
      duration: 'All day',
      location: 'School',
      attendees: ['All students']
    },
    {
      id: 4,
      title: 'Birthday - Ibrahim Yusuf',
      type: 'birthday',
      date: '2024-07-12',
      time: '16:00',
      duration: '2 hours',
      location: 'Activity Hall',
      attendees: ['All children', 'Staff']
    },
    {
      id: 5,
      title: 'Staff Meeting',
      type: 'meeting',
      date: '2024-07-15',
      time: '10:00',
      duration: '1.5 hours',
      location: 'Conference Room',
      attendees: ['All staff members']
    }
  ];

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const getEventIcon = (type) => {
    const icons = {
      medical: FaUserMd,
      sports: FaFootballBall,
      education: FaGraduationCap,
      birthday: FaBirthdayCake,
      meeting: FaUsers
    };
    return icons[type] || FaCalendarCheck;
  };

  const getEventColor = (type) => {
    const colors = {
      medical: 'accent',
      sports: 'success',
      education: 'primary',
      birthday: 'warning',
      meeting: 'info'
    };
    return colors[type] || 'muted';
  };

  // Calendar generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const generateCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="th-calendar">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaCalendarAlt className="th-title-icon" />
              Calendar & Events
            </h1>
            <p className="th-page-subtitle">
              Manage schedules, appointments, and important dates
            </p>
          </div>
          
          <div className="th-header-actions">
            <div className="th-view-switcher">
              <button
                className={`th-view-btn ${selectedView === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedView('month')}
              >
                Month
              </button>
              <button
                className={`th-view-btn ${selectedView === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedView('week')}
              >
                Week
              </button>
              <button
                className={`th-view-btn ${selectedView === 'day' ? 'active' : ''}`}
                onClick={() => setSelectedView('day')}
              >
                Day
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<FaPlus />}
              onClick={() => navigate('/calendar/add')}
            >
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="th-calendar-grid">
        {/* Main Calendar */}
        <div className="th-calendar-main">
          <div className="th-calendar-card">
            {/* Calendar Header */}
            <div className="th-calendar-header">
              <button 
                className="th-month-nav-btn"
                onClick={() => changeMonth(-1)}
              >
                <FaChevronLeft />
              </button>
              <h2 className="th-calendar-title">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                className="th-month-nav-btn"
                onClick={() => changeMonth(1)}
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Day Names */}
            <div className="th-calendar-days-header">
              {dayNames.map(day => (
                <div key={day} className="th-day-name">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="th-calendar-days">
              {generateCalendarDays().map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isTodayDate = isToday(day);
                
                return (
                  <div
                    key={index}
                    className={`th-calendar-day ${!day ? 'empty' : ''} ${isTodayDate ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className="th-day-number">{day}</div>
                        {dayEvents.length > 0 && (
                          <div className="th-day-events">
                            {dayEvents.slice(0, 2).map(event => (
                              <div 
                                key={event.id} 
                                className={`th-day-event ${getEventColor(event.type)}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="th-more-events">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="th-calendar-sidebar">
          {/* Upcoming Events */}
          <div className="th-sidebar-card">
            <div className="th-card-header">
              <h3 className="th-card-title">
                <FaClock />
                Upcoming Events
              </h3>
            </div>
            <div className="th-card-body">
              {upcomingEvents.map(event => {
                const EventIcon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type);
                
                return (
                  <div key={event.id} className="th-event-item">
                    <div className={`th-event-icon ${colorClass}`}>
                      <EventIcon />
                    </div>
                    <div className="th-event-details">
                      <h4 className="th-event-title">{event.title}</h4>
                      <div className="th-event-meta">
                        <span className="th-event-date">
                          <FaCalendarAlt />
                          {formatDate(event.date)}
                        </span>
                        <span className="th-event-time">
                          <FaClock />
                          {event.time}
                        </span>
                      </div>
                      <div className="th-event-location">
                        <FaMapMarkerAlt />
                        {event.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Add */}
          <div className="th-sidebar-card">
            <div className="th-card-header">
              <h3 className="th-card-title">
                <FaPlus />
                Quick Add
              </h3>
            </div>
            <div className="th-card-body">
              <div className="th-quick-add-buttons">
                <button className="th-quick-add-btn medical">
                  <FaUserMd />
                  Medical Appointment
                </button>
                <button className="th-quick-add-btn education">
                  <FaGraduationCap />
                  Education Event
                </button>
                <button className="th-quick-add-btn sports">
                  <FaFootballBall />
                  Sports Activity
                </button>
                <button className="th-quick-add-btn birthday">
                  <FaBirthdayCake />
                  Birthday
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
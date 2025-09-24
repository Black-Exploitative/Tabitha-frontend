import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers,
  FaUserMd,
  FaHeart,
  FaGraduationCap,
  FaBirthdayCake,
  FaPlus,
  FaChevronRight
} from 'react-icons/fa';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import Button from '../UI/Button/Button';
import './UpcomingEvents.css';

const UpcomingEvents = ({ events = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventIcon = (type) => {
    const iconMap = {
      health: FaUserMd,
      family: FaHeart,
      education: FaGraduationCap,
      birthday: FaBirthdayCake,
      meeting: FaUsers,
      appointment: FaClock,
    };
    return iconMap[type] || FaCalendarAlt;
  };

  const getEventColor = (type) => {
    const colorMap = {
      health: 'accent',
      family: 'success',
      education: 'primary',
      birthday: 'warning',
      meeting: 'info',
      appointment: 'secondary',
    };
    return colorMap[type] || 'primary';
  };

  const formatEventDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return 'Today';
      } else if (isTomorrow(date)) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM dd');
      }
    } catch {
      return dateString;
    }
  };

  const formatEventTime = (timeString) => {
    try {
      // If timeString is already formatted (e.g., "09:00 AM"), return as is
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
      }
      
      // Parse time and format it
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getEventUrgency = (dateString) => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (diffHours <= 24) return 'urgent';
      if (diffHours <= 72) return 'soon';
      return 'normal';
    } catch {
      return 'normal';
    }
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    try {
      return parseISO(a.date).getTime() - parseISO(b.date).getTime();
    } catch {
      return 0;
    }
  });

  const displayEvents = sortedEvents.slice(0, 4);

  return (
    <div className="th-upcoming-events-widget th-widget">
      <div className="th-widget-header">
        <div className="th-events-header">
          <div>
            <h3 className="th-widget-title">
              <FaCalendarAlt className="th-title-icon" />
              Upcoming Events
            </h3>
            <p className="th-widget-subtitle">
              Scheduled activities and appointments
            </p>
          </div>
          
          <Button
            variant="glass"
            size="sm"
            icon={<FaPlus />}
            onClick={() => console.log('Add new event')}
          >
            Add Event
          </Button>
        </div>
      </div>

      <div className="th-events-list">
        {displayEvents.length > 0 ? (
          displayEvents.map((event) => {
            const Icon = getEventIcon(event.type);
            const color = getEventColor(event.type);
            const urgency = getEventUrgency(event.date);

            return (
              <div 
                key={event.id} 
                className={`th-event-item th-event-${color} th-event-${urgency}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="th-event-timeline">
                  <div className={`th-event-icon th-icon-${color}`}>
                    <Icon />
                  </div>
                  <div className="th-event-line"></div>
                </div>

                <div className="th-event-content">
                  <div className="th-event-header">
                    <h4 className="th-event-title">{event.title}</h4>
                    <div className="th-event-badges">
                      {urgency === 'urgent' && (
                        <span className="th-urgency-badge th-badge-urgent">
                          Urgent
                        </span>
                      )}
                      {urgency === 'soon' && (
                        <span className="th-urgency-badge th-badge-soon">
                          Soon
                        </span>
                      )}
                      <span className={`th-type-badge th-badge-${color}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  <div className="th-event-details">
                    <div className="th-event-datetime">
                      <div className="th-event-date">
                        <FaCalendarAlt className="th-detail-icon" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="th-event-time">
                        <FaClock className="th-detail-icon" />
                        <span>{formatEventTime(event.time)}</span>
                      </div>
                    </div>
                    
                    {event.participants && (
                      <div className="th-event-participants">
                        <FaUsers className="th-detail-icon" />
                        <span>{event.participants} participants</span>
                      </div>
                    )}
                  </div>

                  <div className="th-event-footer">
                    <button className="th-event-action-btn">
                      <span>View Details</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                {urgency === 'urgent' && (
                  <div className="th-event-pulse"></div>
                )}
              </div>
            );
          })
        ) : (
          <div className="th-events-empty">
            <div className="th-empty-icon">
              <FaCalendarAlt />
            </div>
            <h4>No Upcoming Events</h4>
            <p>No events scheduled at the moment.</p>
            <Button
              variant="outline"
              size="sm"
              icon={<FaPlus />}
              onClick={() => console.log('Add first event')}
            >
              Schedule Event
            </Button>
          </div>
        )}
      </div>

      {events.length > 4 && (
        <div className="th-widget-footer">
          <Button
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => console.log('View all events')}
          >
            View All Events ({events.length})
          </Button>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="th-event-modal-overlay" 
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="th-event-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="th-modal-header">
              <h3>{selectedEvent.title}</h3>
              <button 
                className="th-modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="th-modal-content">
              <div className="th-modal-details">
                <div className="th-modal-detail-item">
                  <FaCalendarAlt className="th-modal-icon" />
                  <div>
                    <label>Date</label>
                    <span>{formatEventDate(selectedEvent.date)}</span>
                  </div>
                </div>
                <div className="th-modal-detail-item">
                  <FaClock className="th-modal-icon" />
                  <div>
                    <label>Time</label>
                    <span>{formatEventTime(selectedEvent.time)}</span>
                  </div>
                </div>
                <div className="th-modal-detail-item">
                  <FaUsers className="th-modal-icon" />
                  <div>
                    <label>Participants</label>
                    <span>{selectedEvent.participants} people</span>
                  </div>
                </div>
              </div>
              
              <div className="th-modal-actions">
                <Button variant="outline" size="sm">
                  Edit Event
                </Button>
                <Button variant="primary" size="sm">
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
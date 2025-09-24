import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar,
  Sun,
  Cloud,
  CloudRain
} from 'lucide-react';
import './WelcomeWidget.css';

const WelcomeWidget = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({
    temp: 28,
    condition: 'sunny',
    description: 'Pleasant'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to make a difference in children's lives today?",
      "Your expertise brings healing and hope to young patients.",
      "Another day to provide compassionate care to children.",
      "Your dedication creates a safe haven for little ones.",
      "Today's opportunities to heal and comfort await."
    ];
    
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 86400000);
    return messages[dayOfYear % messages.length];
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun />;
      case 'cloudy': return <Cloud />;
      case 'rainy': return <CloudRain />;
      default: return <Sun />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserName = () => {
    if (!user) return 'Doctor';
    return user.first_name || 'Doctor';
  };

  const getUserRole = () => {
    if (!user || !user.position) return 'Healthcare Professional';
    return user.position;
  };

  const getUserDepartment = () => {
    if (!user || !user.department) return 'Care Team';
    return user.department;
  };

  const getShiftInfo = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 14) return 'Morning Shift';
    if (hour >= 14 && hour < 22) return 'Evening Shift';
    return 'Night Shift';
  };

  return (
    <div className="th-welcome-widget">
      <div className="th-welcome-content">
        <div className="th-welcome-main">
          <div className="th-welcome-greeting">
            <h1 className="th-welcome-title">
              {getGreeting()}, Dr. {getUserName()}
            </h1>
            <p className="th-welcome-subtitle">
              {getMotivationalMessage()}
            </p>
          </div>
          
          <div className="th-welcome-stats">
            <div className="th-welcome-stat">
              <span className="th-stat-label">Your Role</span>
              <span className="th-stat-value">{getUserRole()}</span>
            </div>
            <div className="th-welcome-stat">
              <span className="th-stat-label">Department</span>
              <span className="th-stat-value">{getUserDepartment()}</span>
            </div>
            <div className="th-welcome-stat">
              <span className="th-stat-label">Current Shift</span>
              <span className="th-stat-value">{getShiftInfo()}</span>
            </div>
          </div>
        </div>
        
        <div className="th-welcome-sidebar">
          <div className="th-welcome-info">
            <div className="th-info-header">
              <h3 className="th-info-title">Today's Info</h3>
            </div>
            
            <div className="th-info-item">
              <div className="th-info-icon time">
                <Clock />
              </div>
              <div className="th-info-content">
                <span className="th-info-label">Current Time</span>
                <span className="th-info-value">{formatTime(currentTime)}</span>
              </div>
            </div>
            
            <div className="th-info-item">
              <div className="th-info-icon location">
                <MapPin />
              </div>
              <div className="th-info-content">
                <span className="th-info-label">Location</span>
                <span className="th-info-value">Tabitha Home, Lagos</span>
              </div>
            </div>
            
            <div className="th-info-item">
              <div className="th-info-icon health">
                <Calendar />
              </div>
              <div className="th-info-content">
                <span className="th-info-label">Date</span>
                <span className="th-info-value">{formatDate(currentTime)}</span>
              </div>
            </div>
            
            <div className="th-weather-widget">
              <div className="th-weather-icon">
                {getWeatherIcon()}
              </div>
              <div>
                <p className="th-weather-temp">{weather.temp}°C</p>
                <p className="th-weather-desc">{weather.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWidget;
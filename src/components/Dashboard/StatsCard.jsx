import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './StatsCard.css';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary',
  trend = 'up',
  onClick = null,
  className = ''
}) => {
  const cardClasses = [
    'th-stats-card',
    `th-stats-card-${color}`,
    onClick ? 'th-stats-card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="th-stats-card-background">
        <div className="th-stats-card-pattern"></div>
      </div>
      
      <div className="th-stats-card-content">
        <div className="th-stats-card-header">
          <div className={`th-stats-card-icon th-stats-icon-${color}`}>
            <Icon />
          </div>
          <div className={`th-stats-card-change ${isPositive ? 'th-change-positive' : 'th-change-negative'}`}>
            <TrendIcon className="th-change-icon" />
            <span className="th-change-value">{Math.abs(change)}%</span>
          </div>
        </div>
        
        <div className="th-stats-card-body">
          <h3 className="th-stats-card-value">{value}</h3>
          <p className="th-stats-card-title">{title}</p>
        </div>
        
        <div className="th-stats-card-footer">
          <div className="th-stats-card-indicator">
            <div className={`th-indicator-bar th-indicator-${color}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
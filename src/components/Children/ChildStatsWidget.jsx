import React from 'react';
import { 
  FaHeart, 
  FaCalendarAlt, 
  FaRuler, 
  FaWeight,
  FaArrowUp,
  FaArrowDown,
  FaEquals
} from 'react-icons/fa';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import './ChildStatsWidget.css';

const ChildStatsWidget = ({ child, derived }) => {
  // Calculate BMI category
  const getBMICategory = (bmi, age) => {
    // Simplified BMI categories for children
    if (bmi < 16) return { category: 'Underweight', color: 'warning', trend: 'down' };
    if (bmi < 25) return { category: 'Normal', color: 'success', trend: 'equal' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning', trend: 'up' };
    return { category: 'Obese', color: 'error', trend: 'up' };
  };

  // Calculate days since admission
  const daysSinceAdmission = differenceInDays(new Date(), new Date(child.admission_date));
  
  // Calculate health score based on various factors
  const calculateHealthScore = () => {
    let score = 80; // Base score
    
    // Adjust based on health status
    const healthMultipliers = {
      'Excellent': 1.2,
      'Good': 1.0,
      'Fair': 0.8,
      'Poor': 0.6
    };
    
    score *= healthMultipliers[child.health_status] || 1.0;
    
    // Adjust based on BMI
    const bmiInfo = getBMICategory(derived.bmi, derived.age);
    if (bmiInfo.category === 'Normal') score += 10;
    else if (bmiInfo.category === 'Underweight' || bmiInfo.category === 'Overweight') score -= 5;
    else score -= 15;
    
    // Adjust based on behavioral score
    if (child.behavioral_assessment_score >= 8) score += 5;
    else if (child.behavioral_assessment_score < 6) score -= 10;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const bmiInfo = getBMICategory(derived.bmi, derived.age);
  const healthScore = calculateHealthScore();
  const TrendIcon = bmiInfo.trend === 'up' ? FaArrowUp : bmiInfo.trend === 'down' ? FaArrowDown : FaEquals;

  const stats = [
    {
      id: 'health-score',
      label: 'Overall Health Score',
      value: `${healthScore}%`,
      icon: FaHeart,
      color: healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'error',
      description: 'Comprehensive health assessment'
    },
    {
      id: 'time-at-home',
      label: 'Time at Tabitha Home',
      value: daysSinceAdmission,
      unit: 'days',
      icon: FaCalendarAlt,
      color: 'primary',
      description: derived.timeAtHome
    },
    {
      id: 'bmi',
      label: 'BMI Status',
      value: derived.bmi,
      icon: TrendIcon,
      color: bmiInfo.color,
      description: bmiInfo.category,
      trend: bmiInfo.trend
    },
    {
      id: 'behavioral',
      label: 'Behavioral Score',
      value: child.behavioral_assessment_score,
      unit: '/10',
      icon: FaHeart,
      color: child.behavioral_assessment_score >= 8 ? 'success' : child.behavioral_assessment_score >= 6 ? 'primary' : 'warning',
      description: 'Social and behavioral assessment'
    }
  ];

  return (
    <div className="th-child-stats-widget">
      <div className="th-stats-header">
        <h3 className="th-stats-title">Health & Wellness Overview</h3>
        <p className="th-stats-subtitle">Key metrics and indicators</p>
      </div>
      
      <div className="th-stats-grid">
        {stats.map(stat => {
          const StatIcon = stat.icon;
          
          return (
            <div key={stat.id} className={`th-stat-item th-stat-${stat.color}`}>
              <div className="th-stat-icon-container">
                <div className={`th-stat-icon th-icon-${stat.color}`}>
                  <StatIcon />
                </div>
                {stat.trend && (
                  <div className={`th-trend-indicator th-trend-${stat.trend}`}>
                    <TrendIcon />
                  </div>
                )}
              </div>
              
              <div className="th-stat-content">
                <div className="th-stat-value">
                  {stat.value}
                  {stat.unit && <span className="th-stat-unit">{stat.unit}</span>}
                </div>
                <div className="th-stat-label">{stat.label}</div>
                <div className="th-stat-description">{stat.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Health Metrics */}
      <div className="th-health-metrics">
        <div className="th-metric-row">
          <div className="th-metric-item">
            <FaRuler className="th-metric-icon" />
            <div className="th-metric-info">
              <span className="th-metric-label">Height</span>
              <span className="th-metric-value">{child.height_cm} cm</span>
            </div>
          </div>
          
          <div className="th-metric-item">
            <FaWeight className="th-metric-icon" />
            <div className="th-metric-info">
              <span className="th-metric-label">Weight</span>
              <span className="th-metric-value">{child.weight_kg} kg</span>
            </div>
          </div>
        </div>
        
        <div className="th-immunization-status">
          <span className="th-immunization-label">Immunization Status:</span>
          <span className={`th-immunization-value ${child.immunization_status === 'Up to date' ? 'th-status-current' : 'th-status-pending'}`}>
            {child.immunization_status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChildStatsWidget;
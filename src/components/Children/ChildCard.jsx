import React, { useState } from 'react';
import { 
  FaUser, 
  FaChevronDown,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import Button from '../UI/Button/Button';
import './ChildCard.css';

const ChildCard = ({ child, onView, onEdit, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safe calculations
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    if (!isValid(birth)) return 'N/A';
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? `${age}y` : 'N/A';
  };

  const getAdmissionTime = (admissionDate) => {
    if (!admissionDate) return 'N/A';
    const admission = new Date(admissionDate);
    if (!isValid(admission)) return 'N/A';
    
    try {
      return formatDistanceToNow(admission, { addSuffix: true }).replace(' ago', '');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return 'N/A';
    
    try {
      return format(d, 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'Exited': 'muted',
      'Transferred': 'primary',
      'Adopted': 'success',
      'Inactive': 'warning'
    };
    return statusColors[status] || 'muted';
  };

  const getHealthStatusColor = (status) => {
    const healthColors = {
      'Excellent': 'success',
      'Good': 'success',
      'Fair': 'warning',
      'Poor': 'error'
    };
    return healthColors[status] || '';
  };

  // Safe property access
  const firstName = child.first_name || 'Unknown';
  const lastName = child.last_name || '';
  const middleName = child.middle_name || '';
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();
  const childId = child.child_id || child.id || 'N/A';
  const age = calculateAge(child.date_of_birth);
  const gender = child.gender || 'N/A';
  const stateOfOrigin = child.state_of_origin || 'N/A';
  const educationLevel = child.education_level || 'N/A';
  const healthStatus = child.health_status || 'N/A';
  const currentStatus = child.current_status || 'Unknown';
  const admissionTime = getAdmissionTime(child.admission_date);
  const statusColor = getStatusColor(currentStatus);
  const healthColor = getHealthStatusColor(healthStatus);

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleView = (e) => {
    e.stopPropagation();
    if (onView && typeof onView === 'function') {
      onView(child);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(child);
    }
  };

  return (
    <div className={`th-child-card ${isExpanded ? 'expanded' : ''} ${className}`}>
      <div className="th-child-card-row" onClick={handleToggleExpand}>
        {/* Photo */}
        <div className="th-child-photo">
          {child.photo_url ? (
            <img 
              src={child.photo_url} 
              alt={fullName}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="th-photo-placeholder" 
            style={{ display: child.photo_url ? 'none' : 'flex' }}
          >
            <FaUser />
          </div>
          <div className={`th-status-dot th-status-${statusColor}`}></div>
        </div>

        {/* Name */}
        <div className="th-child-name-col">
          <div className="th-child-name">{fullName}</div>
          <div className="th-child-id">{childId}</div>
        </div>

        {/* Age */}
        <div className="th-data-col age">
          <div className="th-data-label">Age</div>
          <div className="th-data-value">{age}</div>
        </div>

        {/* Gender */}
        <div className="th-data-col gender">
          <div className="th-data-label">Gender</div>
          <div className="th-data-value">{gender}</div>
        </div>

        {/* Origin */}
        <div className="th-data-col origin">
          <div className="th-data-label">Origin</div>
          <div className="th-data-value">{stateOfOrigin}</div>
        </div>

        {/* Education */}
        <div className="th-data-col education">
          <div className="th-data-label">Education</div>
          <div className="th-data-value">{educationLevel}</div>
        </div>

        {/* Health */}
        <div className="th-data-col health">
          <div className="th-data-label">Health</div>
          <div className={`th-data-value th-health-${healthColor}`}>
            {healthStatus}
          </div>
        </div>

        {/* Admitted */}
        <div className="th-data-col admitted">
          <div className="th-data-label">Admitted</div>
          <div className="th-data-value">{admissionTime}</div>
        </div>

        {/* Status */}
        <div className="th-status-col">
          <span className={`th-status-badge th-badge-${statusColor}`}>
            {currentStatus}
          </span>
        </div>

        {/* Actions */}
        <div className="th-actions-col">
          <button 
            className={`th-expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggleExpand}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <FaChevronDown />
          </button>
          <Button
            variant="ghost"
            size="xs"
            icon={<FaEye />}
            onClick={handleView}
            title="View"
          />
          <Button
            variant="ghost"
            size="xs"
            icon={<FaEdit />}
            onClick={handleEdit}
            title="Edit"
          />
        </div>
      </div>

      {/* Expanded Details */}
      <div className="th-child-details">
        <div className="th-details-grid">
          {/* Personal Information */}
          <div className="th-details-section">
            <div className="th-details-title">Personal Information</div>
            <div className="th-details-row">
              <span className="th-details-label">Full Name</span>
              <span className="th-details-value">{fullName}</span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">Date of Birth</span>
              <span className="th-details-value">{formatDate(child.date_of_birth)}</span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">Gender</span>
              <span className="th-details-value">{gender}</span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">State of Origin</span>
              <span className="th-details-value">{stateOfOrigin}</span>
            </div>
            {child.preferred_language && (
              <div className="th-details-row">
                <span className="th-details-label">Language</span>
                <span className="th-details-value">{child.preferred_language}</span>
              </div>
            )}
          </div>

          {/* Medical Information */}
          <div className="th-details-section">
            <div className="th-details-title">Medical Information</div>
            <div className="th-details-row">
              <span className="th-details-label">Health Status</span>
              <span className={`th-details-value th-health-${healthColor}`}>
                {healthStatus}
              </span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">Blood Type</span>
              <span className="th-details-value">{child.blood_type || 'N/A'}</span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">Genotype</span>
              <span className="th-details-value">{child.genotype || 'N/A'}</span>
            </div>
            {child.last_checkup && (
              <div className="th-details-row">
                <span className="th-details-label">Last Checkup</span>
                <span className="th-details-value">{formatDate(child.last_checkup)}</span>
              </div>
            )}
          </div>

          {/* Care Information */}
          <div className="th-details-section">
            <div className="th-details-title">Care Information</div>
            <div className="th-details-row">
              <span className="th-details-label">Current Status</span>
              <span className="th-details-value">{currentStatus}</span>
            </div>
            <div className="th-details-row">
              <span className="th-details-label">Admission Date</span>
              <span className="th-details-value">{formatDate(child.admission_date)}</span>
            </div>
            {child.case_worker && (
              <div className="th-details-row">
                <span className="th-details-label">Case Worker</span>
                <span className="th-details-value">{child.case_worker}</span>
              </div>
            )}
          </div>

          {/* Education & Aspirations */}
          <div className="th-details-section">
            <div className="th-details-title">Education & Goals</div>
            <div className="th-details-row">
              <span className="th-details-label">Education Level</span>
              <span className="th-details-value">{educationLevel}</span>
            </div>
            {child.school_name && (
              <div className="th-details-row">
                <span className="th-details-label">School</span>
                <span className="th-details-value">{child.school_name}</span>
              </div>
            )}
            {child.ambition && (
              <div className="th-details-row">
                <span className="th-details-label">Ambition</span>
                <span className="th-details-value">{child.ambition}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="th-details-actions">
            <Button
              variant="primary"
              size="sm"
              icon={<FaEye />}
              onClick={handleView}
            >
              View Full Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FaEdit />}
              onClick={handleEdit}
            >
              Edit Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildCard;
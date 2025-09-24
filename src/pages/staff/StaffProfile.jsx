// src/pages/staff/StaffProfile.jsx - Following established patterns
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FaArrowLeft,
  FaEdit,
  FaPrint,
  FaDownload,
  FaUser,   
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarAlt,
  FaIdCard,
  FaGraduationCap,
  FaUserCheck,
  FaUserClock,
  FaExclamationTriangle,
  FaUserTie,
  FaUserMd,
  FaUsers,
  FaShieldAlt,
  FaEye,
  FaMoneyBillAlt,
  FaClock,
  FaFolder,
  FaFileAlt,
  FaPlus
} from 'react-icons/fa';
import { format, differenceInYears, differenceInDays, parseISO } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { staffService } from '../../services/staff';
import { useAuth } from '../../context/AuthContext';
import './StaffProfile.css';

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch staff data using your existing API
  const { 
    data: staffData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    try {
      return differenceInYears(new Date(), parseISO(birthDate));
    } catch (error) {
      return 'N/A';
    }
  };

  const calculateTenure = (hireDate) => {
    if (!hireDate) return 'N/A';
    try {
      const years = differenceInYears(new Date(), parseISO(hireDate));
      const days = differenceInDays(new Date(), parseISO(hireDate));
      
      if (years >= 1) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        const months = Math.floor(days / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'On Leave': 'warning',
      'Suspended': 'error',
      'Terminated': 'error'
    };
    return statusColors[status] || 'muted';
  };

  const getDepartmentIcon = (department) => {
    const iconMap = {
      'Administration': FaUserTie,
      'Medical': FaUserMd,
      'Education': FaGraduationCap,
      'Child Care': FaUsers,
      'Security': FaShieldAlt,
      'Kitchen': FaUsers,
      'Maintenance': FaUsers,
      'Social Services': FaUsers
    };
    return iconMap[department] || FaUsers;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  if (isLoading) {
    return (
      <div className="th-staff-profile-loading">
        <LoadingSpinner size="lg" />
        <p>Loading staff profile...</p>
      </div>
    );
  }

  if (error || !staffData?.data) {
    return (
      <div className="th-staff-profile-error">
        <h2>Error Loading Staff Profile</h2>
        <p>Unable to load staff profile: {error?.message || 'Staff member not found'}</p>
        <div className="th-error-actions">
          <Button onClick={refetch} variant="primary">
            Retry
          </Button>
          <Button onClick={() => navigate('/staff')} variant="outline">
            Back to Staff List
          </Button>
        </div>
      </div>
    );
  }

  const staff = staffData.data;
  const age = calculateAge(staff.date_of_birth);
  const tenure = calculateTenure(staff.date_hired);
  const statusColor = getStatusColor(staff.employment_status);
  const DepartmentIcon = getDepartmentIcon(staff.department);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaEye },
    { id: 'contact', label: 'Contact', icon: FaPhone },
    { id: 'employment', label: 'Employment', icon: FaIdCard },
    { id: 'documents', label: 'Documents', icon: FaFolder }
  ];

  return (
    <div className="th-staff-profile">
      {/* Header */}
      <div className="th-profile-header">
        <div className="th-header-navigation">
          <button
            className="th-back-btn"
            onClick={() => navigate('/staff')}
          >
            <FaArrowLeft />
            Back to Staff
          </button>
        </div>

        <div className="th-profile-main">
          <div className="th-profile-photo-section">
            <div className="th-profile-photo">
              {staff.photo_url ? (
                <img 
                  src={staff.photo_url} 
                  alt={`${staff.first_name} ${staff.last_name}`} 
                />
              ) : (
                <div className="th-avatar-placeholder-large">
                  <span className="th-avatar-initials">
                    {staff.first_name?.[0]}{staff.last_name?.[0]}
                  </span>
                </div>
              )}
              <div className={`th-status-indicator-large ${statusColor}`}></div>
            </div>
            
            <div className="th-staff-details">
              <h1 className="th-staff-full-name">
                {staff.first_name} {staff.middle_name || ''} {staff.last_name}
              </h1>
              <p className="th-staff-position">{staff.position}</p>
              <p className="th-staff-department">
                <DepartmentIcon className="th-department-icon" />
                {staff.department} Department
              </p>
              <p className="th-staff-employee-id">
                Employee ID: {staff.employee_id || 'Unassigned'}
              </p>
              
              <div className="th-staff-status-badges">
                <span className={`th-status-badge ${statusColor}`}>
                  {staff.employment_status}
                </span>
                {staff.role && (
                  <span className="th-role-badge">
                    {staff.role.replace('_', ' ').toUpperCase()}
                  </span>
                )}
                {staff.employment_type && (
                  <span className="th-type-badge">
                    {staff.employment_type}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="th-header-actions">
            {user?.permissions?.includes('staff.update') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/staff/${id}/edit`)}
                icon={<FaEdit />}
              >
                Edit Profile
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<FaPrint />}
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FaDownload />}
              onClick={() => console.log('Export functionality')}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="th-quick-stats">
        <div className="th-stat-item">
          <FaCalendarAlt className="th-stat-icon" />
          <div className="th-stat-content">
            <span className="th-stat-value">{tenure}</span>
            <span className="th-stat-label">Tenure</span>
          </div>
        </div>
        
        <div className="th-stat-item">
          <FaBirthdayCake className="th-stat-icon" />
          <div className="th-stat-content">
            <span className="th-stat-value">{age} years</span>
            <span className="th-stat-label">Age</span>
          </div>
        </div>
        
        <div className="th-stat-item">
          <FaMoneyBillAlt className="th-stat-icon" />
          <div className="th-stat-content">
            <span className="th-stat-value">{formatSalary(staff.salary)}</span>
            <span className="th-stat-label">Monthly Salary</span>
          </div>
        </div>
        
        <div className="th-stat-item">
          <FaClock className="th-stat-icon" />
          <div className="th-stat-content">
            <span className="th-stat-value">
              {staff.last_login ? formatDate(staff.last_login) : 'Never'}
            </span>
            <span className="th-stat-label">Last Login</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="th-profile-tabs">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button 
              key={tab.id}
              className={`th-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="th-tab-content">
        {activeTab === 'overview' && (
          <div className="th-overview-content">
            <div className="th-content-grid">
              {/* Personal Information */}
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaUser className="th-card-icon" />
                    Personal Information
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-info-grid">
                    <div className="th-info-item">
                      <span className="th-info-label">Full Name</span>
                      <span className="th-info-value">
                        {staff.first_name} {staff.middle_name || ''} {staff.last_name}
                      </span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Date of Birth</span>
                      <span className="th-info-value">{formatDate(staff.date_of_birth)}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Gender</span>
                      <span className="th-info-value">{staff.gender || 'Not specified'}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Marital Status</span>
                      <span className="th-info-value">{staff.marital_status || 'Not specified'}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">NIN</span>
                      <span className="th-info-value">{staff.nin || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaPhone className="th-card-icon" />
                    Contact Information
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-contact-list">
                    <div className="th-contact-item">
                      <FaPhone className="th-contact-icon" />
                      <div className="th-contact-details">
                        <span className="th-contact-label">Phone</span>
                        <span className="th-contact-value">{staff.phone}</span>
                      </div>
                    </div>
                    
                    <div className="th-contact-item">
                      <FaEnvelope className="th-contact-icon" />
                      <div className="th-contact-details">
                        <span className="th-contact-label">Email</span>
                        <span className="th-contact-value">{staff.email}</span>
                      </div>
                    </div>
                    
                    {staff.address && (
                      <div className="th-contact-item">
                        <FaMapMarkerAlt className="th-contact-icon" />
                        <div className="th-contact-details">
                          <span className="th-contact-label">Address</span>
                          <span className="th-contact-value">
                            {[
                              staff.address.street,
                              staff.address.city,
                              staff.address.state,
                              staff.address.postal_code
                            ].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaIdCard className="th-card-icon" />
                    Employment Details
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-info-grid">
                    <div className="th-info-item">
                      <span className="th-info-label">Position</span>
                      <span className="th-info-value">{staff.position}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Department</span>
                      <span className="th-info-value">{staff.department}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Employment Type</span>
                      <span className="th-info-value">{staff.employment_type || 'Not specified'}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Hire Date</span>
                      <span className="th-info-value">{formatDate(staff.date_hired)}</span>
                    </div>
                    
                    <div className="th-info-item">
                      <span className="th-info-label">Employment Status</span>
                      <span className={`th-info-value status-${statusColor}`}>
                        {staff.employment_status}
                      </span>
                    </div>
                    
                    {staff.role && (
                      <div className="th-info-item">
                        <span className="th-info-label">System Role</span>
                        <span className="th-info-value">
                          {staff.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {staff.emergency_contact && (
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">
                      <FaShieldAlt className="th-card-icon" />
                      Emergency Contact
                    </h3>
                  </div>
                  <div className="th-card-body">
                    <div className="th-emergency-contact">
                      <div className="th-emergency-item">
                        <span className="th-emergency-label">Name</span>
                        <span className="th-emergency-value">{staff.emergency_contact.name}</span>
                      </div>
                      
                      <div className="th-emergency-item">
                        <span className="th-emergency-label">Relationship</span>
                        <span className="th-emergency-value">{staff.emergency_contact.relationship}</span>
                      </div>
                      
                      <div className="th-emergency-item">
                        <span className="th-emergency-label">Phone</span>
                        <span className="th-emergency-value">{staff.emergency_contact.phone}</span>
                      </div>
                      
                      {staff.emergency_contact.address && (
                        <div className="th-emergency-item">
                          <span className="th-emergency-label">Address</span>
                          <span className="th-emergency-value">{staff.emergency_contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="th-contact-content">
            <div className="th-content-grid">
              {/* Contact Methods */}
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">Contact Methods</h3>
                </div>
                <div className="th-card-body">
                  <div className="th-contact-methods">
                    <div className="th-contact-method">
                      <FaPhone className="th-method-icon" />
                      <div className="th-method-details">
                        <h4>Primary Phone</h4>
                        <p>{staff.phone}</p>
                        <Button size="sm" variant="outline">
                          Call
                        </Button>
                      </div>
                    </div>
                    
                    <div className="th-contact-method">
                      <FaEnvelope className="th-method-icon" />
                      <div className="th-method-details">
                        <h4>Email Address</h4>
                        <p>{staff.email}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `mailto:${staff.email}`}
                        >
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              {staff.address && (
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">Address</h3>
                  </div>
                  <div className="th-card-body">
                    <div className="th-address-details">
                      {staff.address.street && (
                        <p><strong>Street:</strong> {staff.address.street}</p>
                      )}
                      {staff.address.city && (
                        <p><strong>City:</strong> {staff.address.city}</p>
                      )}
                      {staff.address.state && (
                        <p><strong>State:</strong> {staff.address.state}</p>
                      )}
                      {staff.address.lga && (
                        <p><strong>LGA:</strong> {staff.address.lga}</p>
                      )}
                      {staff.address.postal_code && (
                        <p><strong>Postal Code:</strong> {staff.address.postal_code}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="th-employment-content">
            <div className="th-content-grid">
              {/* Employment Summary */}
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">Employment Summary</h3>
                </div>
                <div className="th-card-body">
                  <div className="th-employment-summary">
                    <div className="th-summary-item">
                      <span className="th-summary-label">Current Position</span>
                      <span className="th-summary-value">{staff.position}</span>
                    </div>
                    
                    <div className="th-summary-item">
                      <span className="th-summary-label">Department</span>
                      <span className="th-summary-value">{staff.department}</span>
                    </div>
                    
                    <div className="th-summary-item">
                      <span className="th-summary-label">Tenure</span>
                      <span className="th-summary-value">{tenure}</span>
                    </div>
                    
                    <div className="th-summary-item">
                      <span className="th-summary-label">Monthly Salary</span>
                      <span className="th-summary-value">{formatSalary(staff.salary)}</span>
                    </div>
                    
                    <div className="th-summary-item">
                      <span className="th-summary-label">Employment Status</span>
                      <span className={`th-summary-value status-${statusColor}`}>
                        {staff.employment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              {staff.permissions && staff.permissions.length > 0 && (
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">System Permissions</h3>
                  </div>
                  <div className="th-card-body">
                    <div className="th-permissions-list">
                      {staff.permissions.map((permission, index) => (
                        <span key={index} className="th-permission-badge">
                          {permission.replace('_', ' ').replace('.', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="th-documents-content">
            <div className="th-content-grid">
              <div className="th-info-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">Documents</h3>
                  {user?.permissions?.includes('documents.create') && (
                    <Button 
                      size="sm" 
                      icon={<FaPlus />}
                      onClick={() => console.log('Add document functionality')}
                    >
                      Add Document
                    </Button>
                  )}
                </div>
                <div className="th-card-body">
                  {staff.documents && staff.documents.length > 0 ? (
                    <div className="th-documents-list">
                      {staff.documents.map((doc, index) => (
                        <div key={index} className="th-document-item">
                          <FaFileAlt className="th-document-icon" />
                          <div className="th-document-details">
                            <h4>{doc.name}</h4>
                            <p>{doc.type}</p>
                            <span className="th-upload-date">
                              Uploaded: {formatDate(doc.uploaded_at)}
                            </span>
                          </div>
                          <div className="th-document-actions">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              icon={<FaEye />}
                              onClick={() => console.log('View document:', doc.name)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              icon={<FaDownload />}
                              onClick={() => console.log('Download document:', doc.name)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="th-empty-documents">
                      <FaFileAlt className="th-empty-icon" />
                      <p>No documents uploaded yet</p>
                      {user?.permissions?.includes('documents.create') && (
                        <Button 
                          variant="primary" 
                          icon={<FaPlus />}
                          onClick={() => console.log('Upload first document functionality')}
                        >
                          Upload First Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
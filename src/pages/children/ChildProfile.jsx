import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaPrint, 
  FaDownload,
  FaUser, 
  FaHeart,
  FaGraduationCap,
  FaFileAlt,
  FaCamera,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStethoscope,
  FaArrowUp,
  FaPlus,
  FaEye,
  FaShare,
  FaFlag,
  FaMale,
  FaFemale,
  FaWeight,
  FaRuler
} from 'react-icons/fa';
import { format, formatDistanceToNow, differenceInYears } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import ChildStatsWidget from '../../components/Children/ChildStatsWidget';
import MedicalHistory from '../../components/Children/MedicalHistory';
import EducationProgress from '../../components/Children/EducationProgress';
import GrowthChart from '../../components/Children/GrowthChart';
import DocumentsList from '../../components/Children/DocumentsList';
import CaseNotes from '../../components/Children/CaseNotes';
import FamilyContacts from '../../components/Children/FamilyContacts';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { childrenService } from '../../services/children';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ChildProfile.css';

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch child data
  const { 
    data: child, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['child', id],
    queryFn: () => childrenService.getChild(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mock data for development
  const mockChild = {
    id: 1,
    child_id: 'TH-2024-001',
    first_name: 'Sarah',
    middle_name: 'Adunni',
    last_name: 'Adebayo',
    date_of_birth: '2015-03-15',
    gender: 'Female',
    admission_date: '2024-01-15',
    current_status: 'Active',
    state_of_origin: 'Lagos',
    lga: 'Ikeja',
    nationality: 'Nigerian',
    preferred_language: 'Yoruba',
    religion: 'Christianity',
    tribal_marks: 'Small tribal marks on both cheeks',
    education_level: 'Primary 4',
    school_name: 'St. Mary\'s Primary School',
    ambition: 'Doctor',
    health_status: 'Good',
    genotype: 'AA',
    blood_type: 'O+',
    height_cm: 120,
    weight_kg: 25,
    allergies: 'Peanuts, Shellfish',
    medical_conditions: 'Mild asthma, controlled with inhaler',
    immunization_status: 'Up to date',
    photo_url: null,
    legal_guardian_name: 'Mrs. Kemi Adebayo',
    legal_guardian_contact: '+234 803 123 4567',
    next_of_kin_name: 'Mr. Tunde Adebayo',
    next_of_kin_contact: '+234 805 987 6543',
    emergency_contact: '+234 803 123 4567',
    birth_certificate_number: 'BC/LAG/2015/123456',
    government_registration_number: 'GRN/TH/2024/001',
    court_case_number: 'CC/FCT/2024/789',
    arrival_circumstances: 'Sarah was brought to Tabitha Home after her parents were involved in a car accident. Her aunt, who was caring for her, was unable to continue due to financial constraints.',
    case_worker: 'Dr. Amina Hassan',
    social_worker_notes: 'Sarah is a bright and cheerful child who has adapted well to life at Tabitha Home. She shows strong academic potential and gets along well with other children.',
    room_assignment: 'Room 12A',
    bed_number: 'Bed 3',
    monthly_allowance: 5000,
    chores_assigned: 'Cleaning, Library duty',
    mentorship_program: 'Yes - Paired with Mrs. Folake',
    behavioral_assessment_score: 8.5,
    psychological_evaluation_date: '2024-05-01',
    last_family_contact_date: '2024-06-15',
    last_checkup: '2024-05-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T15:30:00Z',
    created_by: 'Dr. Amina Hassan',
    last_modified_by: 'Nurse Joy Okeke'
  };

  const childData = child || mockChild;

  // Calculate derived data
  const derivedData = useMemo(() => {
    if (!childData) return {};

    const age = differenceInYears(new Date(), new Date(childData.date_of_birth));
    const timeAtHome = formatDistanceToNow(new Date(childData.admission_date), { addSuffix: true });
    const lastContact = childData.last_family_contact_date 
      ? formatDistanceToNow(new Date(childData.last_family_contact_date), { addSuffix: true })
      : 'No recent contact';
    
    // BMI calculation
    const heightInM = childData.height_cm / 100;
    const bmi = childData.weight_kg / (heightInM * heightInM);
    
    return {
      age,
      timeAtHome,
      lastContact,
      bmi: bmi.toFixed(1)
    };
  }, [childData]);

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'Exited': 'muted',
      'Transferred': 'info',
      'Adopted': 'primary',
      'Inactive': 'warning'
    };
    return statusColors[status] || 'muted';
  };

  // Health status color
  const getHealthColor = (status) => {
    const healthColors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Fair': 'warning',
      'Poor': 'error'
    };
    return healthColors[status] || 'muted';
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'medical', label: 'Medical', icon: FaStethoscope },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'growth', label: 'Growth', icon: FaArrowUp },
    { id: 'documents', label: 'Documents', icon: FaFileAlt },
    { id: 'family', label: 'Family', icon: FaHeart },
    { id: 'notes', label: 'Case Notes', icon: FaEdit }
  ];

  if (isLoading) {
    return (
      <div className="th-child-profile-loading">
        <LoadingSpinner size="xl" text="Loading child profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-child-profile-error">
        <h2>Error loading child profile</h2>
        <p>Child not found or you don't have permission to view this profile.</p>
        <Button onClick={() => navigate('/children')} variant="primary">
          Back to Children List
        </Button>
      </div>
    );
  }

  const statusColor = getStatusColor(childData.current_status);
  const healthColor = getHealthColor(childData.health_status);
  const GenderIcon = childData.gender === 'Male' ? FaMale : FaFemale;

  return (
    <div className="th-child-profile th-fade-in">
      {/* Profile Header */}
      <div className="th-profile-header">
        <div className="th-header-background">
          <div className="th-header-gradient"></div>
        </div>
        
        <div className="th-header-content">
          <div className="th-header-navigation">
            <button
              className="th-back-btn"
              onClick={() => navigate('/children')}
            >
              <FaArrowLeft />
              Back to Children
            </button>
            
            <div className="th-header-actions">
              <Button
                variant="glass"
                size="sm"
                icon={<FaShare />}
                onClick={() => console.log('Share profile')}
              >
                Share
              </Button>
              <Button
                variant="glass"
                size="sm"
                icon={<FaPrint />}
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                variant="glass"
                size="sm"
                icon={<FaDownload />}
                onClick={() => console.log('Export profile')}
              >
                Export
              </Button>
              <Button
                variant="primary"
                icon={<FaEdit />}
                onClick={() => navigate(`/children/${id}/edit`)}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="th-profile-main">
            <div className="th-profile-photo-section">
              <div className="th-profile-photo">
                {childData.photo_url ? (
                  <img src={childData.photo_url} alt={`${childData.first_name} ${childData.last_name}`} />
                ) : (
                  <div className="th-photo-placeholder">
                    <FaUser />
                  </div>
                )}
                <div className={`th-status-indicator th-status-${statusColor}`}>
                  <span className="th-status-dot"></span>
                </div>
              </div>
              
              <Button
                variant="glass"
                size="sm"
                icon={<FaCamera />}
                className="th-photo-edit-btn"
                onClick={() => console.log('Update photo')}
              >
                Update Photo
              </Button>
            </div>

            <div className="th-profile-info">
              <div className="th-profile-basic">
                <h1 className="th-profile-name">
                  {childData.first_name} {childData.middle_name} {childData.last_name}
                </h1>
                <div className="th-profile-meta">
                  <span className="th-child-id">ID: {childData.child_id}</span>
                  <span className="th-age-gender">
                    <GenderIcon className="th-gender-icon" />
                    {derivedData.age} years old • {childData.gender}
                  </span>
                </div>
                
                <div className="th-profile-badges">
                  <span className={`th-status-badge th-badge-${statusColor}`}>
                    {childData.current_status}
                  </span>
                  <span className={`th-health-badge th-badge-${healthColor}`}>
                    {childData.health_status} Health
                  </span>
                  {childData.preferred_language && (
                    <span className="th-language-badge">
                      {childData.preferred_language}
                    </span>
                  )}
                </div>
              </div>

              <div className="th-profile-quick-stats">
                <div className="th-quick-stat">
                  <FaCalendarAlt className="th-stat-icon" />
                  <div className="th-stat-content">
                    <span className="th-stat-label">At Tabitha Home</span>
                    <span className="th-stat-value">{derivedData.timeAtHome}</span>
                  </div>
                </div>
                
                <div className="th-quick-stat">
                  <FaMapMarkerAlt className="th-stat-icon" />
                  <div className="th-stat-content">
                    <span className="th-stat-label">Origin</span>
                    <span className="th-stat-value">{childData.state_of_origin}, {childData.lga}</span>
                  </div>
                </div>
                
                <div className="th-quick-stat">
                  <FaGraduationCap className="th-stat-icon" />
                  <div className="th-stat-content">
                    <span className="th-stat-label">Education</span>
                    <span className="th-stat-value">{childData.education_level}</span>
                  </div>
                </div>
                
                <div className="th-quick-stat">
                  <FaHeart className="th-stat-icon" />
                  <div className="th-stat-content">
                    <span className="th-stat-label">Ambition</span>
                    <span className="th-stat-value">{childData.ambition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="th-profile-nav">
        <div className="th-nav-tabs">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`th-nav-tab ${activeTab === tab.id ? 'th-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon className="th-tab-icon" />
                <span className="th-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Content */}
      <div className="th-profile-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="th-tab-content th-overview-tab">
            <div className="th-overview-grid">
              {/* Left Column */}
              <div className="th-overview-left">
                <ChildStatsWidget child={childData} derived={derivedData} />
                
                {/* Personal Information Card */}
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
                          {childData.first_name} {childData.middle_name} {childData.last_name}
                        </span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">Date of Birth</span>
                        <span className="th-info-value">
                          {format(new Date(childData.date_of_birth), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">Gender</span>
                        <span className="th-info-value">{childData.gender}</span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">Nationality</span>
                        <span className="th-info-value">{childData.nationality}</span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">State of Origin</span>
                        <span className="th-info-value">{childData.state_of_origin}</span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">LGA</span>
                        <span className="th-info-value">{childData.lga}</span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">Preferred Language</span>
                        <span className="th-info-value">{childData.preferred_language}</span>
                      </div>
                      <div className="th-info-item">
                        <span className="th-info-label">Religion</span>
                        <span className="th-info-value">{childData.religion}</span>
                      </div>
                    </div>
                    
                    {childData.tribal_marks && (
                      <div className="th-info-section">
                        <span className="th-info-label">Tribal Marks / Identifying Features</span>
                        <p className="th-info-text">{childData.tribal_marks}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Health Summary Card */}
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">
                      <FaStethoscope className="th-card-icon" />
                      Health Summary
                    </h3>
                    <span className={`th-health-status th-status-${healthColor}`}>
                      {childData.health_status}
                    </span>
                  </div>
                  <div className="th-card-body">
                    <div className="th-health-metrics">
                      <div className="th-metric">
                        <FaRuler className="th-metric-icon" />
                        <div className="th-metric-content">
                          <span className="th-metric-label">Height</span>
                          <span className="th-metric-value">{childData.height_cm} cm</span>
                        </div>
                      </div>
                      <div className="th-metric">
                        <FaWeight className="th-metric-icon" />
                        <div className="th-metric-content">
                          <span className="th-metric-label">Weight</span>
                          <span className="th-metric-value">{childData.weight_kg} kg</span>
                        </div>
                      </div>
                      <div className="th-metric">
                        <FaArrowUp className="th-metric-icon" />
                        <div className="th-metric-content">
                          <span className="th-metric-label">BMI</span>
                          <span className="th-metric-value">{derivedData.bmi}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="th-medical-info">
                      <div className="th-medical-row">
                        <div className="th-medical-item">
                          <span className="th-medical-label">Blood Type</span>
                          <span className="th-medical-value">{childData.blood_type}</span>
                        </div>
                        <div className="th-medical-item">
                          <span className="th-medical-label">Genotype</span>
                          <span className="th-medical-value">{childData.genotype}</span>
                        </div>
                      </div>
                      
                      {childData.allergies && (
                        <div className="th-medical-item">
                          <span className="th-medical-label">Allergies</span>
                          <span className="th-medical-value">{childData.allergies}</span>
                        </div>
                      )}
                      
                      {childData.medical_conditions && (
                        <div className="th-medical-item">
                          <span className="th-medical-label">Medical Conditions</span>
                          <span className="th-medical-value">{childData.medical_conditions}</span>
                        </div>
                      )}
                    </div>

                    <div className="th-last-checkup">
                      <span className="th-checkup-label">Last Checkup:</span>
                      <span className="th-checkup-date">
                        {format(new Date(childData.last_checkup), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="th-overview-right">
                {/* Education Card */}
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">
                      <FaGraduationCap className="th-card-icon" />
                      Education & Development
                    </h3>
                  </div>
                  <div className="th-card-body">
                    <div className="th-education-info">
                      <div className="th-education-item">
                        <span className="th-edu-label">Current Level</span>
                        <span className="th-edu-value">{childData.education_level}</span>
                      </div>
                      {childData.school_name && (
                        <div className="th-education-item">
                          <span className="th-edu-label">School</span>
                          <span className="th-edu-value">{childData.school_name}</span>
                        </div>
                      )}
                      <div className="th-education-item">
                        <span className="th-edu-label">Career Ambition</span>
                        <span className="th-edu-value">{childData.ambition}</span>
                      </div>
                      <div className="th-education-item">
                        <span className="th-edu-label">Behavioral Score</span>
                        <span className="th-edu-value">{childData.behavioral_assessment_score}/10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Administrative Info Card */}
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">
                      <FaFileAlt className="th-card-icon" />
                      Administrative Information
                    </h3>
                  </div>
                  <div className="th-card-body">
                    <div className="th-admin-info">
                      <div className="th-admin-item">
                        <span className="th-admin-label">Admission Date</span>
                        <span className="th-admin-value">
                          {format(new Date(childData.admission_date), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="th-admin-item">
                        <span className="th-admin-label">Case Worker</span>
                        <span className="th-admin-value">{childData.case_worker}</span>
                      </div>
                      <div className="th-admin-item">
                        <span className="th-admin-label">Room Assignment</span>
                        <span className="th-admin-value">{childData.room_assignment}, {childData.bed_number}</span>
                      </div>
                      <div className="th-admin-item">
                        <span className="th-admin-label">Monthly Allowance</span>
                        <span className="th-admin-value">₦{childData.monthly_allowance?.toLocaleString()}</span>
                      </div>
                      {childData.chores_assigned && (
                        <div className="th-admin-item">
                          <span className="th-admin-label">Assigned Chores</span>
                          <span className="th-admin-value">{childData.chores_assigned}</span>
                        </div>
                      )}
                      {childData.mentorship_program && (
                        <div className="th-admin-item">
                          <span className="th-admin-label">Mentorship</span>
                          <span className="th-admin-value">{childData.mentorship_program}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrival Circumstances Card */}
                <div className="th-info-card">
                  <div className="th-card-header">
                    <h3 className="th-card-title">
                      <FaFlag className="th-card-icon" />
                      Arrival Circumstances
                    </h3>
                  </div>
                  <div className="th-card-body">
                    <p className="th-circumstances-text">
                      {childData.arrival_circumstances}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Tab */}
        {activeTab === 'medical' && (
          <div className="th-tab-content">
            <MedicalHistory childId={id} />
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="th-tab-content">
            <EducationProgress childId={id} />
          </div>
        )}

        {/* Growth Tab */}
        {activeTab === 'growth' && (
          <div className="th-tab-content">
            <GrowthChart childId={id} />
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="th-tab-content">
            <DocumentsList childId={id} />
          </div>
        )}

        {/* Family Tab */}
        {activeTab === 'family' && (
          <div className="th-tab-content">
            <FamilyContacts childId={id} />
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="th-tab-content">
            <CaseNotes childId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildProfile;
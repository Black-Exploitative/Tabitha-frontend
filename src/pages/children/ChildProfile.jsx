import React, { useState, useMemo, useRef } from 'react';
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
  FaRuler,
  FaTimes,
  FaUpload
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
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Fetch child data
  const { 
    data: child, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['child', id],
    queryFn: () => childrenService.getChild(id),
    staleTime: 5 * 60 * 1000,
  });

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (photoData) => {
      const formData = new FormData();
      formData.append('photo', photoData.file);
      return childrenService.updateChildPhoto(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['child', id]);
      toast.success('Photo updated successfully!');
      setShowPhotoModal(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload photo');
    }
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

  const childData = child || (error && process.env.NODE_ENV === 'development' ? mockChild : null);

  // Handle photo file selection
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      toast.error('Please select a photo first');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      await uploadPhotoMutation.mutateAsync({ file: selectedPhoto });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Open file picker
  const handlePhotoButtonClick = () => {
    setShowPhotoModal(true);
  };

  // Cancel photo selection
  const handleCancelPhoto = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate derived data
  const derivedData = useMemo(() => {
    if (!childData) return {};

    const parseDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    const birthDate = parseDate(childData.date_of_birth);
    const admissionDate = parseDate(childData.admission_date);
    const lastContactDate = parseDate(childData.last_family_contact_date);

    const age = birthDate ? differenceInYears(new Date(), birthDate) : 'N/A';
    const timeAtHome = admissionDate ? formatDistanceToNow(admissionDate, { addSuffix: true }) : 'N/A';
    const lastContact = lastContactDate 
      ? formatDistanceToNow(lastContactDate, { addSuffix: true })
      : 'No recent contact';
    
    const height = parseFloat(childData.height_cm) || 0;
    const weight = parseFloat(childData.weight_kg) || 0;
    const heightInM = height / 100;
    const bmi = height > 0 && weight > 0 ? weight / (heightInM * heightInM) : 0;
    
    return {
      age,
      timeAtHome,
      lastContact,
      bmi: bmi > 0 ? bmi.toFixed(1) : 'N/A'
    };
  }, [childData]);

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

  const getHealthColor = (status) => {
    const healthColors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Fair': 'warning',
      'Poor': 'error'
    };
    return healthColors[status] || 'muted';
  };

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

  if (!childData) {
    return (
      <div className="th-child-profile-error">
        <h2>No child data available</h2>
        <p>Unable to load child information.</p>
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
      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="th-modal-overlay" onClick={handleCancelPhoto}>
          <div className="th-photo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <h3>Update Profile Photo</h3>
              <button className="th-modal-close" onClick={handleCancelPhoto}>
                <FaTimes />
              </button>
            </div>
            
            <div className="th-modal-body">
              {!photoPreview ? (
                <div className="th-photo-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    style={{ display: 'none' }}
                  />
                  <div 
                    className="th-upload-prompt"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera className="th-upload-icon" />
                    <p className="th-upload-text">Click to select a photo</p>
                    <p className="th-upload-hint">JPG, PNG or WebP (max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="th-photo-preview-area">
                  <img src={photoPreview} alt="Preview" className="th-photo-preview" />
                  <button 
                    className="th-change-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera /> Change Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
            
            <div className="th-modal-footer">
              <Button variant="outline" onClick={handleCancelPhoto}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                icon={<FaUpload />}
                onClick={handlePhotoUpload}
                disabled={!selectedPhoto || isUploadingPhoto}
                loading={isUploadingPhoto}
              >
                {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => toast.info('Share feature coming soon')}
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
                onClick={() => toast.info('Export feature coming soon')}
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
                onClick={handlePhotoButtonClick}
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

      {/* Profile Content - Rest of the tabs remain the same */}
      <div className="th-profile-content">
        {activeTab === 'overview' && (
          <div className="th-tab-content th-overview-tab">
            {/* Overview content remains the same as original */}
            <div className="th-overview-grid">
              <ChildStatsWidget child={childData} derived={derivedData} />
              {/* ... rest of overview content ... */}
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="th-tab-content">
            <MedicalHistory childId={id} />
          </div>
        )}

        {activeTab === 'education' && (
          <div className="th-tab-content">
            <EducationProgress childId={id} />
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="th-tab-content">
            <GrowthChart childId={id} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="th-tab-content">
            <DocumentsList childId={id} />
          </div>
        )}

        {activeTab === 'family' && (
          <div className="th-tab-content">
            <FamilyContacts childId={id} />
          </div>
        )}

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
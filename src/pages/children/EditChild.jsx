import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowLeft, FaSave, FaUser, FaGraduationCap, FaHeart, FaUserMd } from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { childrenService } from '../../services/children';
import { NIGERIAN_STATES } from '../../utils/nigerianData';
import toast from 'react-hot-toast';
import './AddChild.css'; // Reuse the same styles

const EditChild = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    state_of_origin: '',
    preferred_language: '',
    education_level: '',
    school_name: '',
    health_status: '',
    genotype: '',
    blood_type: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_address: '',
    case_worker: '',
    admission_date: '',
    current_status: '',
    ambition: '',
    special_needs: '',
    allergies: '',
    medications: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch child data
  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', id],
    queryFn: () => childrenService.getChild(id),
    enabled: !!id,
  });

  // Update mutation
  const updateChildMutation = useMutation({
    mutationFn: (data) => childrenService.updateChild(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['child', id]);
      queryClient.invalidateQueries(['children']);
      toast.success('Child information updated successfully');
      navigate(`/children/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update child information');
    }
  });

  // Populate form when child data is loaded
  useEffect(() => {
    if (child) {
      setFormData({
        first_name: child.first_name || '',
        middle_name: child.middle_name || '',
        last_name: child.last_name || '',
        date_of_birth: child.date_of_birth || '',
        gender: child.gender || '',
        state_of_origin: child.state_of_origin || '',
        preferred_language: child.preferred_language || '',
        education_level: child.education_level || '',
        school_name: child.school_name || '',
        health_status: child.health_status || '',
        genotype: child.genotype || '',
        blood_type: child.blood_type || '',
        guardian_name: child.guardian_name || '',
        guardian_phone: child.guardian_phone || '',
        guardian_email: child.guardian_email || '',
        guardian_address: child.guardian_address || '',
        case_worker: child.case_worker || '',
        admission_date: child.admission_date || '',
        current_status: child.current_status || '',
        ambition: child.ambition || '',
        special_needs: child.special_needs || '',
        allergies: child.allergies || [],
        medical_conditions: child.medical_conditions || [],
        emergency_contact_name: child.emergency_contact_name || '',
        emergency_contact_phone: child.emergency_contact_phone || '',
        emergency_contact_relationship: child.emergency_contact_relationship || '',
        notes: child.notes || ''
      });
    }
  }, [child]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.state_of_origin) newErrors.state_of_origin = 'State of origin is required';
    if (!formData.admission_date) newErrors.admission_date = 'Admission date is required';
    if (!formData.current_status) newErrors.current_status = 'Current status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateChildMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="th-add-child-loading">
        <LoadingSpinner size="lg" />
        <p>Loading child information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-add-child-error">
        <h2>Error loading child</h2>
        <p>{error.message}</p>
        <Button onClick={() => navigate('/children')} variant="primary">
          Back to Children
        </Button>
      </div>
    );
  }

  return (
    <div className="th-add-child">
      {/* Header */}
      <div className="th-add-child-header">
        <div className="th-header-content">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaArrowLeft />}
            onClick={() => navigate(`/children/${id}`)}
            className="th-back-btn"
          >
            Back to Profile
          </Button>
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaUser className="th-title-icon" />
              Edit Child Information
            </h1>
            <p className="th-page-subtitle">
              Update information for {child?.first_name} {child?.last_name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="th-add-child-form">
        <div className="th-form-sections">
          {/* Personal Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUser className="th-section-icon" />
              <h3>Personal Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={errors.first_name ? 'error' : ''}
                  placeholder="Enter first name"
                />
                {errors.first_name && <span className="th-error">{errors.first_name}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="middle_name">Middle Name</label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  placeholder="Enter middle name"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={errors.last_name ? 'error' : ''}
                  placeholder="Enter last name"
                />
                {errors.last_name && <span className="th-error">{errors.last_name}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="date_of_birth">Date of Birth *</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className={errors.date_of_birth ? 'error' : ''}
                />
                {errors.date_of_birth && <span className="th-error">{errors.date_of_birth}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <span className="th-error">{errors.gender}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="state_of_origin">State of Origin *</label>
                <select
                  id="state_of_origin"
                  name="state_of_origin"
                  value={formData.state_of_origin}
                  onChange={handleInputChange}
                  className={errors.state_of_origin ? 'error' : ''}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                {errors.state_of_origin && <span className="th-error">{errors.state_of_origin}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="preferred_language">Preferred Language</label>
                <input
                  type="text"
                  id="preferred_language"
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleInputChange}
                  placeholder="e.g., Yoruba, Hausa, Igbo"
                />
              </div>
            </div>
          </div>

          {/* Education Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaGraduationCap className="th-section-icon" />
              <h3>Education Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="education_level">Education Level</label>
                <select
                  id="education_level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                >
                  <option value="">Select level</option>
                  <option value="Pre-School">Pre-School</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="SSS 1">SSS 1</option>
                  <option value="SSS 2">SSS 2</option>
                  <option value="SSS 3">SSS 3</option>
                  <option value="Tertiary">Tertiary</option>
                </select>
              </div>

              <div className="th-form-group">
                <label htmlFor="school_name">School Name</label>
                <input
                  type="text"
                  id="school_name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="ambition">Career Ambition</label>
                <input
                  type="text"
                  id="ambition"
                  name="ambition"
                  value={formData.ambition}
                  onChange={handleInputChange}
                  placeholder="What they want to become"
                />
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUserMd className="th-section-icon" />
              <h3>Health Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="health_status">Health Status</label>
                <select
                  id="health_status"
                  name="health_status"
                  value={formData.health_status}
                  onChange={handleInputChange}
                >
                  <option value="">Select status</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="th-form-group">
                <label htmlFor="blood_type">Blood Type</label>
                <select
                  id="blood_type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="th-form-group">
                <label htmlFor="genotype">Genotype</label>
                <select
                  id="genotype"
                  name="genotype"
                  value={formData.genotype}
                  onChange={handleInputChange}
                >
                  <option value="">Select genotype</option>
                  <option value="AA">AA</option>
                  <option value="AS">AS</option>
                  <option value="SS">SS</option>
                  <option value="AC">AC</option>
                </select>
              </div>

              <div className="th-form-group">
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies"
                  rows="3"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="medications">Current Medications</label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="List current medications"
                  rows="3"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="special_needs">Special Needs</label>
                <textarea
                  id="special_needs"
                  name="special_needs"
                  value={formData.special_needs}
                  onChange={handleInputChange}
                  placeholder="Any special needs or requirements"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Care Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaHeart className="th-section-icon" />
              <h3>Care Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="admission_date">Admission Date *</label>
                <input
                  type="date"
                  id="admission_date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleInputChange}
                  className={errors.admission_date ? 'error' : ''}
                />
                {errors.admission_date && <span className="th-error">{errors.admission_date}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="current_status">Current Status *</label>
                <select
                  id="current_status"
                  name="current_status"
                  value={formData.current_status}
                  onChange={handleInputChange}
                  className={errors.current_status ? 'error' : ''}
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Exited">Exited</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.current_status && <span className="th-error">{errors.current_status}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="case_worker">Case Worker</label>
                <input
                  type="text"
                  id="case_worker"
                  name="case_worker"
                  value={formData.case_worker}
                  onChange={handleInputChange}
                  placeholder="Assigned case worker"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUser className="th-section-icon" />
              <h3>Guardian Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="guardian_name">Guardian Name</label>
                <input
                  type="text"
                  id="guardian_name"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleInputChange}
                  placeholder="Full name of guardian"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="guardian_phone">Guardian Phone</label>
                <input
                  type="tel"
                  id="guardian_phone"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="guardian_email">Guardian Email</label>
                <input
                  type="email"
                  id="guardian_email"
                  name="guardian_email"
                  value={formData.guardian_email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>

              <div className="th-form-group th-form-group-full">
                <label htmlFor="guardian_address">Guardian Address</label>
                <textarea
                  id="guardian_address"
                  name="guardian_address"
                  value={formData.guardian_address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUser className="th-section-icon" />
              <h3>Emergency Contact</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="emergency_contact_name">Contact Name</label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleInputChange}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="emergency_contact_phone">Contact Phone</label>
                <input
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="Emergency phone number"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="emergency_contact_relationship">Relationship</label>
                <input
                  type="text"
                  id="emergency_contact_relationship"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Uncle, Aunt, Family Friend"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUser className="th-section-icon" />
              <h3>Additional Notes</h3>
            </div>
            
            <div className="th-form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information or notes"
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="th-form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/children/${id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<FaSave />}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Child'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditChild;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaUserTie, FaCalendarAlt } from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { staffService } from '../../services/staff';
import toast from 'react-hot-toast';
import './AddStaff.css'; // Reuse the same styles

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    employee_id: '',
    date_hired: '',
    employment_status: '',
    salary: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    qualifications: '',
    certifications: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff data
  const { data: staffResponse, isLoading, error } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
  });

  const staff = staffResponse?.data;

  // Update mutation
  const updateStaffMutation = useMutation({
    mutationFn: (data) => staffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff', id]);
      queryClient.invalidateQueries(['staff']);
      toast.success('Staff information updated successfully');
      navigate(`/staff/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update staff information');
    }
  });

  // Populate form when staff data is loaded
  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        position: staff.position || '',
        department: staff.department || '',
        employee_id: staff.employee_id || '',
        date_hired: staff.date_hired || '',
        employment_status: staff.employment_status || '',
        salary: staff.salary || '',
        address: staff.address || '',
        emergency_contact_name: staff.emergency_contact_name || '',
        emergency_contact_phone: staff.emergency_contact_phone || '',
        emergency_contact_relationship: staff.emergency_contact_relationship || '',
        qualifications: staff.qualifications || '',
        certifications: staff.certifications || '',
        notes: staff.notes || ''
      });
    }
  }, [staff]);

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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.date_hired) newErrors.date_hired = 'Date hired is required';
    if (!formData.employment_status) newErrors.employment_status = 'Employment status is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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
      await updateStaffMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="th-add-staff-loading">
        <LoadingSpinner size="lg" />
        <p>Loading staff information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-add-staff-error">
        <h2>Error loading staff member</h2>
        <p>{error.message}</p>
        <Button onClick={() => navigate('/staff')} variant="primary">
          Back to Staff
        </Button>
      </div>
    );
  }

  return (
    <div className="th-add-staff">
      {/* Header */}
      <div className="th-add-staff-header">
        <div className="th-header-content">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaArrowLeft />}
            onClick={() => navigate(`/staff/${id}`)}
            className="th-back-btn"
          >
            Back to Profile
          </Button>
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaUser className="th-title-icon" />
              Edit Staff Information
            </h1>
            <p className="th-page-subtitle">
              Update information for {staff?.first_name} {staff?.last_name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="th-add-staff-form">
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
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="th-error">{errors.email}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter phone number"
                />
                {errors.phone && <span className="th-error">{errors.phone}</span>}
              </div>

              <div className="th-form-group th-form-group-full">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaUserTie className="th-section-icon" />
              <h3>Employment Information</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group">
                <label htmlFor="employee_id">Employee ID</label>
                <input
                  type="text"
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="th-form-group">
                <label htmlFor="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? 'error' : ''}
                  placeholder="Enter position"
                />
                {errors.position && <span className="th-error">{errors.position}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">Select department</option>
                  <option value="Administration">Administration</option>
                  <option value="Child Care">Child Care</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Social Services">Social Services</option>
                </select>
                {errors.department && <span className="th-error">{errors.department}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="date_hired">Date Hired *</label>
                <input
                  type="date"
                  id="date_hired"
                  name="date_hired"
                  value={formData.date_hired}
                  onChange={handleInputChange}
                  className={errors.date_hired ? 'error' : ''}
                />
                {errors.date_hired && <span className="th-error">{errors.date_hired}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="employment_status">Employment Status *</label>
                <select
                  id="employment_status"
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleInputChange}
                  className={errors.employment_status ? 'error' : ''}
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Terminated">Terminated</option>
                </select>
                {errors.employment_status && <span className="th-error">{errors.employment_status}</span>}
              </div>

              <div className="th-form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaIdCard className="th-section-icon" />
              <h3>Qualifications & Certifications</h3>
            </div>
            
            <div className="th-form-grid">
              <div className="th-form-group th-form-group-full">
                <label htmlFor="qualifications">Qualifications</label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="List educational qualifications and degrees"
                  rows="4"
                />
              </div>

              <div className="th-form-group th-form-group-full">
                <label htmlFor="certifications">Certifications</label>
                <textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="List professional certifications and licenses"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="th-form-section">
            <div className="th-section-header">
              <FaPhone className="th-section-icon" />
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
                  placeholder="e.g., Spouse, Parent, Sibling"
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
            onClick={() => navigate(`/staff/${id}`)}
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
            {isSubmitting ? 'Updating...' : 'Update Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;

// src/pages/staff/AddStaff.jsx - Complete form with emergency contact
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserPlus, FaArrowLeft, FaSave } from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AddStaff.css';

const AddStaff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    marital_status: 'Single',
    nin: '',
    position: '',
    department: '',
    role: 'staff',
    salary: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: '',
      address: ''
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Position options that match the enum in the model
  const positionOptions = [
    'Director', 'Assistant Director', 'Administrator', 'System Administrator',
    'Social Worker', 'Child Care Worker', 'Teacher', 'Nurse', 'Medical Officer',
    'Cook', 'Security Officer', 'Cleaner', 'Maintenance', 'Volunteer', 'Intern',
    'Manager', 'Supervisor', 'Counselor', 'Driver'
  ];

  const departmentOptions = [
    'Administration', 'Child Care', 'Education', 'Medical', 
    'Kitchen', 'Security', 'Maintenance', 'Social Services'
  ];

  const relationshipOptions = [
    'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Uncle', 'Aunt',
    'Cousin', 'Friend', 'Colleague', 'Other'
  ];

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.position.trim()) errors.position = 'Position is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    
    // Emergency contact validation
    if (!formData.emergency_contact.name.trim()) {
      errors.emergency_contact_name = 'Emergency contact name is required';
    }
    if (!formData.emergency_contact.relationship.trim()) {
      errors.emergency_contact_relationship = 'Emergency contact relationship is required';
    }
    if (!formData.emergency_contact.phone.trim()) {
      errors.emergency_contact_phone = 'Emergency contact phone is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid Nigerian phone number';
    }
    
    if (formData.emergency_contact.phone && !phoneRegex.test(formData.emergency_contact.phone)) {
      errors.emergency_contact_phone = 'Please enter a valid Nigerian phone number';
    }
    
    // NIN validation
    if (formData.nin && (formData.nin.length !== 11 || !/^\d+$/.test(formData.nin))) {
      errors.nin = 'NIN must be exactly 11 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: (staffData) => {
      console.log('Submitting staff data:', staffData);
      return authService.createStaffAccount(staffData);
    },
    onSuccess: (newStaff) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success(
        `${newStaff.first_name} ${newStaff.last_name} has been successfully added!`,
        { duration: 5000, icon: '🎉' }
      );
      navigate('/staff');
    },
    onError: (error) => {
      console.error('Staff creation failed:', error);
      toast.error(error.message || 'Failed to create staff account');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      // Clean up data before sending
      const submitData = {
        ...formData,
        salary: formData.salary ? parseInt(formData.salary) : undefined,
        nin: formData.nin || undefined,
        created_by: user?.id
      };

      // Remove empty fields except emergency_contact
      Object.keys(submitData).forEach(key => {
        if (key !== 'emergency_contact' && (submitData[key] === '' || submitData[key] === undefined)) {
          delete submitData[key];
        }
      });

      console.log('Final submit data:', submitData);
      await createStaffMutation.mutateAsync(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergency_contact.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergency_contact: {
          ...prev.emergency_contact,
          [fieldName]: value
        }
      }));
      
      // Clear specific field error
      const errorKey = `emergency_contact_${fieldName}`;
      if (formErrors[errorKey]) {
        setFormErrors(prev => ({
          ...prev,
          [errorKey]: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear specific field error
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  return (
    <div className="th-add-staff th-fade-in">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-breadcrumb">
            <button
              className="th-back-btn"
              onClick={() => navigate('/staff')}
            >
              <FaArrowLeft />
              Staff
            </button>
            <span className="th-breadcrumb-separator">/</span>
            <span className="th-breadcrumb-current">Add New Staff</span>
          </div>
          
          <h1 className="th-page-title">
            <FaUserPlus className="th-title-icon" />
            Add New Staff Member
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="th-staff-form-container">
        <form onSubmit={handleSubmit} className="th-staff-form">
          {/* Personal Information */}
          <div className="th-form-section">
            <h3 className="th-section-title">Personal Information</h3>
            <div className="th-form-grid">
              <div className="th-form-group">
                <label className="th-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`th-input ${formErrors.first_name ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.first_name && (
                  <span className="th-error-text">{formErrors.first_name}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`th-input ${formErrors.last_name ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.last_name && (
                  <span className="th-error-text">{formErrors.last_name}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`th-input ${formErrors.email ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.email && (
                  <span className="th-error-text">{formErrors.email}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                  className={`th-input ${formErrors.phone ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.phone && (
                  <span className="th-error-text">{formErrors.phone}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="th-input"
                />
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="th-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="th-form-group">
                <label className="th-label">Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleInputChange}
                  className="th-select"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div className="th-form-group">
                <label className="th-label">NIN (Optional)</label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleInputChange}
                  className={`th-input ${formErrors.nin ? 'th-input-error' : ''}`}
                  placeholder="11 digits"
                  maxLength="11"
                />
                {formErrors.nin && (
                  <span className="th-error-text">{formErrors.nin}</span>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="th-form-section">
            <h3 className="th-section-title">Employment Details</h3>
            <div className="th-form-grid">
              <div className="th-form-group">
                <label className="th-label">Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`th-select ${formErrors.position ? 'th-input-error' : ''}`}
                  required
                >
                  <option value="">Select Position</option>
                  {positionOptions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                {formErrors.position && (
                  <span className="th-error-text">{formErrors.position}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`th-select ${formErrors.department ? 'th-input-error' : ''}`}
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {formErrors.department && (
                  <span className="th-error-text">{formErrors.department}</span>
                )}
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="th-select"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="read_only">Read Only</option>
                </select>
              </div>
              
              <div className="th-form-group">
                <label className="th-label">Monthly Salary (₦)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="th-input"
                  placeholder="450000"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="th-form-section">
            <h3 className="th-section-title">Emergency Contact *</h3>
            <div className="th-form-grid">
              <div className="th-form-group">
                <label className="th-label">Contact Name *</label>
                <input
                  type="text"
                  name="emergency_contact.name"
                  value={formData.emergency_contact.name}
                  onChange={handleInputChange}
                  className={`th-input ${formErrors.emergency_contact_name ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.emergency_contact_name && (
                  <span className="th-error-text">{formErrors.emergency_contact_name}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-label">Relationship *</label>
                <select
                  name="emergency_contact.relationship"
                  value={formData.emergency_contact.relationship}
                  onChange={handleInputChange}
                  className={`th-select ${formErrors.emergency_contact_relationship ? 'th-input-error' : ''}`}
                  required
                >
                  <option value="">Select Relationship</option>
                  {relationshipOptions.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
                {formErrors.emergency_contact_relationship && (
                  <span className="th-error-text">{formErrors.emergency_contact_relationship}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-label">Contact Phone *</label>
                <input
                  type="tel"
                  name="emergency_contact.phone"
                  value={formData.emergency_contact.phone}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                  className={`th-input ${formErrors.emergency_contact_phone ? 'th-input-error' : ''}`}
                  required
                />
                {formErrors.emergency_contact_phone && (
                  <span className="th-error-text">{formErrors.emergency_contact_phone}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-label">Contact Address (Optional)</label>
                <input
                  type="text"
                  name="emergency_contact.address"
                  value={formData.emergency_contact.address}
                  onChange={handleInputChange}
                  className="th-input"
                  placeholder="Emergency contact address"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="th-form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/staff')}
              disabled={createStaffMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<FaSave />}
              loading={createStaffMutation.isLoading}
              disabled={createStaffMutation.isLoading}
            >
              Create Staff Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
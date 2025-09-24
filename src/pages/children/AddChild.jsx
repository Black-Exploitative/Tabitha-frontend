import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaChild, FaArrowLeft, FaSave, FaEye } from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import ChildForm from '../../components/Children/ChildForm';
import { childrenService } from '../../services/children';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AddChild.css';

const AddChild = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({});

  // Create child mutation
  const createChildMutation = useMutation({
    mutationFn: (childData) => childrenService.createChild(childData),
    onSuccess: (newChild) => {
      // Update the children list cache
      queryClient.invalidateQueries({ queryKey: ['children'] });
      
      toast.success(
        `${newChild.first_name} ${newChild.last_name} has been successfully added to Tabitha Home!`,
        {
          duration: 5000,
          icon: '🎉',
        }
      );
      
      // Navigate to the new child's profile
      navigate(`/children/${newChild.id}`, {
        state: { newChild: true }
      });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add child';
      toast.error(errorMessage);
      console.error('Error creating child:', error);
    }
  });

  const handleSubmit = async (data) => {
    try {
      // Add metadata
      const childData = {
        ...data,
        created_by: user?.id,
        admission_date: data.admission_date || new Date().toISOString().split('T')[0],
        current_status: 'Active'
      };

      await createChildMutation.mutateAsync(childData);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handlePreview = (data) => {
    setFormData(data);
    setIsPreview(true);
  };

  const handleBackToEdit = () => {
    setIsPreview(false);
  };

  return (
    <div className="th-add-child th-fade-in">
      {/* Page Header */}
      <div className="th-page-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <div className="th-breadcrumb">
              <button
                className="th-back-btn"
                onClick={() => navigate('/children')}
              >
                <FaArrowLeft />
                Children
              </button>
              <span className="th-breadcrumb-separator">/</span>
              <span className="th-breadcrumb-current">Add New Child</span>
            </div>
            
            <h1 className="th-page-title">
              <FaChild className="th-title-icon" />
              {isPreview ? 'Preview Child Information' : 'Add New Child'}
            </h1>
            <p className="th-page-subtitle">
              {isPreview 
                ? 'Review the information before saving to the system'
                : 'Enter comprehensive information for the new child admission'
              }
            </p>
          </div>
          
          <div className="th-header-actions">
            {isPreview ? (
              <>
                <Button
                  variant="outline"
                  icon={<FaArrowLeft />}
                  onClick={handleBackToEdit}
                >
                  Back to Edit
                </Button>
                <Button
                  variant="primary"
                  icon={<FaSave />}
                  onClick={() => handleSubmit(formData)}
                  loading={createChildMutation.isLoading}
                >
                  Save Child Record
                </Button>
              </>
            ) : (
              <Button
                variant="glass"
                icon={<FaEye />}
                onClick={() => {
                  // This will be handled by the form component
                }}
              >
                Preview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="th-form-container">
        {isPreview ? (
          <ChildPreview 
            data={formData} 
            onEdit={handleBackToEdit}
            onSubmit={() => handleSubmit(formData)}
            loading={createChildMutation.isLoading}
          />
        ) : (
          <ChildForm
            mode="create"
            onSubmit={handleSubmit}
            onPreview={handlePreview}
            isLoading={createChildMutation.isLoading}
          />
        )}
      </div>
    </div>
  );
};

// Child Preview Component
const ChildPreview = ({ data, onEdit, onSubmit, loading }) => {
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = data.date_of_birth ? calculateAge(data.date_of_birth) : 'Unknown';

  return (
    <div className="th-child-preview">
      <div className="th-preview-card">
        <div className="th-preview-header">
          <div className="th-preview-photo">
            {data.photo ? (
              <img src={URL.createObjectURL(data.photo)} alt="Child photo" />
            ) : (
              <div className="th-photo-placeholder">
                <FaChild />
              </div>
            )}
          </div>
          
          <div className="th-preview-basic">
            <h2 className="th-preview-name">
              {data.first_name} {data.middle_name} {data.last_name}
            </h2>
            <p className="th-preview-age">{age} years old • {data.gender}</p>
            <p className="th-preview-origin">From {data.state_of_origin}, Nigeria</p>
          </div>
        </div>

        <div className="th-preview-sections">
          {/* Personal Information */}
          <div className="th-preview-section">
            <h3>Personal Information</h3>
            <div className="th-preview-grid">
              <div className="th-preview-item">
                <span className="th-preview-label">Date of Birth</span>
                <span className="th-preview-value">{data.date_of_birth}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Preferred Language</span>
                <span className="th-preview-value">{data.preferred_language}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Religion</span>
                <span className="th-preview-value">{data.religion}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Tribal Marks</span>
                <span className="th-preview-value">{data.tribal_marks || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="th-preview-section">
            <h3>Medical Information</h3>
            <div className="th-preview-grid">
              <div className="th-preview-item">
                <span className="th-preview-label">Blood Type</span>
                <span className="th-preview-value">{data.blood_type}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Genotype</span>
                <span className="th-preview-value">{data.genotype}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Height</span>
                <span className="th-preview-value">{data.height_cm} cm</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Weight</span>
                <span className="th-preview-value">{data.weight_kg} kg</span>
              </div>
            </div>
            {data.allergies && (
              <div className="th-preview-item">
                <span className="th-preview-label">Allergies</span>
                <span className="th-preview-value">{data.allergies}</span>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="th-preview-section">
            <h3>Education</h3>
            <div className="th-preview-grid">
              <div className="th-preview-item">
                <span className="th-preview-label">Education Level</span>
                <span className="th-preview-value">{data.education_level}</span>
              </div>
              {data.school_name && (
                <div className="th-preview-item">
                  <span className="th-preview-label">School Name</span>
                  <span className="th-preview-value">{data.school_name}</span>
                </div>
              )}
              {data.ambition && (
                <div className="th-preview-item">
                  <span className="th-preview-label">Ambition</span>
                  <span className="th-preview-value">{data.ambition}</span>
                </div>
              )}
            </div>
          </div>

          {/* Legal Information */}
          <div className="th-preview-section">
            <h3>Legal & Administrative</h3>
            <div className="th-preview-grid">
              <div className="th-preview-item">
                <span className="th-preview-label">Legal Guardian</span>
                <span className="th-preview-value">{data.legal_guardian_name}</span>
              </div>
              <div className="th-preview-item">
                <span className="th-preview-label">Guardian Contact</span>
                <span className="th-preview-value">{data.legal_guardian_contact}</span>
              </div>
              {data.birth_certificate_number && (
                <div className="th-preview-item">
                  <span className="th-preview-label">Birth Certificate No.</span>
                  <span className="th-preview-value">{data.birth_certificate_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Arrival Circumstances */}
          {data.arrival_circumstances && (
            <div className="th-preview-section">
              <h3>Arrival Circumstances</h3>
              <p className="th-preview-text">{data.arrival_circumstances}</p>
            </div>
          )}
        </div>

        <div className="th-preview-actions">
          <Button
            variant="outline"
            onClick={onEdit}
          >
            Edit Information
          </Button>
          <Button
            variant="primary"
            icon={<FaSave />}
            onClick={onSubmit}
            loading={loading}
          >
            Save Child Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddChild;
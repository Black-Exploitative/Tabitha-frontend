import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaUserMd, 
  FaGraduationCap, 
  FaFileAlt,
  FaCamera,
  FaUpload,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaEye
} from 'react-icons/fa';
import Button from '../UI/Button/Button';
import FileUpload from '../Common/FileUpload';
import { 
  NIGERIAN_STATES, 
  NIGERIAN_LANGUAGES, 
  GENOTYPES, 
  BLOOD_TYPES,
  COMMON_NIGERIAN_NAMES 
} from '../../utils/nigerianData';
import './ChildForm.css';

const ChildForm = ({ 
  mode = 'create', 
  initialData = null, 
  onSubmit, 
  onPreview,
  isLoading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [genotypeWarning, setGenotypeWarning] = useState('');
  
  const totalSteps = 5;
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: initialData || {
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      state_of_origin: '',
      lga: '',
      preferred_language: 'English',
      religion: '',
      tribal_marks: '',
      blood_type: '',
      genotype: '',
      height_cm: '',
      weight_kg: '',
      allergies: '',
      medical_conditions: '',
      education_level: '',
      school_name: '',
      ambition: '',
      legal_guardian_name: '',
      legal_guardian_contact: '',
      next_of_kin_name: '',
      next_of_kin_contact: '',
      emergency_contact: '',
      birth_certificate_number: '',
      arrival_circumstances: ''
    }
  });

  // Watch form values for validation and suggestions
  const watchedValues = watch();
  const { first_name, last_name, genotype, date_of_birth } = watchedValues;

  // Steps configuration
  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      subtitle: 'Basic details and identification',
      icon: FaUser,
      fields: ['first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 'state_of_origin', 'lga', 'preferred_language', 'religion', 'tribal_marks']
    },
    {
      id: 2,
      title: 'Medical Information',
      subtitle: 'Health records and medical data',
      icon: FaUserMd,
      fields: ['blood_type', 'genotype', 'height_cm', 'weight_kg', 'allergies', 'medical_conditions']
    },
    {
      id: 3,
      title: 'Education & Development',
      subtitle: 'Academic information and aspirations',
      icon: FaGraduationCap,
      fields: ['education_level', 'school_name', 'ambition']
    },
    {
      id: 4,
      title: 'Legal & Guardian Information',
      subtitle: 'Legal documentation and contacts',
      icon: FaFileAlt,
      fields: ['legal_guardian_name', 'legal_guardian_contact', 'next_of_kin_name', 'next_of_kin_contact', 'emergency_contact', 'birth_certificate_number']
    },
    {
      id: 5,
      title: 'Photo & Final Details',
      subtitle: 'Photo upload and circumstances',
      icon: FaCamera,
      fields: ['arrival_circumstances']
    }
  ];

  // Nigerian LGAs data (simplified for example)
  const getLGAs = (state) => {
    const lgaData = {
      'lagos': ['Ikeja', 'Lagos Island', 'Lagos Mainland', 'Surulere', 'Alimosho'],
      'kano': ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Nasarawa'],
      'abuja': ['Abuja Municipal', 'Gwagwalada', 'Kuje', 'Bwari', 'Kwali'],
      // Add more states and their LGAs
    };
    return lgaData[state] || [];
  };

  // Genotype compatibility checking
  useEffect(() => {
    if (genotype) {
      const warnings = {
        'SS': 'Sickle Cell Disease - Requires special medical attention',
        'SC': 'Sickle Cell Disease (mild) - Monitor for complications',
        'AS': 'Sickle Cell Trait - Generally healthy but carrier'
      };
      setGenotypeWarning(warnings[genotype] || '');
    }
  }, [genotype]);

  // Age calculation
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Name suggestions based on common Nigerian names
  const getNameSuggestions = (value, type) => {
    if (!value || value.length < 2) return [];
    const names = type === 'first_name' 
      ? [...COMMON_NIGERIAN_NAMES.male, ...COMMON_NIGERIAN_NAMES.female]
      : ['Adebayo', 'Okafor', 'Ibrahim', 'Yusuf', 'Okeke']; // Common surnames
    
    return names.filter(name => 
      name.toLowerCase().startsWith(value.toLowerCase())
    ).slice(0, 5);
  };

  // Step navigation
  const nextStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields;
    const isStepValid = await trigger(currentStepFields);
    
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Form submission
  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      photo: uploadedPhoto,
      age: calculateAge(data.date_of_birth)
    };
    onSubmit(formData);
  };

  const onPreviewClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      const formData = {
        ...watchedValues,
        photo: uploadedPhoto,
        age: calculateAge(watchedValues.date_of_birth)
      };
      onPreview(formData);
    }
  };

  return (
    <div className="th-child-form">
      {/* Form Progress */}
      <div className="th-form-progress">
        <div className="th-progress-steps">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div 
                key={step.id}
                className={`th-progress-step ${isActive ? 'th-step-active' : ''} ${isCompleted ? 'th-step-completed' : ''}`}
                onClick={() => goToStep(step.id)}
              >
                <div className="th-step-indicator">
                  <div className="th-step-icon">
                    {isCompleted ? <FaCheck /> : <StepIcon />}
                  </div>
                  <span className="th-step-number">{step.id}</span>
                </div>
                <div className="th-step-content">
                  <h4 className="th-step-title">{step.title}</h4>
                  <p className="th-step-subtitle">{step.subtitle}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="th-step-connector"></div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="th-progress-bar">
          <div 
            className="th-progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="th-form-content">
        <div className="th-form-card">
          <div className="th-form-header">
            <h2 className="th-form-title">{steps[currentStep - 1].title}</h2>
            <p className="th-form-subtitle">{steps[currentStep - 1].subtitle}</p>
          </div>

          <div className="th-form-body">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="th-form-step th-slide-in-right">
                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label th-label-required">First Name</label>
                    <input
                      type="text"
                      className={`th-input ${errors.first_name ? 'th-input-error' : ''}`}
                      placeholder="Enter first name"
                      {...register('first_name', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.first_name && (
                      <span className="th-error-text">{errors.first_name.message}</span>
                    )}
                    {/* Name suggestions */}
                    {first_name && first_name.length >= 2 && (
                      <div className="th-suggestions">
                        {getNameSuggestions(first_name, 'first_name').map(name => (
                          <button
                            key={name}
                            type="button"
                            className="th-suggestion-btn"
                            onClick={() => setValue('first_name', name)}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Middle Name</label>
                    <input
                      type="text"
                      className="th-input"
                      placeholder="Enter middle name"
                      {...register('middle_name')}
                    />
                  </div>

                  <div className="th-form-group">
                    <label className="th-label th-label-required">Last Name</label>
                    <input
                      type="text"
                      className={`th-input ${errors.last_name ? 'th-input-error' : ''}`}
                      placeholder="Enter last name"
                      {...register('last_name', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.last_name && (
                      <span className="th-error-text">{errors.last_name.message}</span>
                    )}
                  </div>
                </div>

                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label th-label-required">Date of Birth</label>
                    <input
                      type="date"
                      className={`th-input ${errors.date_of_birth ? 'th-input-error' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                      {...register('date_of_birth', {
                        required: 'Date of birth is required',
                        validate: {
                          notFuture: value => {
                            const today = new Date();
                            const birthDate = new Date(value);
                            return birthDate <= today || 'Birth date cannot be in the future';
                          },
                          reasonable: value => {
                            const age = calculateAge(value);
                            return (age >= 0 && age <= 18) || 'Age must be between 0 and 18 years';
                          }
                        }
                      })}
                    />
                    {errors.date_of_birth && (
                      <span className="th-error-text">{errors.date_of_birth.message}</span>
                    )}
                    {date_of_birth && (
                      <div className="th-age-display">
                        Age: {calculateAge(date_of_birth)} years old
                      </div>
                    )}
                  </div>

                  <div className="th-form-group">
                    <label className="th-label th-label-required">Gender</label>
                    <select
                      className={`th-select ${errors.gender ? 'th-input-error' : ''}`}
                      {...register('gender', { required: 'Gender is required' })}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <span className="th-error-text">{errors.gender.message}</span>
                    )}
                  </div>

                  <div className="th-form-group">
                    <label className="th-label th-label-required">State of Origin</label>
                    <select
                      className={`th-select ${errors.state_of_origin ? 'th-input-error' : ''}`}
                      {...register('state_of_origin', { required: 'State of origin is required' })}
                      onChange={(e) => {
                        setValue('state_of_origin', e.target.value);
                        setValue('lga', ''); // Reset LGA when state changes
                      }}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {errors.state_of_origin && (
                      <span className="th-error-text">{errors.state_of_origin.message}</span>
                    )}
                  </div>
                </div>

                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Local Government Area</label>
                    <select
                      className="th-select"
                      {...register('lga')}
                      disabled={!watchedValues.state_of_origin}
                    >
                      <option value="">Select LGA</option>
                      {getLGAs(watchedValues.state_of_origin).map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Preferred Language</label>
                    <select
                      className="th-select"
                      {...register('preferred_language')}
                    >
                      {NIGERIAN_LANGUAGES.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Religion</label>
                    <select
                      className="th-select"
                      {...register('religion')}
                    >
                      <option value="">Select religion</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="th-form-group">
                  <label className="th-label">Tribal Marks / Identifying Features</label>
                  <textarea
                    className="th-textarea"
                    placeholder="Describe any tribal marks or identifying features"
                    rows="3"
                    {...register('tribal_marks')}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Medical Information */}
            {currentStep === 2 && (
              <div className="th-form-step th-slide-in-right">
                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Blood Type</label>
                    <select
                      className="th-select"
                      {...register('blood_type')}
                    >
                      <option value="">Select blood type</option>
                      {BLOOD_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Genotype</label>
                    <select
                      className="th-select"
                      {...register('genotype')}
                    >
                      <option value="">Select genotype</option>
                      {GENOTYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {genotypeWarning && (
                      <div className="th-warning-text">
                        ⚠️ {genotypeWarning}
                      </div>
                    )}
                  </div>
                </div>

                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Height (cm)</label>
                    <input
                      type="number"
                      className="th-input"
                      placeholder="Height in centimeters"
                      min="50"
                      max="200"
                      {...register('height_cm', {
                        min: { value: 50, message: 'Height must be at least 50cm' },
                        max: { value: 200, message: 'Height cannot exceed 200cm' }
                      })}
                    />
                    {errors.height_cm && (
                      <span className="th-error-text">{errors.height_cm.message}</span>
                    )}
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Weight (kg)</label>
                    <input
                      type="number"
                      className="th-input"
                      placeholder="Weight in kilograms"
                      min="2"
                      max="100"
                      step="0.1"
                      {...register('weight_kg', {
                        min: { value: 2, message: 'Weight must be at least 2kg' },
                        max: { value: 100, message: 'Weight cannot exceed 100kg' }
                      })}
                    />
                    {errors.weight_kg && (
                      <span className="th-error-text">{errors.weight_kg.message}</span>
                    )}
                  </div>
                </div>

                <div className="th-form-group">
                  <label className="th-label">Allergies</label>
                  <textarea
                    className="th-textarea"
                    placeholder="List any known allergies (food, medication, environmental)"
                    rows="3"
                    {...register('allergies')}
                  />
                </div>

                <div className="th-form-group">
                  <label className="th-label">Medical Conditions</label>
                  <textarea
                    className="th-textarea"
                    placeholder="Describe any existing medical conditions or ongoing treatments"
                    rows="4"
                    {...register('medical_conditions')}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Education & Development */}
            {currentStep === 3 && (
              <div className="th-form-step th-slide-in-right">
                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Education Level</label>
                    <select
                      className="th-select"
                      {...register('education_level')}
                    >
                      <option value="">Select education level</option>
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
                      <option value="Not in School">Not in School</option>
                    </select>
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">School Name</label>
                    <input
                      type="text"
                      className="th-input"
                      placeholder="Current school name"
                      {...register('school_name')}
                    />
                  </div>
                </div>

                <div className="th-form-group">
                  <label className="th-label">Ambition / Career Goals</label>
                  <input
                    type="text"
                    className="th-input"
                    placeholder="What does the child want to be when they grow up?"
                    {...register('ambition')}
                  />
                  <div className="th-help-text">
                    Examples: Doctor, Teacher, Engineer, Lawyer, Artist, etc.
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Legal & Guardian Information */}
            {currentStep === 4 && (
              <div className="th-form-step th-slide-in-right">
                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label th-label-required">Legal Guardian Name</label>
                    <input
                      type="text"
                      className={`th-input ${errors.legal_guardian_name ? 'th-input-error' : ''}`}
                      placeholder="Full name of legal guardian"
                      {...register('legal_guardian_name', {
                        required: 'Legal guardian name is required'
                      })}
                    />
                    {errors.legal_guardian_name && (
                      <span className="th-error-text">{errors.legal_guardian_name.message}</span>
                    )}
                  </div>

                  <div className="th-form-group">
                    <label className="th-label th-label-required">Guardian Contact</label>
                    <input
                      type="tel"
                      className={`th-input ${errors.legal_guardian_contact ? 'th-input-error' : ''}`}
                      placeholder="Phone number or address"
                      {...register('legal_guardian_contact', {
                        required: 'Guardian contact is required'
                      })}
                    />
                    {errors.legal_guardian_contact && (
                      <span className="th-error-text">{errors.legal_guardian_contact.message}</span>
                    )}
                  </div>
                </div>

                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Next of Kin Name</label>
                    <input
                      type="text"
                      className="th-input"
                      placeholder="Next of kin full name"
                      {...register('next_of_kin_name')}
                    />
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Next of Kin Contact</label>
                    <input
                      type="tel"
                      className="th-input"
                      placeholder="Phone number or address"
                      {...register('next_of_kin_contact')}
                    />
                  </div>
                </div>

                <div className="th-form-row">
                  <div className="th-form-group">
                    <label className="th-label">Emergency Contact</label>
                    <input
                      type="tel"
                      className="th-input"
                      placeholder="Emergency contact number"
                      {...register('emergency_contact')}
                    />
                  </div>

                  <div className="th-form-group">
                    <label className="th-label">Birth Certificate Number</label>
                    <input
                      type="text"
                      className="th-input"
                      placeholder="Birth certificate number"
                      {...register('birth_certificate_number')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Photo & Final Details */}
            {currentStep === 5 && (
              <div className="th-form-step th-slide-in-right">
                <div className="th-form-group">
                  <label className="th-label">Child Photo</label>
                  <FileUpload
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                    onFileSelect={setUploadedPhoto}
                    preview={true}
                    className="th-photo-upload"
                  />
                  <div className="th-help-text">
                    Upload a clear, recent photo of the child (max 5MB)
                  </div>
                </div>

                <div className="th-form-group">
                  <label className="th-label th-label-required">Arrival Circumstances</label>
                  <textarea
                    className={`th-textarea ${errors.arrival_circumstances ? 'th-input-error' : ''}`}
                    placeholder="Describe the circumstances that led to the child's admission to Tabitha Home"
                    rows="6"
                    {...register('arrival_circumstances', {
                      required: 'Arrival circumstances are required',
                      minLength: {
                        value: 20,
                        message: 'Please provide a detailed description (at least 20 characters)'
                      }
                    })}
                  />
                  {errors.arrival_circumstances && (
                    <span className="th-error-text">{errors.arrival_circumstances.message}</span>
                  )}
                  <div className="th-help-text">
                    Include relevant details about family situation, reasons for admission, 
                    and any other important background information.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Navigation */}
          <div className="th-form-footer">
            <div className="th-form-actions">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  icon={<FaArrowLeft />}
                  onClick={prevStep}
                >
                  Previous
                </Button>
              )}
              
              <div className="th-form-actions-right">
                {currentStep === totalSteps ? (
                  <>
                    <Button
                      type="button"
                      variant="glass"
                      icon={<FaEye />}
                      onClick={onPreviewClick}
                    >
                      Preview
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={<FaCheck />}
                      loading={isLoading}
                    >
                      {mode === 'create' ? 'Add Child' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    icon={<FaArrowRight />}
                    onClick={nextStep}
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChildForm;
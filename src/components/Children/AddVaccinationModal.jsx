// src/components/Children/AddVaccinationModal.jsx
import React, { useState } from 'react';
import {
  FaTimes,
  FaSyringe,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSave,
  FaThermometerHalf,
  FaAllergies,
  FaBaby,
  FaChild,
  FaUserGraduate
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Button from '../UI/Button/Button';
import { format, parseISO, differenceInMonths } from 'date-fns';
import './AddVaccinationModal.css';

const AddVaccinationModal = ({ isOpen, onClose, childId, onVaccinationAdded }) => {
  const [loading, setLoading] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      date_given: format(new Date(), 'yyyy-MM-dd'),
      time_given: format(new Date(), 'HH:mm'),
      vaccine_name: '',
      vaccine_type: '',
      manufacturer: '',
      batch_number: '',
      lot_number: '',
      expiry_date: '',
      dose_number: 1,
      site_of_administration: 'left_arm',
      route_of_administration: 'intramuscular',
      volume_given: '',
      healthcare_provider: '',
      facility_name: '',
      facility_address: '',
      next_dose_due: '',
      adverse_reactions: 'none',
      reaction_details: '',
      pre_vaccination_temp: '',
      post_vaccination_temp: '',
      notes: '',
      vaccine_series: 'routine'
    }
  });

  const adverseReactions = watch('adverse_reactions');
  const vaccineType = watch('vaccine_type');

  // Nigerian vaccination schedule (simplified)
  const nigerianVaccines = [
    {
      category: 'Birth',
      vaccines: [
        { name: 'BCG', fullName: 'Bacillus Calmette-Guérin', schedule: ['Birth'], route: 'intradermal' },
        { name: 'HepB-BD', fullName: 'Hepatitis B (Birth Dose)', schedule: ['Birth'], route: 'intramuscular' },
        { name: 'OPV-0', fullName: 'Oral Polio Vaccine (Birth)', schedule: ['Birth'], route: 'oral' }
      ]
    },
    {
      category: '6 Weeks',
      vaccines: [
        { name: 'OPV-1', fullName: 'Oral Polio Vaccine (1st)', schedule: ['6 weeks'], route: 'oral' },
        { name: 'Penta-1', fullName: 'Pentavalent (DPT-HepB-Hib) 1st', schedule: ['6 weeks'], route: 'intramuscular' },
        { name: 'PCV-1', fullName: 'Pneumococcal Conjugate 1st', schedule: ['6 weeks'], route: 'intramuscular' },
        { name: 'Rota-1', fullName: 'Rotavirus 1st', schedule: ['6 weeks'], route: 'oral' }
      ]
    },
    {
      category: '10 Weeks',
      vaccines: [
        { name: 'OPV-2', fullName: 'Oral Polio Vaccine (2nd)', schedule: ['10 weeks'], route: 'oral' },
        { name: 'Penta-2', fullName: 'Pentavalent (DPT-HepB-Hib) 2nd', schedule: ['10 weeks'], route: 'intramuscular' },
        { name: 'PCV-2', fullName: 'Pneumococcal Conjugate 2nd', schedule: ['10 weeks'], route: 'intramuscular' },
        { name: 'Rota-2', fullName: 'Rotavirus 2nd', schedule: ['10 weeks'], route: 'oral' }
      ]
    },
    {
      category: '14 Weeks',
      vaccines: [
        { name: 'OPV-3', fullName: 'Oral Polio Vaccine (3rd)', schedule: ['14 weeks'], route: 'oral' },
        { name: 'Penta-3', fullName: 'Pentavalent (DPT-HepB-Hib) 3rd', schedule: ['14 weeks'], route: 'intramuscular' },
        { name: 'PCV-3', fullName: 'Pneumococcal Conjugate 3rd', schedule: ['14 weeks'], route: 'intramuscular' },
        { name: 'IPV', fullName: 'Inactivated Polio Vaccine', schedule: ['14 weeks'], route: 'intramuscular' }
      ]
    },
    {
      category: '9 Months',
      vaccines: [
        { name: 'Measles', fullName: 'Measles Vaccine', schedule: ['9 months'], route: 'subcutaneous' },
        { name: 'Yellow Fever', fullName: 'Yellow Fever Vaccine', schedule: ['9 months'], route: 'subcutaneous' }
      ]
    },
    {
      category: '15 Months',
      vaccines: [
        { name: 'MMR', fullName: 'Measles-Mumps-Rubella', schedule: ['15 months'], route: 'subcutaneous' }
      ]
    },
    {
      category: 'School Age',
      vaccines: [
        { name: 'DT', fullName: 'Diphtheria-Tetanus', schedule: ['School entry'], route: 'intramuscular' },
        { name: 'HPV', fullName: 'Human Papillomavirus', schedule: ['9-14 years'], route: 'intramuscular' }
      ]
    }
  ];

  // Administration sites
  const administrationSites = [
    { value: 'left_arm', label: 'Left Arm (Deltoid)' },
    { value: 'right_arm', label: 'Right Arm (Deltoid)' },
    { value: 'left_thigh', label: 'Left Thigh (Vastus Lateralis)' },
    { value: 'right_thigh', label: 'Right Thigh (Vastus Lateralis)' },
    { value: 'oral', label: 'Oral Administration' },
    { value: 'nasal', label: 'Nasal Administration' },
    { value: 'other', label: 'Other (Specify in notes)' }
  ];

  // Routes of administration
  const administrationRoutes = [
    { value: 'intramuscular', label: 'Intramuscular (IM)' },
    { value: 'subcutaneous', label: 'Subcutaneous (SC)' },
    { value: 'intradermal', label: 'Intradermal (ID)' },
    { value: 'oral', label: 'Oral' },
    { value: 'nasal', label: 'Nasal' },
    { value: 'other', label: 'Other' }
  ];

  // Adverse reaction types
  const adverseReactionTypes = [
    { value: 'none', label: 'No Adverse Reactions' },
    { value: 'mild_local', label: 'Mild Local Reaction (Pain, Redness, Swelling)' },
    { value: 'mild_systemic', label: 'Mild Systemic Reaction (Fever, Irritability)' },
    { value: 'moderate', label: 'Moderate Reaction' },
    { value: 'severe', label: 'Severe Reaction' },
    { value: 'allergic', label: 'Allergic Reaction' },
    { value: 'anaphylaxis', label: 'Anaphylaxis (Emergency)' }
  ];

  const handleVaccineSelect = (vaccine) => {
    setSelectedVaccine(vaccine.name);
    setValue('vaccine_name', vaccine.name);
    setValue('vaccine_type', vaccine.fullName);
    setValue('route_of_administration', vaccine.route);
    
    // Set default administration site based on route
    if (vaccine.route === 'oral') {
      setValue('site_of_administration', 'oral');
    } else if (vaccine.route === 'intramuscular') {
      setValue('site_of_administration', 'left_arm');
    } else if (vaccine.route === 'subcutaneous') {
      setValue('site_of_administration', 'left_arm');
    } else if (vaccine.route === 'intradermal') {
      setValue('site_of_administration', 'left_arm');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format the data for API submission
      const formattedData = {
        ...data,
        child_id: childId,
        created_at: new Date().toISOString(),
        created_by: 'Current User', // Replace with actual user
        status: 'completed',
        pre_vaccination_temp: data.pre_vaccination_temp ? 
          parseFloat(data.pre_vaccination_temp) : null,
        post_vaccination_temp: data.post_vaccination_temp ? 
          parseFloat(data.post_vaccination_temp) : null,
        volume_given: data.volume_given ? 
          parseFloat(data.volume_given) : null
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onVaccinationAdded(formattedData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding vaccination record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="th-modal-overlay">
      <div className="th-modal-container th-vaccination-modal">
        <div className="th-modal-header">
          <div className="th-modal-title-section">
            <h2 className="th-modal-title">
              <FaSyringe className="th-modal-icon" />
              Add Vaccination Record
            </h2>
            <p className="th-modal-subtitle">
              Record vaccination details following Nigerian immunization schedule
            </p>
          </div>
          <button className="th-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="th-modal-body">
          {/* Vaccine Selection */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaSyringe className="th-section-icon" />
              Vaccine Selection
            </h3>
            
            <div className="th-vaccine-categories">
              {nigerianVaccines.map(category => (
                <div key={category.category} className="th-vaccine-category">
                  <h4 className="th-category-title">
                    {category.category === 'Birth' && <FaBaby className="th-category-icon" />}
                    {(category.category.includes('Weeks') || category.category.includes('Months')) && 
                     <FaChild className="th-category-icon" />}
                    {category.category === 'School Age' && <FaUserGraduate className="th-category-icon" />}
                    {category.category}
                  </h4>
                  <div className="th-vaccines-grid">
                    {category.vaccines.map(vaccine => (
                      <button
                        key={vaccine.name}
                        type="button"
                        className={`th-vaccine-btn ${selectedVaccine === vaccine.name ? 'selected' : ''}`}
                        onClick={() => handleVaccineSelect(vaccine)}
                      >
                        <span className="th-vaccine-name">{vaccine.name}</span>
                        <span className="th-vaccine-full-name">{vaccine.fullName}</span>
                        <span className="th-vaccine-route">{vaccine.route}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="th-form-group">
              <label className="th-form-label">Custom Vaccine (if not listed above)</label>
              <input
                type="text"
                {...register('vaccine_name')}
                placeholder="Enter vaccine name if not in the list above"
                className="th-form-input"
              />
            </div>
          </div>

          {/* Administration Details */}
          <div className="th-form-section">
            <h3 className="th-section-title">Administration Details</h3>
            
            <div className="th-form-grid th-grid-cols-3">
              <div className="th-form-group">
                <label className="th-form-label">
                  <FaCalendarAlt className="th-label-icon" />
                  Date Given
                </label>
                <input
                  type="date"
                  {...register('date_given', { required: 'Date is required' })}
                  className="th-form-input"
                />
                {errors.date_given && (
                  <span className="th-form-error">{errors.date_given.message}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-form-label">
                  <FaClock className="th-label-icon" />
                  Time Given
                </label>
                <input
                  type="time"
                  {...register('time_given')}
                  className="th-form-input"
                />
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Dose Number</label>
                <select
                  {...register('dose_number')}
                  className="th-form-select"
                >
                  <option value={1}>1st Dose</option>
                  <option value={2}>2nd Dose</option>
                  <option value={3}>3rd Dose</option>
                  <option value={4}>4th Dose</option>
                  <option value={5}>5th Dose</option>
                  <option value="booster">Booster</option>
                </select>
              </div>
            </div>

            <div className="th-form-grid th-grid-cols-2">
              <div className="th-form-group">
                <label className="th-form-label">Site of Administration</label>
                <select
                  {...register('site_of_administration')}
                  className="th-form-select"
                >
                  {administrationSites.map(site => (
                    <option key={site.value} value={site.value}>
                      {site.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Route of Administration</label>
                <select
                  {...register('route_of_administration')}
                  className="th-form-select"
                >
                  {administrationRoutes.map(route => (
                    <option key={route.value} value={route.value}>
                      {route.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="th-form-group">
              <label className="th-form-label">Volume Given (ml)</label>
              <input
                type="number"
                step="0.1"
                {...register('volume_given')}
                placeholder="0.5"
                className="th-form-input"
              />
            </div>
          </div>

          {/* Vaccine Information */}
          <div className="th-form-section">
            <h3 className="th-section-title">Vaccine Information</h3>
            
            <div className="th-form-grid th-grid-cols-2">
              <div className="th-form-group">
                <label className="th-form-label">Manufacturer</label>
                <input
                  type="text"
                  {...register('manufacturer')}
                  placeholder="e.g., GSK, Pfizer, Sanofi"
                  className="th-form-input"
                />
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Batch/Lot Number</label>
                <input
                  type="text"
                  {...register('batch_number')}
                  placeholder="Batch or lot number"
                  className="th-form-input"
                />
              </div>
            </div>

            <div className="th-form-group">
              <label className="th-form-label">Expiry Date</label>
              <input
                type="date"
                {...register('expiry_date')}
                className="th-form-input"
              />
            </div>
          </div>

          {/* Healthcare Provider */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaUserMd className="th-section-icon" />
              Healthcare Provider & Facility
            </h3>
            
            <div className="th-form-grid th-grid-cols-2">
              <div className="th-form-group">
                <label className="th-form-label">Healthcare Provider</label>
                <input
                  type="text"
                  {...register('healthcare_provider', { required: 'Provider is required' })}
                  placeholder="Dr. Jane Smith"
                  className="th-form-input"
                />
                {errors.healthcare_provider && (
                  <span className="th-form-error">{errors.healthcare_provider.message}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Facility Name</label>
                <input
                  type="text"
                  {...register('facility_name')}
                  placeholder="Primary Health Centre"
                  className="th-form-input"
                />
              </div>
            </div>

            <div className="th-form-group">
              <label className="th-form-label">
                <FaMapMarkerAlt className="th-label-icon" />
                Facility Address
              </label>
              <textarea
                {...register('facility_address')}
                placeholder="Complete address of the healthcare facility"
                className="th-form-textarea"
                rows="2"
              />
            </div>
          </div>

          {/* Vital Signs */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaThermometerHalf className="th-section-icon" />
              Temperature Monitoring
            </h3>
            
            <div className="th-form-grid th-grid-cols-2">
              <div className="th-form-group">
                <label className="th-form-label">Pre-vaccination Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('pre_vaccination_temp')}
                  placeholder="36.5"
                  className="th-form-input"
                />
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Post-vaccination Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('post_vaccination_temp')}
                  placeholder="36.7"
                  className="th-form-input"
                />
              </div>
            </div>
          </div>

          {/* Adverse Reactions */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaAllergies className="th-section-icon" />
              Adverse Reactions
            </h3>
            
            <div className="th-form-group">
              <label className="th-form-label">Reaction Type</label>
              <select
                {...register('adverse_reactions')}
                className="th-form-select"
              >
                {adverseReactionTypes.map(reaction => (
                  <option key={reaction.value} value={reaction.value}>
                    {reaction.label}
                  </option>
                ))}
              </select>
            </div>

            {adverseReactions !== 'none' && (
              <div className="th-form-group">
                <label className="th-form-label">Reaction Details</label>
                <textarea
                  {...register('reaction_details')}
                  placeholder="Describe the adverse reaction in detail, including onset time, duration, severity, and any treatment given..."
                  className="th-form-textarea"
                  rows="3"
                />
                {adverseReactions === 'anaphylaxis' && (
                  <div className="th-alert th-alert-error">
                    <FaExclamationTriangle className="th-alert-icon" />
                    <span>Emergency medical attention required for anaphylaxis. Ensure proper emergency protocols were followed.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Dose */}
          <div className="th-form-section">
            <h3 className="th-section-title">Next Dose Information</h3>
            
            <div className="th-form-group">
              <label className="th-form-label">Next Dose Due Date</label>
              <input
                type="date"
                {...register('next_dose_due')}
                className="th-form-input"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="th-form-section">
            <h3 className="th-section-title">Additional Notes</h3>
            <div className="th-form-group">
              <textarea
                {...register('notes')}
                placeholder="Any additional observations, complications, or relevant information..."
                className="th-form-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="th-modal-footer">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<FaSave />}
              loading={loading}
            >
              Save Vaccination Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVaccinationModal;
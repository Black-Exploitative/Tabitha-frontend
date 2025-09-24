// src/components/Children/AddMedicalRecordModal.jsx
import React, { useState } from 'react';
import {
  FaTimes,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaThermometerHalf,
  FaWeight,
  FaRuler,
  FaStethoscope,
  FaPills,
  FaClipboardList,
  FaSave,
  FaExclamationTriangle,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../UI/Button/Button';
import { format } from 'date-fns';
import './AddMedicalRecordModal.css';

const AddMedicalRecordModal = ({ isOpen, onClose, childId, onRecordAdded }) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      type: 'checkup',
      provider: '',
      facility: '',
      chief_complaint: '',
      symptoms: [],
      vital_signs: {
        temperature: '',
        temperature_unit: 'celsius',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        height: '',
        weight: ''
      },
      examination_findings: '',
      diagnosis: '',
      treatment_plan: '',
      medications: [],
      follow_up_required: false,
      follow_up_date: '',
      follow_up_instructions: '',
      notes: '',
      attachments: []
    }
  });

  const { fields: symptomFields, append: addSymptom, remove: removeSymptom } = useFieldArray({
    control,
    name: 'symptoms'
  });

  const { fields: medicationFields, append: addMedication, remove: removeMedication } = useFieldArray({
    control,
    name: 'medications'
  });

  const recordType = watch('type');
  const followUpRequired = watch('follow_up_required');

  // Common symptoms for quick selection
  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Sore throat', 'Runny nose', 'Nausea', 
    'Vomiting', 'Diarrhea', 'Abdominal pain', 'Fatigue', 'Loss of appetite',
    'Difficulty breathing', 'Skin rash', 'Joint pain', 'Dizziness'
  ];

  // Medical record types
  const recordTypes = [
    { value: 'checkup', label: 'Regular Checkup' },
    { value: 'illness', label: 'Illness/Sick Visit' },
    { value: 'emergency', label: 'Emergency Visit' },
    { value: 'specialist', label: 'Specialist Consultation' },
    { value: 'dental', label: 'Dental Visit' },
    { value: 'vision', label: 'Vision/Eye Exam' },
    { value: 'hearing', label: 'Hearing Test' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'laboratory', label: 'Laboratory Tests' },
    { value: 'imaging', label: 'Medical Imaging' },
    { value: 'therapy', label: 'Physical/Occupational Therapy' }
  ];

  const handleAddSymptom = (symptom) => {
    addSymptom({ symptom, severity: 'mild', duration: '', notes: '' });
  };

  const handleAddMedication = () => {
    addMedication({ 
      name: '', 
      dosage: '', 
      frequency: '', 
      duration: '', 
      instructions: '' 
    });
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
        vital_signs: {
          ...data.vital_signs,
          temperature: data.vital_signs.temperature ? 
            parseFloat(data.vital_signs.temperature) : null,
          blood_pressure: data.vital_signs.blood_pressure_systolic && 
            data.vital_signs.blood_pressure_diastolic ?
            `${data.vital_signs.blood_pressure_systolic}/${data.vital_signs.blood_pressure_diastolic}` : null,
          heart_rate: data.vital_signs.heart_rate ? 
            parseInt(data.vital_signs.heart_rate) : null,
          respiratory_rate: data.vital_signs.respiratory_rate ? 
            parseInt(data.vital_signs.respiratory_rate) : null,
          oxygen_saturation: data.vital_signs.oxygen_saturation ? 
            parseInt(data.vital_signs.oxygen_saturation) : null,
          height: data.vital_signs.height ? 
            parseFloat(data.vital_signs.height) : null,
          weight: data.vital_signs.weight ? 
            parseFloat(data.vital_signs.weight) : null
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRecordAdded(formattedData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding medical record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="th-modal-overlay">
      <div className="th-modal-container th-medical-modal">
        <div className="th-modal-header">
          <div className="th-modal-title-section">
            <h2 className="th-modal-title">
              <FaUserMd className="th-modal-icon" />
              Add Medical Record
            </h2>
            <p className="th-modal-subtitle">
              Record medical examination, treatment, or health observation
            </p>
          </div>
          <button className="th-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="th-modal-body">
          {/* Basic Information */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaClipboardList className="th-section-icon" />
              Basic Information
            </h3>
            
            <div className="th-form-grid th-grid-cols-3">
              <div className="th-form-group">
                <label className="th-form-label">
                  <FaCalendarAlt className="th-label-icon" />
                  Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className="th-form-input"
                />
                {errors.date && (
                  <span className="th-form-error">{errors.date.message}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-form-label">
                  <FaClock className="th-label-icon" />
                  Time
                </label>
                <input
                  type="time"
                  {...register('time', { required: 'Time is required' })}
                  className="th-form-input"
                />
                {errors.time && (
                  <span className="th-form-error">{errors.time.message}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Record Type</label>
                <select
                  {...register('type', { required: 'Record type is required' })}
                  className="th-form-select"
                >
                  {recordTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="th-form-error">{errors.type.message}</span>
                )}
              </div>
            </div>

            <div className="th-form-grid th-grid-cols-2">
              <div className="th-form-group">
                <label className="th-form-label">
                  <FaUserMd className="th-label-icon" />
                  Healthcare Provider
                </label>
                <input
                  type="text"
                  {...register('provider', { required: 'Provider is required' })}
                  placeholder="Dr. John Smith"
                  className="th-form-input"
                />
                {errors.provider && (
                  <span className="th-form-error">{errors.provider.message}</span>
                )}
              </div>

              <div className="th-form-group">
                <label className="th-form-label">Medical Facility</label>
                <input
                  type="text"
                  {...register('facility')}
                  placeholder="Lagos University Teaching Hospital"
                  className="th-form-input"
                />
              </div>
            </div>

            {recordType === 'illness' && (
              <div className="th-form-group">
                <label className="th-form-label">Chief Complaint</label>
                <textarea
                  {...register('chief_complaint')}
                  placeholder="Main reason for visit or primary concern..."
                  className="th-form-textarea"
                  rows="2"
                />
              </div>
            )}
          </div>

          {/* Symptoms */}
          {(recordType === 'illness' || recordType === 'emergency') && (
            <div className="th-form-section">
              <div className="th-section-header">
                <h3 className="th-section-title">
                  <FaExclamationTriangle className="th-section-icon" />
                  Symptoms
                </h3>
                <div className="th-quick-symptoms">
                  <span className="th-quick-label">Quick add:</span>
                  {commonSymptoms.slice(0, 6).map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      className="th-quick-btn"
                      onClick={() => handleAddSymptom(symptom)}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="th-symptoms-list">
                {symptomFields.map((field, index) => (
                  <div key={field.id} className="th-symptom-item">
                    <div className="th-form-grid th-grid-cols-4">
                      <div className="th-form-group">
                        <input
                          type="text"
                          {...register(`symptoms.${index}.symptom`)}
                          placeholder="Symptom"
                          className="th-form-input"
                        />
                      </div>
                      <div className="th-form-group">
                        <select
                          {...register(`symptoms.${index}.severity`)}
                          className="th-form-select"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                      <div className="th-form-group">
                        <input
                          type="text"
                          {...register(`symptoms.${index}.duration`)}
                          placeholder="Duration"
                          className="th-form-input"
                        />
                      </div>
                      <div className="th-form-group">
                        <button
                          type="button"
                          className="th-remove-btn"
                          onClick={() => removeSymptom(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="th-form-group">
                      <textarea
                        {...register(`symptoms.${index}.notes`)}
                        placeholder="Additional notes about this symptom..."
                        className="th-form-textarea"
                        rows="1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="th-add-btn"
                onClick={() => handleAddSymptom('')}
              >
                <FaPlus /> Add Symptom
              </button>
            </div>
          )}

          {/* Vital Signs */}
          <div className="th-form-section">
            <h3 className="th-section-title">
              <FaStethoscope className="th-section-icon" />
              Vital Signs & Measurements
            </h3>
            
            <div className="th-vitals-grid">
              <div className="th-vital-group">
                <label className="th-form-label">
                  <FaThermometerHalf className="th-label-icon" />
                  Temperature
                </label>
                <div className="th-input-group">
                  <input
                    type="number"
                    step="0.1"
                    {...register('vital_signs.temperature')}
                    placeholder="36.5"
                    className="th-form-input"
                  />
                  <select
                    {...register('vital_signs.temperature_unit')}
                    className="th-form-select th-unit-select"
                  >
                    <option value="celsius">°C</option>
                    <option value="fahrenheit">°F</option>
                  </select>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">Blood Pressure</label>
                <div className="th-bp-group">
                  <input
                    type="number"
                    {...register('vital_signs.blood_pressure_systolic')}
                    placeholder="120"
                    className="th-form-input"
                  />
                  <span className="th-bp-separator">/</span>
                  <input
                    type="number"
                    {...register('vital_signs.blood_pressure_diastolic')}
                    placeholder="80"
                    className="th-form-input"
                  />
                  <span className="th-bp-unit">mmHg</span>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">Heart Rate</label>
                <div className="th-input-group">
                  <input
                    type="number"
                    {...register('vital_signs.heart_rate')}
                    placeholder="72"
                    className="th-form-input"
                  />
                  <span className="th-unit">bpm</span>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">Respiratory Rate</label>
                <div className="th-input-group">
                  <input
                    type="number"
                    {...register('vital_signs.respiratory_rate')}
                    placeholder="16"
                    className="th-form-input"
                  />
                  <span className="th-unit">per min</span>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">Oxygen Saturation</label>
                <div className="th-input-group">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('vital_signs.oxygen_saturation')}
                    placeholder="98"
                    className="th-form-input"
                  />
                  <span className="th-unit">%</span>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">
                  <FaRuler className="th-label-icon" />
                  Height
                </label>
                <div className="th-input-group">
                  <input
                    type="number"
                    step="0.1"
                    {...register('vital_signs.height')}
                    placeholder="120.5"
                    className="th-form-input"
                  />
                  <span className="th-unit">cm</span>
                </div>
              </div>

              <div className="th-vital-group">
                <label className="th-form-label">
                  <FaWeight className="th-label-icon" />
                  Weight
                </label>
                <div className="th-input-group">
                  <input
                    type="number"
                    step="0.1"
                    {...register('vital_signs.weight')}
                    placeholder="25.0"
                    className="th-form-input"
                  />
                  <span className="th-unit">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Examination & Diagnosis */}
          <div className="th-form-section">
            <h3 className="th-section-title">Examination & Diagnosis</h3>
            
            <div className="th-form-group">
              <label className="th-form-label">Examination Findings</label>
              <textarea
                {...register('examination_findings')}
                placeholder="Physical examination findings, observations, test results..."
                className="th-form-textarea"
                rows="3"
              />
            </div>

            <div className="th-form-group">
              <label className="th-form-label">Diagnosis</label>
              <textarea
                {...register('diagnosis')}
                placeholder="Primary and secondary diagnoses..."
                className="th-form-textarea"
                rows="2"
              />
            </div>

            <div className="th-form-group">
              <label className="th-form-label">Treatment Plan</label>
              <textarea
                {...register('treatment_plan')}
                placeholder="Treatment recommendations, care instructions..."
                className="th-form-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* Medications */}
          <div className="th-form-section">
            <div className="th-section-header">
              <h3 className="th-section-title">
                <FaPills className="th-section-icon" />
                Medications Prescribed
              </h3>
            </div>

            <div className="th-medications-list">
              {medicationFields.map((field, index) => (
                <div key={field.id} className="th-medication-item">
                  <div className="th-form-grid th-grid-cols-2">
                    <div className="th-form-group">
                      <input
                        type="text"
                        {...register(`medications.${index}.name`)}
                        placeholder="Medication name"
                        className="th-form-input"
                      />
                    </div>
                    <div className="th-form-group">
                      <input
                        type="text"
                        {...register(`medications.${index}.dosage`)}
                        placeholder="Dosage (e.g., 250mg)"
                        className="th-form-input"
                      />
                    </div>
                  </div>
                  <div className="th-form-grid th-grid-cols-3">
                    <div className="th-form-group">
                      <input
                        type="text"
                        {...register(`medications.${index}.frequency`)}
                        placeholder="Frequency (e.g., twice daily)"
                        className="th-form-input"
                      />
                    </div>
                    <div className="th-form-group">
                      <input
                        type="text"
                        {...register(`medications.${index}.duration`)}
                        placeholder="Duration (e.g., 7 days)"
                        className="th-form-input"
                      />
                    </div>
                    <div className="th-form-group">
                      <button
                        type="button"
                        className="th-remove-btn"
                        onClick={() => removeMedication(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="th-form-group">
                    <textarea
                      {...register(`medications.${index}.instructions`)}
                      placeholder="Special instructions (e.g., take with food, avoid dairy...)"
                      className="th-form-textarea"
                      rows="1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="th-add-btn"
              onClick={handleAddMedication}
            >
              <FaPlus /> Add Medication
            </button>
          </div>

          {/* Follow-up */}
          <div className="th-form-section">
            <h3 className="th-section-title">Follow-up Care</h3>
            
            <div className="th-form-group">
              <label className="th-checkbox-label">
                <input
                  type="checkbox"
                  {...register('follow_up_required')}
                  className="th-checkbox"
                />
                <span className="th-checkbox-text">Follow-up appointment required</span>
              </label>
            </div>

            {followUpRequired && (
              <div className="th-form-grid th-grid-cols-2">
                <div className="th-form-group">
                  <label className="th-form-label">Follow-up Date</label>
                  <input
                    type="date"
                    {...register('follow_up_date')}
                    className="th-form-input"
                  />
                </div>
                <div className="th-form-group">
                  <label className="th-form-label">Follow-up Instructions</label>
                  <textarea
                    {...register('follow_up_instructions')}
                    placeholder="Specific instructions for follow-up care..."
                    className="th-form-textarea"
                    rows="2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="th-form-section">
            <h3 className="th-section-title">Additional Notes</h3>
            <div className="th-form-group">
              <textarea
                {...register('notes')}
                placeholder="Any additional observations, concerns, or relevant information..."
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
              Save Medical Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicalRecordModal;
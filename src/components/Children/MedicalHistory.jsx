// src/components/Children/MedicalHistory.jsx
import React, { useState } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaSyringe,
  FaStethoscope,
  FaHeartbeat,
  FaPills,
  FaAllergies,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaCalendarAlt,
  FaUserMd,
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowUp
} from 'react-icons/fa';
import { format, differenceInDays, isAfter } from 'date-fns';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import { NIGERIAN_VACCINATION_SCHEDULE, GENOTYPE_RISKS, COMMON_MEDICAL_CONDITIONS } from '../../utils/nigerianMedicalData';
import AddMedicalRecordModal from './AddMedicalRecordModal';
import AddVaccinationModal from './AddVaccinationModal';
import './MedicalHistory.css';

const MedicalHistory = ({ childId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showVaccination, setShowVaccination] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock medical data - replace with API calls
  const mockMedicalData = {
    overview: {
      blood_type: 'O+',
      genotype: 'AS',
      height: 142, // cm
      weight: 35, // kg
      bmi: 17.4,
      last_checkup: '2024-05-15',
      next_appointment: '2024-07-15',
      allergies: ['Penicillin', 'Peanuts'],
      chronic_conditions: ['Mild Asthma'],
      immunization_status: 'Up to date',
      health_insurance: 'NHIS - Active'
    },
    recent_records: [
      {
        id: 1,
        date: '2024-05-15',
        type: 'Regular Checkup',
        provider: 'Dr. Adebayo Johnson',
        facility: 'Lagos University Teaching Hospital',
        diagnosis: 'Healthy - Normal development',
        treatment: 'Routine vitamins, continue current diet',
        notes: 'Height and weight within normal range for age',
        follow_up: '2024-07-15',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-04-02',
        type: 'Sick Visit',
        provider: 'Dr. Fatima Okafor',
        facility: 'Tabitha Home Clinic',
        diagnosis: 'Upper Respiratory Infection',
        treatment: 'Amoxicillin 250mg 3x daily for 7 days',
        notes: 'Mild cold symptoms, no fever',
        follow_up: '2024-04-09',
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-03-18',
        type: 'Vaccination',
        provider: 'Nurse Mary Okonkwo',
        facility: 'Primary Healthcare Center',
        diagnosis: 'HPV Vaccination - Dose 2',
        treatment: 'HPV vaccine administered',
        notes: 'No adverse reactions observed',
        follow_up: '2025-03-18',
        status: 'completed'
      }
    ],
    vaccinations: [
      {
        vaccine: 'BCG',
        due_date: '2015-04-15',
        given_date: '2015-04-16',
        status: 'completed',
        facility: 'General Hospital Lagos'
      },
      {
        vaccine: 'DPT 1',
        due_date: '2015-06-15',
        given_date: '2015-06-20',
        status: 'completed',
        facility: 'Primary Healthcare Center'
      },
      {
        vaccine: 'HPV 3',
        due_date: '2024-09-18',
        given_date: null,
        status: 'due',
        facility: 'TBD'
      }
    ],
    growth_data: [
      { date: '2024-01-15', height: 138, weight: 32 },
      { date: '2024-03-15', height: 140, weight: 33.5 },
      { date: '2024-05-15', height: 142, weight: 35 }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaStethoscope },
    { id: 'records', label: 'Medical Records', icon: FaHeartbeat },
    { id: 'vaccinations', label: 'Vaccinations', icon: FaSyringe },
    { id: 'growth', label: 'Growth Chart', icon: FaArrowUp },
    { id: 'allergies', label: 'Allergies & Conditions', icon: FaAllergies }
  ];

  const getVaccinationStatus = (vaccination) => {
    if (vaccination.status === 'completed') return 'completed';
    if (vaccination.status === 'due') {
      const dueDate = new Date(vaccination.due_date);
      const today = new Date();
      const daysOverdue = differenceInDays(today, dueDate);
      if (daysOverdue > 30) return 'overdue';
      if (daysOverdue > 0) return 'due';
      return 'upcoming';
    }
    return 'pending';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      due: 'warning',
      overdue: 'error',
      upcoming: 'info',
      pending: 'muted'
    };
    return colors[status] || 'muted';
  };

  const getGenotypeRisk = (genotype) => {
    const risks = GENOTYPE_RISKS[genotype] || [];
    return risks;
  };

  return (
    <div className="th-medical-history">
      <div className="th-medical-header">
        <div className="th-header-content">
          <h2 className="th-medical-title">
            <FaStethoscope className="th-title-icon" />
            Medical History & Health Records
          </h2>
          <p className="th-medical-subtitle">
            Comprehensive health tracking and medical records management
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVaccination(true)}
            icon={FaSyringe}
          >
            Add Vaccination
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddRecord(true)}
            icon={FaPlus}
          >
            Add Medical Record
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="th-medical-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`th-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="th-tab-icon" />
              <span className="th-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="th-medical-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="th-overview-content">
            <div className="th-overview-grid">
              {/* Basic Health Info */}
              <div className="th-health-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaHeartbeat className="th-card-icon" />
                    Basic Health Information
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-health-grid">
                    <div className="th-health-item">
                      <span className="th-health-label">Blood Type</span>
                      <span className="th-health-value blood-type">
                        {mockMedicalData.overview.blood_type}
                      </span>
                    </div>
                    <div className="th-health-item">
                      <span className="th-health-label">Genotype</span>
                      <div className="th-genotype-container">
                        <span className={`th-health-value genotype-${mockMedicalData.overview.genotype}`}>
                          {mockMedicalData.overview.genotype}
                        </span>
                        {mockMedicalData.overview.genotype === 'AS' && (
                          <FaExclamationTriangle className="th-warning-icon" title="Sickle cell trait - monitor for complications" />
                        )}
                      </div>
                    </div>
                    <div className="th-health-item">
                      <span className="th-health-label">Height</span>
                      <span className="th-health-value">{mockMedicalData.overview.height} cm</span>
                    </div>
                    <div className="th-health-item">
                      <span className="th-health-label">Weight</span>
                      <span className="th-health-value">{mockMedicalData.overview.weight} kg</span>
                    </div>
                    <div className="th-health-item">
                      <span className="th-health-label">BMI</span>
                      <span className="th-health-value">{mockMedicalData.overview.bmi}</span>
                    </div>
                    <div className="th-health-item">
                      <span className="th-health-label">Insurance</span>
                      <span className="th-health-value insurance-active">
                        {mockMedicalData.overview.health_insurance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Checkups */}
              <div className="th-health-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaCalendarAlt className="th-card-icon" />
                    Recent & Upcoming
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-checkup-item">
                    <span className="th-checkup-label">Last Checkup</span>
                    <span className="th-checkup-date">
                      {format(new Date(mockMedicalData.overview.last_checkup), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="th-checkup-item">
                    <span className="th-checkup-label">Next Appointment</span>
                    <span className="th-checkup-date upcoming">
                      {format(new Date(mockMedicalData.overview.next_appointment), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="th-checkup-item">
                    <span className="th-checkup-label">Immunization Status</span>
                    <span className="th-immunization-status up-to-date">
                      <FaCheckCircle className="th-status-icon" />
                      {mockMedicalData.overview.immunization_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alerts & Conditions */}
              <div className="th-health-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaExclamationTriangle className="th-card-icon" />
                    Health Alerts & Conditions
                  </h3>
                </div>
                <div className="th-card-body">
                  {mockMedicalData.overview.allergies.length > 0 && (
                    <div className="th-alert-section">
                      <span className="th-alert-label">Allergies</span>
                      <div className="th-alert-tags">
                        {mockMedicalData.overview.allergies.map((allergy, index) => (
                          <span key={index} className="th-alert-tag allergy">
                            <FaAllergies className="th-tag-icon" />
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {mockMedicalData.overview.chronic_conditions.length > 0 && (
                    <div className="th-alert-section">
                      <span className="th-alert-label">Chronic Conditions</span>
                      <div className="th-alert-tags">
                        {mockMedicalData.overview.chronic_conditions.map((condition, index) => (
                          <span key={index} className="th-alert-tag condition">
                            <FaPills className="th-tag-icon" />
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mockMedicalData.overview.genotype === 'AS' && (
                    <div className="th-alert-section">
                      <span className="th-alert-label">Genotype Considerations</span>
                      <div className="th-genotype-alert">
                        <FaExclamationTriangle className="th-alert-icon" />
                        <span className="th-alert-text">
                          Monitor for sickle cell crisis symptoms. Ensure adequate hydration and avoid extreme temperatures.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="th-records-content">
            <div className="th-records-header">
              <h3 className="th-section-title">Medical Records & Visits</h3>
              <div className="th-records-actions">
                <Button variant="outline" size="sm" icon={FaDownload}>
                  Export Records
                </Button>
                <Button variant="outline" size="sm" icon={FaPrint}>
                  Print Summary
                </Button>
              </div>
            </div>

            <div className="th-records-list">
              {mockMedicalData.recent_records.map(record => (
                <div key={record.id} className="th-record-card">
                  <div className="th-record-header">
                    <div className="th-record-info">
                      <h4 className="th-record-title">{record.type}</h4>
                      <div className="th-record-meta">
                        <span className="th-record-date">
                          <FaCalendarAlt className="th-meta-icon" />
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="th-record-provider">
                          <FaUserMd className="th-meta-icon" />
                          {record.provider}
                        </span>
                      </div>
                    </div>
                    <div className="th-record-actions">
                      <button 
                        className="th-record-action-btn"
                        onClick={() => setSelectedRecord(record)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="th-record-action-btn"
                        onClick={() => setSelectedRecord(record)}
                        title="Edit Record"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                  
                  <div className="th-record-body">
                    <div className="th-record-item">
                      <span className="th-record-label">Facility:</span>
                      <span className="th-record-value">{record.facility}</span>
                    </div>
                    <div className="th-record-item">
                      <span className="th-record-label">Diagnosis:</span>
                      <span className="th-record-value">{record.diagnosis}</span>
                    </div>
                    <div className="th-record-item">
                      <span className="th-record-label">Treatment:</span>
                      <span className="th-record-value">{record.treatment}</span>
                    </div>
                    {record.notes && (
                      <div className="th-record-item">
                        <span className="th-record-label">Notes:</span>
                        <span className="th-record-value">{record.notes}</span>
                      </div>
                    )}
                    {record.follow_up && (
                      <div className="th-record-item">
                        <span className="th-record-label">Follow-up:</span>
                        <span className="th-record-value follow-up">
                          {format(new Date(record.follow_up), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vaccinations Tab */}
        {activeTab === 'vaccinations' && (
          <div className="th-vaccinations-content">
            <div className="th-vaccination-summary">
              <div className="th-vaccine-stats">
                <div className="th-vaccine-stat completed">
                  <span className="th-stat-number">
                    {mockMedicalData.vaccinations.filter(v => v.status === 'completed').length}
                  </span>
                  <span className="th-stat-label">Completed</span>
                </div>
                <div className="th-vaccine-stat due">
                  <span className="th-stat-number">
                    {mockMedicalData.vaccinations.filter(v => getVaccinationStatus(v) === 'due').length}
                  </span>
                  <span className="th-stat-label">Due</span>
                </div>
                <div className="th-vaccine-stat overdue">
                  <span className="th-stat-number">
                    {mockMedicalData.vaccinations.filter(v => getVaccinationStatus(v) === 'overdue').length}
                  </span>
                  <span className="th-stat-label">Overdue</span>
                </div>
              </div>
            </div>

            <div className="th-vaccination-list">
              {mockMedicalData.vaccinations.map((vaccination, index) => {
                const status = getVaccinationStatus(vaccination);
                const statusColor = getStatusColor(status);
                
                return (
                  <div key={index} className={`th-vaccination-card ${status}`}>
                    <div className="th-vaccine-header">
                      <div className="th-vaccine-info">
                        <h4 className="th-vaccine-name">{vaccination.vaccine}</h4>
                        <span className={`th-vaccine-status ${statusColor}`}>
                          {status === 'completed' && <FaCheckCircle className="th-status-icon" />}
                          {status === 'due' && <FaExclamationTriangle className="th-status-icon" />}
                          {status === 'overdue' && <FaTimes className="th-status-icon" />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="th-vaccine-details">
                      <div className="th-vaccine-dates">
                        <div className="th-vaccine-date">
                          <span className="th-date-label">Due Date:</span>
                          <span className="th-date-value">
                            {format(new Date(vaccination.due_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {vaccination.given_date && (
                          <div className="th-vaccine-date">
                            <span className="th-date-label">Given Date:</span>
                            <span className="th-date-value">
                              {format(new Date(vaccination.given_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="th-vaccine-facility">
                        <span className="th-facility-label">Facility:</span>
                        <span className="th-facility-value">{vaccination.facility}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
      </div>

      {/* Modals for adding/editing records */}
      {showAddRecord && (
        <AddMedicalRecordModal
          isOpen={showAddRecord}
          onClose={() => setShowAddRecord(false)}
          childId={childId}
          onRecordAdded={(newRecord) => {
            setMedicalRecords([...medicalRecords, newRecord]);
            setShowAddRecord(false);
          }}
        />
      )}

      {showVaccination && (
        <AddVaccinationModal
          isOpen={showVaccination}
          onClose={() => setShowVaccination(false)}
          childId={childId}
          onVaccinationAdded={(newVaccination) => {
            // Handle vaccination added
            setShowVaccination(false);
          }}
        />
      )}
    </div>
  );
};

export default MedicalHistory;
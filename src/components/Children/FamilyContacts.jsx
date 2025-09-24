// src/components/Children/FamilyContacts.jsx
import React, { useState, useMemo } from 'react';
import {
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHistory,
  FaComments,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUserTie,
  FaUserFriends,
  FaBirthdayCake,
  FaIdCard,
  FaShieldAlt,
  FaFileContract,
  FaPrint,
  FaDownload
} from 'react-icons/fa';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import Button from '../UI/Button/Button';
import { formatNigerianPhone } from '../../utils/helpers';
import './FamilyContacts.css';

const FamilyContacts = ({ childId }) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);

  // Mock family contacts data
  const mockFamilyData = {
    legal_guardian: {
      id: 1,
      name: 'Mrs. Kemi Adebayo',
      relationship: 'Legal Guardian',
      phone: '+234-803-123-4567',
      email: 'kemi.adebayo@email.com',
      address: '15 Victoria Island Road, Lagos, Nigeria',
      occupation: 'Social Worker',
      employer: 'Lagos State Ministry of Youth and Social Development',
      is_primary: true,
      authorization_level: 'full',
      background_check: 'completed',
      background_check_date: '2024-01-10',
      photo_url: null,
      notes: 'Primary legal guardian, authorized for all decisions',
      emergency_contact: true,
      court_appointed: true,
      appointment_date: '2024-01-15',
      court_case_number: 'FCH/2024/001'
    },
    family_members: [
      {
        id: 2,
        name: 'Mr. Tunde Adebayo',
        relationship: 'Guardian Spouse',
        phone: '+234-803-123-4568',
        email: 'tunde.adebayo@email.com',
        address: '15 Victoria Island Road, Lagos, Nigeria',
        occupation: 'Engineer',
        employer: 'Nigerian National Petroleum Corporation',
        is_primary: false,
        authorization_level: 'limited',
        background_check: 'completed',
        background_check_date: '2024-01-10',
        photo_url: null,
        notes: 'Supportive guardian, assists with care decisions',
        emergency_contact: true,
        relationship_to_child: 'Guardian family member'
      },
      {
        id: 3,
        name: 'Mrs. Folake Johnson',
        relationship: 'Aunt',
        phone: '+234-802-987-6543',
        email: 'folake.johnson@email.com',
        address: '25 Allen Avenue, Ikeja, Lagos, Nigeria',
        occupation: 'Teacher',
        employer: 'Government College Ikeja',
        is_primary: false,
        authorization_level: 'none',
        background_check: 'pending',
        background_check_date: null,
        photo_url: null,
        notes: 'Biological aunt, maintains regular contact',
        emergency_contact: false,
        relationship_to_child: 'Biological family member'
      },
      {
        id: 4,
        name: 'Master David Adebayo',
        relationship: 'Guardian Son',
        phone: null,
        email: null,
        address: '15 Victoria Island Road, Lagos, Nigeria',
        occupation: 'Student',
        employer: 'University of Lagos',
        is_primary: false,
        authorization_level: 'none',
        background_check: 'not_required',
        background_check_date: null,
        photo_url: null,
        notes: 'Guardian\'s son, positive sibling-like relationship',
        emergency_contact: false,
        relationship_to_child: 'Guardian family member',
        date_of_birth: '2002-08-15'
      }
    ],
    visit_history: [
      {
        id: 1,
        visitor_name: 'Mrs. Kemi Adebayo',
        visitor_id: 1,
        visit_date: '2024-06-20',
        visit_time: '14:00',
        duration_hours: 2,
        visit_type: 'regular',
        purpose: 'Weekly check-in and quality time',
        location: 'Tabitha Home - Family Room',
        supervised: false,
        supervisor: null,
        notes: 'Great visit, Sarah was excited to share her school achievements',
        child_mood_before: 'happy',
        child_mood_after: 'very_happy',
        activities: ['homework_help', 'storytelling', 'playground_time'],
        gifts_brought: 'New storybooks and school supplies',
        next_visit_scheduled: '2024-06-27',
        created_by: 'Mrs. Williams',
        approved_by: 'Director'
      },
      {
        id: 2,
        visitor_name: 'Mr. Tunde Adebayo & Mrs. Kemi Adebayo',
        visitor_id: 1,
        visit_date: '2024-06-15',
        visit_time: '10:00',
        duration_hours: 4,
        visit_type: 'family_outing',
        purpose: 'Family day out and bonding',
        location: 'Tarkwa Bay Beach, Lagos',
        supervised: true,
        supervisor: 'Mrs. Williams',
        notes: 'Wonderful family outing, Sarah enjoyed the beach and bonded well with both guardians',
        child_mood_before: 'excited',
        child_mood_after: 'very_happy',
        activities: ['beach_games', 'swimming', 'picnic_lunch', 'photography'],
        gifts_brought: 'New swimwear and beach toys',
        next_visit_scheduled: '2024-06-20',
        created_by: 'Mrs. Williams',
        approved_by: 'Director'
      },
      {
        id: 3,
        visitor_name: 'Mrs. Folake Johnson',
        visitor_id: 3,
        visit_date: '2024-06-10',
        visit_time: '15:30',
        duration_hours: 1.5,
        visit_type: 'family',
        purpose: 'Aunt visitation and cultural connection',
        location: 'Tabitha Home - Garden Area',
        supervised: true,
        supervisor: 'Mr. Okafor',
        notes: 'Good visit, aunt shared family stories and cultural traditions',
        child_mood_before: 'neutral',
        child_mood_after: 'happy',
        activities: ['storytelling', 'cultural_dance', 'family_photos'],
        gifts_brought: 'Traditional fabrics and family photographs',
        next_visit_scheduled: '2024-07-10',
        created_by: 'Mr. Okafor',
        approved_by: 'Social Worker'
      }
    ],
    communication_log: [
      {
        id: 1,
        contact_id: 1,
        contact_name: 'Mrs. Kemi Adebayo',
        date: '2024-06-22',
        time: '18:30',
        type: 'phone_call',
        duration: '25 minutes',
        initiated_by: 'guardian',
        purpose: 'Check on progress and discuss school performance',
        summary: 'Discussed Sarah\'s improvement in mathematics and upcoming school project',
        staff_member: 'Mrs. Williams',
        outcome: 'positive',
        follow_up_required: false,
        notes: 'Guardian very pleased with progress, offered help with school project'
      },
      {
        id: 2,
        contact_id: 1,
        contact_name: 'Mrs. Kemi Adebayo',
        date: '2024-06-18',
        time: '20:00',
        type: 'video_call',
        duration: '15 minutes',
        initiated_by: 'child',
        purpose: 'Daily goodnight call',
        summary: 'Sarah shared her day activities and said goodnight prayers',
        staff_member: 'Night Supervisor',
        outcome: 'positive',
        follow_up_required: false,
        notes: 'Regular bedtime routine call, very comforting for Sarah'
      }
    ]
  };

  // Get authorization level color
  const getAuthorizationColor = (level) => {
    switch (level) {
      case 'full': return 'success';
      case 'limited': return 'warning';
      case 'none': return 'default';
      default: return 'default';
    }
  };

  // Get background check status color
  const getBackgroundCheckColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'not_required': return 'info';
      default: return 'default';
    }
  };

  // Get mood color
  const getMoodColor = (mood) => {
    switch (mood) {
      case 'very_happy': return 'success';
      case 'happy': return 'success';
      case 'neutral': return 'warning';
      case 'sad': return 'error';
      case 'very_sad': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="th-family-contacts">
      {/* Header */}
      <div className="th-family-header">
        <div className="th-header-info">
          <h3 className="th-section-title">
            <FaUsers className="th-section-icon" />
            Family & Contacts
          </h3>
          <p className="th-section-subtitle">
            Manage family relationships, visits, and communication
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={<FaCalendarAlt />}
            onClick={() => setShowAddVisit(true)}
          >
            Schedule Visit
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FaPlus />}
            onClick={() => setShowAddContact(true)}
          >
            Add Contact
          </Button>
          <Button variant="outline" size="sm" icon={<FaPrint />}>
            Print Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="th-family-tabs">
        <button
          className={`th-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <FaUsers className="th-tab-icon" />
          Contacts & Guardians
        </button>
        <button
          className={`th-tab-btn ${activeTab === 'visits' ? 'active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          <FaCalendarAlt className="th-tab-icon" />
          Visit History
        </button>
        <button
          className={`th-tab-btn ${activeTab === 'communication' ? 'active' : ''}`}
          onClick={() => setActiveTab('communication')}
        >
          <FaComments className="th-tab-icon" />
          Communication Log
        </button>
      </div>

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="th-contacts-content">
          {/* Legal Guardian Card */}
          <div className="th-guardian-section">
            <h4 className="th-subsection-title">
              <FaShieldAlt className="th-subsection-icon" />
              Legal Guardian
            </h4>
            
            <div className="th-contact-card primary">
              <div className="th-contact-header">
                <div className="th-contact-avatar">
                  {mockFamilyData.legal_guardian.photo_url ? (
                    <img 
                      src={mockFamilyData.legal_guardian.photo_url} 
                      alt={mockFamilyData.legal_guardian.name}
                      className="th-avatar-image"
                    />
                  ) : (
                    <FaUserTie className="th-avatar-icon" />
                  )}
                </div>
                <div className="th-contact-info">
                  <h5 className="th-contact-name">{mockFamilyData.legal_guardian.name}</h5>
                  <span className="th-contact-relationship">
                    {mockFamilyData.legal_guardian.relationship}
                  </span>
                  <div className="th-contact-badges">
                    <span className="th-badge primary">Primary Guardian</span>
                    {mockFamilyData.legal_guardian.court_appointed && (
                      <span className="th-badge official">Court Appointed</span>
                    )}
                    <span className={`th-badge ${getAuthorizationColor(mockFamilyData.legal_guardian.authorization_level)}`}>
                      {mockFamilyData.legal_guardian.authorization_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Authorization
                    </span>
                  </div>
                </div>
                <div className="th-contact-actions">
                  <button className="th-contact-action-btn">
                    <FaPhone />
                  </button>
                  <button className="th-contact-action-btn">
                    <FaEnvelope />
                  </button>
                  <button className="th-contact-action-btn">
                    <FaEdit />
                  </button>
                  <button className="th-contact-action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>

              <div className="th-contact-body">
                <div className="th-contact-details">
                  <div className="th-detail-item">
                    <FaPhone className="th-detail-icon" />
                    <span className="th-detail-label">Phone:</span>
                    <span className="th-detail-value">
                      {formatNigerianPhone(mockFamilyData.legal_guardian.phone)}
                    </span>
                  </div>
                  <div className="th-detail-item">
                    <FaEnvelope className="th-detail-icon" />
                    <span className="th-detail-label">Email:</span>
                    <span className="th-detail-value">{mockFamilyData.legal_guardian.email}</span>
                  </div>
                  <div className="th-detail-item">
                    <FaMapMarkerAlt className="th-detail-icon" />
                    <span className="th-detail-label">Address:</span>
                    <span className="th-detail-value">{mockFamilyData.legal_guardian.address}</span>
                  </div>
                  <div className="th-detail-item">
                    <FaUserTie className="th-detail-icon" />
                    <span className="th-detail-label">Occupation:</span>
                    <span className="th-detail-value">
                      {mockFamilyData.legal_guardian.occupation} at {mockFamilyData.legal_guardian.employer}
                    </span>
                  </div>
                  <div className="th-detail-item">
                    <FaFileContract className="th-detail-icon" />
                    <span className="th-detail-label">Court Case:</span>
                    <span className="th-detail-value">{mockFamilyData.legal_guardian.court_case_number}</span>
                  </div>
                  <div className="th-detail-item">
                    <FaCalendarAlt className="th-detail-icon" />
                    <span className="th-detail-label">Appointed:</span>
                    <span className="th-detail-value">
                      {format(parseISO(mockFamilyData.legal_guardian.appointment_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="th-background-check">
                  <div className="th-check-status">
                    <span className={`th-status-badge ${getBackgroundCheckColor(mockFamilyData.legal_guardian.background_check)}`}>
                      <FaCheckCircle className="th-status-icon" />
                      Background Check: {mockFamilyData.legal_guardian.background_check.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="th-check-date">
                      Completed: {format(parseISO(mockFamilyData.legal_guardian.background_check_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {mockFamilyData.legal_guardian.notes && (
                  <div className="th-contact-notes">
                    <h6 className="th-notes-title">Notes:</h6>
                    <p className="th-notes-content">{mockFamilyData.legal_guardian.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div className="th-family-section">
            <h4 className="th-subsection-title">
              <FaUserFriends className="th-subsection-icon" />
              Family Members & Other Contacts
            </h4>

            <div className="th-family-grid">
              {mockFamilyData.family_members.map(member => (
                <div key={member.id} className="th-contact-card">
                  <div className="th-contact-header">
                    <div className="th-contact-avatar">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="th-avatar-image"
                        />
                      ) : (
                        <FaUsers className="th-avatar-icon" />
                      )}
                    </div>
                    <div className="th-contact-info">
                      <h5 className="th-contact-name">{member.name}</h5>
                      <span className="th-contact-relationship">{member.relationship}</span>
                      <div className="th-contact-badges">
                        <span className={`th-badge ${getAuthorizationColor(member.authorization_level)}`}>
                          {member.authorization_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Auth
                        </span>
                        {member.emergency_contact && (
                          <span className="th-badge emergency">Emergency Contact</span>
                        )}
                      </div>
                    </div>
                    <div className="th-contact-actions">
                      {member.phone && (
                        <button className="th-contact-action-btn">
                          <FaPhone />
                        </button>
                      )}
                      {member.email && (
                        <button className="th-contact-action-btn">
                          <FaEnvelope />
                        </button>
                      )}
                      <button className="th-contact-action-btn">
                        <FaEdit />
                      </button>
                    </div>
                  </div>

                  <div className="th-contact-body">
                    <div className="th-contact-details">
                      {member.phone && (
                        <div className="th-detail-item">
                          <FaPhone className="th-detail-icon" />
                          <span className="th-detail-value">{formatNigerianPhone(member.phone)}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="th-detail-item">
                          <FaEnvelope className="th-detail-icon" />
                          <span className="th-detail-value">{member.email}</span>
                        </div>
                      )}
                      <div className="th-detail-item">
                        <FaUserTie className="th-detail-icon" />
                        <span className="th-detail-value">{member.occupation}</span>
                      </div>
                      {member.date_of_birth && (
                        <div className="th-detail-item">
                          <FaBirthdayCake className="th-detail-icon" />
                          <span className="th-detail-value">
                            Born {format(parseISO(member.date_of_birth), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="th-background-check">
                      <span className={`th-status-badge ${getBackgroundCheckColor(member.background_check)}`}>
                        <FaShieldAlt className="th-status-icon" />
                        {member.background_check.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>

                    {member.notes && (
                      <div className="th-contact-notes">
                        <p className="th-notes-content">{member.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div className="th-visits-content">
          <div className="th-visits-header">
            <h4 className="th-subsection-title">Visit History & Schedule</h4>
            <div className="th-visits-stats">
              <div className="th-visit-stat">
                <span className="th-stat-number">{mockFamilyData.visit_history.length}</span>
                <span className="th-stat-label">Total Visits</span>
              </div>
              <div className="th-visit-stat">
                <span className="th-stat-number">2</span>
                <span className="th-stat-label">This Month</span>
              </div>
              <div className="th-visit-stat">
                <span className="th-stat-number">4.5</span>
                <span className="th-stat-label">Avg Hours</span>
              </div>
            </div>
          </div>

          <div className="th-visits-list">
            {mockFamilyData.visit_history.map(visit => (
              <div key={visit.id} className="th-visit-card">
                <div className="th-visit-header">
                  <div className="th-visit-info">
                    <h5 className="th-visit-title">{visit.visitor_name}</h5>
                    <div className="th-visit-meta">
                      <span className="th-visit-date">
                        <FaCalendarAlt className="th-meta-icon" />
                        {format(parseISO(visit.visit_date), 'EEEE, MMM dd, yyyy')}
                      </span>
                      <span className="th-visit-time">
                        <FaClock className="th-meta-icon" />
                        {visit.visit_time} - {visit.duration_hours}h
                      </span>
                      <span className="th-visit-location">
                        <FaMapMarkerAlt className="th-meta-icon" />
                        {visit.location}
                      </span>
                    </div>
                  </div>
                  <div className="th-visit-badges">
                    <span className={`th-badge ${visit.visit_type === 'family_outing' ? 'success' : 'primary'}`}>
                      {visit.visit_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {visit.supervised && (
                      <span className="th-badge warning">Supervised</span>
                    )}
                  </div>
                </div>

                <div className="th-visit-body">
                  <div className="th-visit-purpose">
                    <h6 className="th-purpose-title">Purpose:</h6>
                    <p className="th-purpose-text">{visit.purpose}</p>
                  </div>

                  <div className="th-mood-tracking">
                    <div className="th-mood-item">
                      <span className="th-mood-label">Mood Before:</span>
                      <span className={`th-mood-badge ${getMoodColor(visit.child_mood_before)}`}>
                        {visit.child_mood_before.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="th-mood-item">
                      <span className="th-mood-label">Mood After:</span>
                      <span className={`th-mood-badge ${getMoodColor(visit.child_mood_after)}`}>
                        {visit.child_mood_after.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>

                  <div className="th-visit-activities">
                    <h6 className="th-activities-title">Activities:</h6>
                    <div className="th-activities-list">
                      {visit.activities.map((activity, index) => (
                        <span key={index} className="th-activity-tag">
                          {activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>

                  {visit.gifts_brought && (
                    <div className="th-visit-gifts">
                      <h6 className="th-gifts-title">Gifts Brought:</h6>
                      <p className="th-gifts-text">{visit.gifts_brought}</p>
                    </div>
                  )}

                  <div className="th-visit-notes">
                    <h6 className="th-notes-title">Visit Notes:</h6>
                    <p className="th-notes-text">{visit.notes}</p>
                  </div>

                  <div className="th-visit-footer">
                    <div className="th-visit-staff">
                      <span className="th-staff-label">Recorded by:</span>
                      <span className="th-staff-name">{visit.created_by}</span>
                      {visit.supervisor && (
                        <>
                          <span className="th-staff-separator">•</span>
                          <span className="th-supervisor-label">Supervised by:</span>
                          <span className="th-supervisor-name">{visit.supervisor}</span>
                        </>
                      )}
                    </div>
                    {visit.next_visit_scheduled && (
                      <div className="th-next-visit">
                        <FaCalendarAlt className="th-next-icon" />
                        <span>Next visit: {format(parseISO(visit.next_visit_scheduled), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Tab */}
      {activeTab === 'communication' && (
        <div className="th-communication-content">
          <div className="th-communication-header">
            <h4 className="th-subsection-title">Communication Log</h4>
            <div className="th-communication-stats">
              <div className="th-comm-stat">
                <span className="th-stat-number">{mockFamilyData.communication_log.length}</span>
                <span className="th-stat-label">Total Communications</span>
              </div>
              <div className="th-comm-stat">
                <span className="th-stat-number">5</span>
                <span className="th-stat-label">This Week</span>
              </div>
            </div>
          </div>

          <div className="th-communication-list">
            {mockFamilyData.communication_log.map(comm => (
              <div key={comm.id} className="th-communication-card">
                <div className="th-comm-header">
                  <div className="th-comm-type-icon">
                    {comm.type === 'phone_call' && <FaPhone />}
                    {comm.type === 'video_call' && <FaEye />}
                    {comm.type === 'email' && <FaEnvelope />}
                  </div>
                  <div className="th-comm-info">
                    <h5 className="th-comm-title">
                      {comm.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} with {comm.contact_name}
                    </h5>
                    <div className="th-comm-meta">
                      <span className="th-comm-date">
                        {format(parseISO(comm.date), 'MMM dd, yyyy')} at {comm.time}
                      </span>
                      <span className="th-comm-duration">Duration: {comm.duration}</span>
                      <span className="th-comm-staff">Staff: {comm.staff_member}</span>
                    </div>
                  </div>
                  <div className="th-comm-badges">
                    <span className={`th-badge ${comm.outcome === 'positive' ? 'success' : comm.outcome === 'negative' ? 'error' : 'warning'}`}>
                      {comm.outcome.replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="th-badge info">
                      {comm.initiated_by.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Initiated
                    </span>
                  </div>
                </div>

                <div className="th-comm-body">
                  <div className="th-comm-purpose">
                    <h6 className="th-purpose-title">Purpose:</h6>
                    <p className="th-purpose-text">{comm.purpose}</p>
                  </div>

                  <div className="th-comm-summary">
                    <h6 className="th-summary-title">Summary:</h6>
                    <p className="th-summary-text">{comm.summary}</p>
                  </div>

                  {comm.notes && (
                    <div className="th-comm-notes">
                      <h6 className="th-notes-title">Additional Notes:</h6>
                      <p className="th-notes-text">{comm.notes}</p>
                    </div>
                  )}

                  {comm.follow_up_required && (
                    <div className="th-follow-up">
                      <FaExclamationTriangle className="th-follow-up-icon" />
                      <span className="th-follow-up-text">Follow-up required</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyContacts;
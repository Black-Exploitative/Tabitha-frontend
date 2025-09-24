// src/components/Children/EducationProgress.jsx
import React, { useState } from 'react';
import { 
  FaGraduationCap,
  FaBook,
  FaArrowUp,
  FaTrophy,
  FaStar,
  FaPlus,
  FaEdit,
  FaEye,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaSchool,
  FaUserTie,
  FaBullseye,
  FaAward,
  FaBookOpen,
  FaPencilAlt,
  FaCalculator,
  FaGlobe,
  FaFlask,
  FaPalette,
  FaMusic,
  FaRunning,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import { format, differenceInDays, parseISO } from 'date-fns';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import { NIGERIAN_EDUCATION_LEVELS, SUBJECT_CATEGORIES, GRADING_SYSTEM } from '../../utils/nigerianEducationData';
import './EducationProgress.css';

const EducationProgress = ({ childId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('current');

  // Mock education data - replace with API calls
  const mockEducationData = {
    overview: {
      current_level: 'Primary 5',
      school_name: 'St. Mary\'s Primary School',
      school_type: 'Public',
      admission_number: 'SMP/2023/0045',
      class_teacher: 'Mrs. Adunni Okafor',
      current_term: '2nd Term',
      academic_year: '2023/2024',
      position_in_class: 5,
      total_students: 28,
      overall_percentage: 78.5,
      grade: 'B+',
      attendance_rate: 94.2,
      behavior_score: 'Good',
      next_promotion: 'Primary 6',
      career_ambition: 'Medical Doctor',
      special_needs: null,
      academic_status: 'On Track'
    },
    current_subjects: [
      {
        id: 1,
        subject: 'English Language',
        category: 'Core',
        teacher: 'Mrs. Blessing Adebayo',
        current_score: 85,
        grade: 'A',
        position: 3,
        remarks: 'Excellent progress in reading comprehension',
        last_assessment: '2024-05-20',
        next_test: '2024-06-15'
      },
      {
        id: 2,
        subject: 'Mathematics',
        category: 'Core',
        teacher: 'Mr. Ibrahim Yusuf',
        current_score: 78,
        grade: 'B+',
        position: 8,
        remarks: 'Good improvement in problem solving',
        last_assessment: '2024-05-18',
        next_test: '2024-06-12'
      },
      {
        id: 3,
        subject: 'Basic Science',
        category: 'Core',
        teacher: 'Dr. Kemi Ogundimu',
        current_score: 82,
        grade: 'A-',
        position: 4,
        remarks: 'Shows strong interest in experiments',
        last_assessment: '2024-05-22',
        next_test: '2024-06-18'
      },
      {
        id: 4,
        subject: 'Social Studies',
        category: 'Core',
        teacher: 'Mr. Chidi Okafor',
        current_score: 75,
        grade: 'B',
        position: 12,
        remarks: 'Needs more focus on Nigerian history',
        last_assessment: '2024-05-19',
        next_test: '2024-06-14'
      },
      {
        id: 5,
        subject: 'Yoruba Language',
        category: 'Language',
        teacher: 'Mrs. Folake Adeyemi',
        current_score: 88,
        grade: 'A',
        position: 2,
        remarks: 'Native speaker advantage showing',
        last_assessment: '2024-05-21',
        next_test: '2024-06-16'
      },
      {
        id: 6,
        subject: 'Creative Arts',
        category: 'Vocational',
        teacher: 'Miss Sandra Okwu',
        current_score: 92,
        grade: 'A+',
        position: 1,
        remarks: 'Exceptional artistic talent',
        last_assessment: '2024-05-17',
        next_test: '2024-06-13'
      }
    ],
    academic_history: [
      {
        term: '1st Term 2023/2024',
        level: 'Primary 5',
        total_score: 456,
        average: 76.0,
        grade: 'B+',
        position: 6,
        total_students: 28,
        remarks: 'Good performance overall',
        promoted: true
      },
      {
        term: '3rd Term 2022/2023',
        level: 'Primary 4',
        total_score: 445,
        average: 74.2,
        grade: 'B',
        position: 8,
        total_students: 25,
        remarks: 'Steady improvement noted',
        promoted: true
      }
    ],
    goals_and_targets: [
      {
        id: 1,
        goal: 'Improve Mathematics score to 85%',
        target_date: '2024-07-15',
        current_progress: 78,
        target_score: 85,
        status: 'in_progress',
        strategies: ['Extra practice sessions', 'One-on-one tutoring'],
        created_date: '2024-04-01'
      },
      {
        id: 2,
        goal: 'Achieve top 3 position in class',
        target_date: '2024-07-30',
        current_progress: 5,
        target_score: 3,
        status: 'in_progress',
        strategies: ['Study group participation', 'Regular homework submission'],
        created_date: '2024-03-15'
      },
      {
        id: 3,
        goal: 'Perfect attendance for the term',
        target_date: '2024-07-30',
        current_progress: 94.2,
        target_score: 100,
        status: 'at_risk',
        strategies: ['Health monitoring', 'Early sleep schedule'],
        created_date: '2024-02-01'
      }
    ],
    extracurricular: [
      {
        activity: 'Art Club',
        role: 'Member',
        performance: 'Excellent',
        awards: ['Best Drawing 2023'],
        teacher: 'Miss Sandra Okwu'
      },
      {
        activity: 'School Choir',
        role: 'Lead Singer',
        performance: 'Very Good',
        awards: ['Inter-school Competition 2nd Place'],
        teacher: 'Mr. Paul Adeyemi'
      },
      {
        activity: 'Mathematics Club',
        role: 'Member',
        performance: 'Good',
        awards: [],
        teacher: 'Mr. Ibrahim Yusuf'
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaGraduationCap },
    { id: 'subjects', label: 'Current Subjects', icon: FaBook },
    { id: 'progress', label: 'Academic Progress', icon: FaArrowUp },
    { id: 'goals', label: 'Goals & Targets', icon: FaBullseye },
    { id: 'extracurricular', label: 'Activities', icon: FaUsers },
    { id: 'reports', label: 'Report Cards', icon: FaAward }
  ];

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'English Language': FaBookOpen,
      'Mathematics': FaCalculator,
      'Basic Science': FaFlask,
      'Social Studies': FaGlobe,
      'Yoruba Language': FaBook,
      'Creative Arts': FaPalette,
      'Music': FaMusic,
      'Physical Education': FaRunning,
      'Computer Studies': FaBook,
      'French': FaBook,
      'Arabic': FaBook,
      'Home Economics': FaBook,
      'Agricultural Science': FaBook
    };
    return iconMap[subject] || FaBook;
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'grade-a-plus',
      'A': 'grade-a',
      'A-': 'grade-a-minus',
      'B+': 'grade-b-plus',
      'B': 'grade-b',
      'B-': 'grade-b-minus',
      'C+': 'grade-c-plus',
      'C': 'grade-c',
      'C-': 'grade-c-minus',
      'D': 'grade-d',
      'F': 'grade-f'
    };
    return gradeColors[grade] || 'grade-default';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'completed': 'success',
      'in_progress': 'primary',
      'at_risk': 'warning',
      'overdue': 'error',
      'on_track': 'success'
    };
    return statusColors[status] || 'muted';
  };

  const calculateProgressPercentage = (current, target) => {
    if (typeof current === 'number' && typeof target === 'number') {
      return Math.min((current / target) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="th-education-progress">
      <div className="th-education-header">
        <div className="th-header-content">
          <h2 className="th-education-title">
            <FaGraduationCap className="th-title-icon" />
            Education & Academic Progress
          </h2>
          <p className="th-education-subtitle">
            Comprehensive academic tracking and performance analysis
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddGoal(true)}
            icon={FaBullseye}
          >
            Add Goal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddGrade(true)}
            icon={FaPlus}
          >
            Add Grade
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="th-education-tabs">
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
      <div className="th-education-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="th-overview-content">
            <div className="th-overview-grid">
              {/* Academic Summary */}
              <div className="th-academic-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaSchool className="th-card-icon" />
                    Current Academic Status
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-academic-info">
                    <div className="th-info-row">
                      <span className="th-info-label">School</span>
                      <span className="th-info-value">{mockEducationData.overview.school_name}</span>
                    </div>
                    <div className="th-info-row">
                      <span className="th-info-label">Class Level</span>
                      <span className="th-info-value current-level">
                        {mockEducationData.overview.current_level}
                      </span>
                    </div>
                    <div className="th-info-row">
                      <span className="th-info-label">Academic Year</span>
                      <span className="th-info-value">{mockEducationData.overview.academic_year}</span>
                    </div>
                    <div className="th-info-row">
                      <span className="th-info-label">Current Term</span>
                      <span className="th-info-value">{mockEducationData.overview.current_term}</span>
                    </div>
                    <div className="th-info-row">
                      <span className="th-info-label">Class Teacher</span>
                      <span className="th-info-value">{mockEducationData.overview.class_teacher}</span>
                    </div>
                    <div className="th-info-row">
                      <span className="th-info-label">Admission Number</span>
                      <span className="th-info-value">{mockEducationData.overview.admission_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="th-academic-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaArrowUp className="th-card-icon" />
                    Current Performance
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-performance-grid">
                    <div className="th-performance-item">
                      <div className="th-performance-metric">
                        <span className="th-metric-value">{mockEducationData.overview.overall_percentage}%</span>
                        <span className="th-metric-label">Overall Average</span>
                      </div>
                      <div className={`th-grade-badge ${getGradeColor(mockEducationData.overview.grade)}`}>
                        {mockEducationData.overview.grade}
                      </div>
                    </div>
                    
                    <div className="th-performance-item">
                      <div className="th-performance-metric">
                        <span className="th-metric-value">{mockEducationData.overview.position_in_class}</span>
                        <span className="th-metric-label">Position in Class</span>
                      </div>
                      <span className="th-class-size">of {mockEducationData.overview.total_students}</span>
                    </div>
                    
                    <div className="th-performance-item">
                      <div className="th-performance-metric">
                        <span className="th-metric-value">{mockEducationData.overview.attendance_rate}%</span>
                        <span className="th-metric-label">Attendance Rate</span>
                      </div>
                      <div className="th-attendance-indicator good">
                        <FaCheckCircle className="th-indicator-icon" />
                      </div>
                    </div>
                    
                    <div className="th-performance-item">
                      <div className="th-performance-metric">
                        <span className="th-metric-value">{mockEducationData.overview.behavior_score}</span>
                        <span className="th-metric-label">Behavior</span>
                      </div>
                      <div className="th-behavior-indicator good">
                        <FaCheckCircle className="th-indicator-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career & Aspirations */}
              <div className="th-academic-card">
                <div className="th-card-header">
                  <h3 className="th-card-title">
                    <FaTrophy className="th-card-icon" />
                    Career Aspirations & Goals
                  </h3>
                </div>
                <div className="th-card-body">
                  <div className="th-career-info">
                    <div className="th-ambition-section">
                      <span className="th-section-label">Career Ambition</span>
                      <div className="th-ambition-display">
                        <FaUserTie className="th-ambition-icon" />
                        <span className="th-ambition-text">{mockEducationData.overview.career_ambition}</span>
                      </div>
                    </div>
                    
                    <div className="th-pathway-section">
                      <span className="th-section-label">Educational Pathway</span>
                      <div className="th-pathway-steps">
                        <div className="th-pathway-step current">
                          <span className="th-step-label">Current</span>
                          <span className="th-step-value">{mockEducationData.overview.current_level}</span>
                        </div>
                        <div className="th-pathway-arrow">→</div>
                        <div className="th-pathway-step next">
                          <span className="th-step-label">Next</span>
                          <span className="th-step-value">{mockEducationData.overview.next_promotion}</span>
                        </div>
                        <div className="th-pathway-arrow">→</div>
                        <div className="th-pathway-step future">
                          <span className="th-step-label">Target</span>
                          <span className="th-step-value">University</span>
                        </div>
                      </div>
                    </div>

                    <div className="th-status-section">
                      <span className="th-section-label">Academic Status</span>
                      <div className={`th-status-indicator ${mockEducationData.overview.academic_status.toLowerCase().replace(' ', '-')}`}>
                        <FaCheckCircle className="th-status-icon" />
                        <span className="th-status-text">{mockEducationData.overview.academic_status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="th-subjects-content">
            <div className="th-subjects-header">
              <h3 className="th-section-title">Current Subjects - {mockEducationData.overview.current_term}</h3>
              <div className="th-subjects-stats">
                <div className="th-stat-item">
                  <span className="th-stat-number">{mockEducationData.current_subjects.length}</span>
                  <span className="th-stat-label">Subjects</span>
                </div>
                <div className="th-stat-item">
                  <span className="th-stat-number">{mockEducationData.overview.overall_percentage}%</span>
                  <span className="th-stat-label">Average</span>
                </div>
              </div>
            </div>

            <div className="th-subjects-grid">
              {mockEducationData.current_subjects.map(subject => {
                const SubjectIcon = getSubjectIcon(subject.subject);
                const gradeColor = getGradeColor(subject.grade);
                
                return (
                  <div key={subject.id} className="th-subject-card">
                    <div className="th-subject-header">
                      <div className="th-subject-info">
                        <div className="th-subject-icon-wrapper">
                          <SubjectIcon className="th-subject-icon" />
                        </div>
                        <div className="th-subject-details">
                          <h4 className="th-subject-name">{subject.subject}</h4>
                          <span className="th-subject-category">{subject.category}</span>
                          <span className="th-subject-teacher">{subject.teacher}</span>
                        </div>
                      </div>
                      <div className={`th-grade-display ${gradeColor}`}>
                        <span className="th-grade-text">{subject.grade}</span>
                        <span className="th-score-text">{subject.current_score}%</span>
                      </div>
                    </div>
                    
                    <div className="th-subject-body">
                      <div className="th-subject-metrics">
                        <div className="th-metric-item">
                          <span className="th-metric-label">Position</span>
                          <span className="th-metric-value">#{subject.position}</span>
                        </div>
                        <div className="th-metric-item">
                          <span className="th-metric-label">Last Test</span>
                          <span className="th-metric-value">
                            {format(new Date(subject.last_assessment), 'MMM dd')}
                          </span>
                        </div>
                        <div className="th-metric-item">
                          <span className="th-metric-label">Next Test</span>
                          <span className="th-metric-value upcoming">
                            {format(new Date(subject.next_test), 'MMM dd')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="th-subject-remarks">
                        <span className="th-remarks-label">Teacher's Remarks:</span>
                        <p className="th-remarks-text">{subject.remarks}</p>
                      </div>
                    </div>
                    
                    <div className="th-subject-actions">
                      <button
                        className="th-subject-action-btn"
                        onClick={() => setSelectedSubject(subject)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="th-subject-action-btn"
                        onClick={() => setSelectedSubject(subject)}
                        title="Add Grade"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Goals & Targets Tab */}
        {activeTab === 'goals' && (
          <div className="th-goals-content">
            <div className="th-goals-header">
              <h3 className="th-section-title">Academic Goals & Targets</h3>
              <div className="th-goals-summary">
                <div className="th-summary-item">
                  <span className="th-summary-number">
                    {mockEducationData.goals_and_targets.filter(g => g.status === 'completed').length}
                  </span>
                  <span className="th-summary-label">Completed</span>
                </div>
                <div className="th-summary-item">
                  <span className="th-summary-number">
                    {mockEducationData.goals_and_targets.filter(g => g.status === 'in_progress').length}
                  </span>
                  <span className="th-summary-label">In Progress</span>
                </div>
                <div className="th-summary-item">
                  <span className="th-summary-number">
                    {mockEducationData.goals_and_targets.filter(g => g.status === 'at_risk').length}
                  </span>
                  <span className="th-summary-label">At Risk</span>
                </div>
              </div>
            </div>

            <div className="th-goals-list">
              {mockEducationData.goals_and_targets.map(goal => {
                const statusColor = getStatusColor(goal.status);
                const progressPercentage = calculateProgressPercentage(goal.current_progress, goal.target_score);
                const daysRemaining = differenceInDays(new Date(goal.target_date), new Date());
                
                return (
                  <div key={goal.id} className={`th-goal-card ${statusColor}`}>
                    <div className="th-goal-header">
                      <div className="th-goal-info">
                        <h4 className="th-goal-title">{goal.goal}</h4>
                        <div className="th-goal-meta">
                          <span className="th-goal-created">
                            <FaCalendarAlt className="th-meta-icon" />
                            Created: {format(new Date(goal.created_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="th-goal-deadline">
                            <FaClock className="th-meta-icon" />
                            Due: {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className={`th-goal-status ${statusColor}`}>
                        {goal.status === 'completed' && <FaCheckCircle className="th-status-icon" />}
                        {goal.status === 'in_progress' && <FaClock className="th-status-icon" />}
                        {goal.status === 'at_risk' && <FaExclamationTriangle className="th-status-icon" />}
                        {goal.status === 'overdue' && <FaTimesCircle className="th-status-icon" />}
                        <span className="th-status-text">
                          {goal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    
                    <div className="th-goal-body">
                      <div className="th-goal-progress">
                        <div className="th-progress-header">
                          <span className="th-progress-label">Progress</span>
                          <span className="th-progress-text">
                            {goal.current_progress} / {goal.target_score}
                          </span>
                        </div>
                        <div className="th-progress-bar">
                          <div 
                            className={`th-progress-fill ${statusColor}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="th-progress-details">
                          <span className="th-progress-percentage">{progressPercentage.toFixed(1)}%</span>
                          <span className={`th-days-remaining ${daysRemaining < 7 ? 'urgent' : ''}`}>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="th-goal-strategies">
                        <span className="th-strategies-label">Strategies:</span>
                        <div className="th-strategies-list">
                          {goal.strategies.map((strategy, index) => (
                            <span key={index} className="th-strategy-tag">
                              {strategy}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Extracurricular Tab */}
        {activeTab === 'extracurricular' && (
          <div className="th-activities-content">
            <div className="th-activities-header">
              <h3 className="th-section-title">Extracurricular Activities</h3>
              <p className="th-activities-subtitle">
                Developing talents and social skills beyond academics
              </p>
            </div>

            <div className="th-activities-grid">
              {mockEducationData.extracurricular.map((activity, index) => (
                <div key={index} className="th-activity-card">
                  <div className="th-activity-header">
                    <div className="th-activity-icon">
                      <FaUsers />
                    </div>
                    <div className="th-activity-info">
                      <h4 className="th-activity-name">{activity.activity}</h4>
                      <span className="th-activity-role">{activity.role}</span>
                      <span className="th-activity-teacher">Supervisor: {activity.teacher}</span>
                    </div>
                  </div>
                  
                  <div className="th-activity-body">
                    <div className="th-performance-badge">
                      <span className={`th-performance-level ${activity.performance.toLowerCase().replace(' ', '-')}`}>
                        {activity.performance}
                      </span>
                    </div>
                    
                    {activity.awards.length > 0 && (
                      <div className="th-awards-section">
                        <span className="th-awards-label">Awards & Recognition:</span>
                        <div className="th-awards-list">
                          {activity.awards.map((award, awardIndex) => (
                            <div key={awardIndex} className="th-award-item">
                              <FaAward className="th-award-icon" />
                              <span className="th-award-text">{award}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationProgress;
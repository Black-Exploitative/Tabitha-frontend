// src/components/Children/CaseNotes.jsx
import React, { useState, useMemo } from 'react';
import {
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaTags,
  FaLightbulb,
  FaHeart,
  FaGraduationCap,
  FaUserMd,
  FaHome,
  FaComments,
  FaPrint,
  FaDownload,
  FaStar,
  FaArrowUp,
  FaShieldAlt,
  FaArrowDown,
  FaMinus
} from 'react-icons/fa';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import Button from '../UI/Button/Button';
import './CaseNotes.css';

const CaseNotes = ({ childId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'category'

  // Mock case notes data
  const mockCaseNotes = [
    {
      id: 1,
      title: 'Behavioral Assessment - Positive Social Interaction',
      category: 'behavioral',
      priority: 'medium',
      date: '2024-06-20',
      time: '14:30',
      author: 'Dr. Adebayo Johnson',
      author_role: 'Child Psychologist',
      content: 'Sarah has shown remarkable improvement in social interactions with peers. During today\'s group activity, she voluntarily helped younger children with their art project and demonstrated excellent leadership qualities. She was patient, encouraging, and showed empathy when one child became frustrated.',
      observations: [
        'Initiated conversation with 3 different children',
        'Helped resolve a minor conflict between two peers',
        'Showed patience when teaching younger child how to draw',
        'Displayed positive body language throughout activity'
      ],
      action_items: [
        'Continue encouraging leadership opportunities',
        'Assign Sarah as peer mentor for new admissions',
        'Document leadership activities for progress tracking'
      ],
      mood_rating: 4, // 1-5 scale
      behavior_indicators: ['helpful', 'patient', 'leadership', 'empathetic'],
      tags: ['social_skills', 'leadership', 'peer_interaction', 'positive_behavior'],
      follow_up_date: '2024-07-05',
      follow_up_required: true,
      confidentiality: 'internal',
      attachments: [],
      related_goals: ['improve_social_skills', 'develop_leadership'],
      intervention_type: 'observation',
      outcome: 'positive'
    },
    {
      id: 2,
      title: 'Academic Progress Review - Mathematics Improvement',
      category: 'education',
      priority: 'high',
      date: '2024-06-18',
      time: '10:00',
      author: 'Mrs. Folake Okafor',
      author_role: 'Education Coordinator',
      content: 'Significant improvement observed in Sarah\'s mathematics performance. She has moved from struggling with basic addition to confidently solving two-digit multiplication problems. Her teacher reports increased participation in math class and willingness to attempt challenging problems.',
      observations: [
        'Completed 95% of homework assignments this week',
        'Scored 85% on recent mathematics test (up from 45%)',
        'Actively participates in math discussions',
        'Helps classmates understand concepts'
      ],
      action_items: [
        'Enroll in advanced mathematics tutoring program',
        'Discuss potential for grade acceleration with school',
        'Provide additional challenging math materials'
      ],
      mood_rating: 5,
      behavior_indicators: ['confident', 'engaged', 'persistent', 'proud'],
      tags: ['academic_progress', 'mathematics', 'tutoring', 'achievement'],
      follow_up_date: '2024-07-02',
      follow_up_required: true,
      confidentiality: 'standard',
      attachments: ['math_test_results.pdf', 'teacher_report.pdf'],
      related_goals: ['academic_excellence', 'mathematics_proficiency'],
      intervention_type: 'academic_support',
      outcome: 'very_positive'
    },
    {
      id: 3,
      title: 'Health Check - Minor Respiratory Symptoms',
      category: 'medical',
      priority: 'high',
      date: '2024-06-15',
      time: '09:15',
      author: 'Nurse Patricia Williams',
      author_role: 'Head Nurse',
      content: 'Sarah presented with mild cough and congestion this morning. Temperature normal (98.2°F). No fever or other concerning symptoms. Administered prescribed inhaler for asthma management. Symptoms appeared to improve within 30 minutes of treatment.',
      observations: [
        'Mild productive cough, clear sputum',
        'No wheezing detected on auscultation',
        'Normal oxygen saturation (99%)',
        'Child reported feeling "a little stuffy" but otherwise well'
      ],
      action_items: [
        'Monitor symptoms for next 24 hours',
        'Ensure proper hydration',
        'Continue regular asthma medication schedule',
        'Contact guardian if symptoms worsen'
      ],
      mood_rating: 3,
      behavior_indicators: ['cooperative', 'calm', 'communicative'],
      tags: ['health_monitoring', 'asthma', 'respiratory', 'medication'],
      follow_up_date: '2024-06-16',
      follow_up_required: true,
      confidentiality: 'medical',
      attachments: ['vital_signs_chart.pdf'],
      related_goals: ['maintain_good_health', 'asthma_management'],
      intervention_type: 'medical_care',
      outcome: 'stable'
    },
    {
      id: 4,
      title: 'Family Visit Preparation and Reflection',
      category: 'family',
      priority: 'medium',
      date: '2024-06-14',
      time: '16:45',
      author: 'Mrs. Blessing Okoro',
      author_role: 'Social Worker',
      content: 'Prepared Sarah for upcoming family outing to the beach. Discussed expectations, safety rules, and helped her choose appropriate items to pack. Post-visit reflection showed extremely positive experience with strong attachment to guardians.',
      observations: [
        'Excited and well-prepared for family outing',
        'Demonstrated understanding of safety rules',
        'Showed strong positive attachment to guardians',
        'Expressed gratitude and happiness about the experience'
      ],
      action_items: [
        'Schedule regular family outings',
        'Document attachment progress',
        'Encourage continued bonding activities'
      ],
      mood_rating: 5,
      behavior_indicators: ['excited', 'grateful', 'bonded', 'secure'],
      tags: ['family_bonding', 'attachment', 'outings', 'preparation'],
      follow_up_date: '2024-06-28',
      follow_up_required: false,
      confidentiality: 'standard',
      attachments: ['family_visit_photos.pdf'],
      related_goals: ['strengthen_family_bonds', 'attachment_security'],
      intervention_type: 'family_therapy',
      outcome: 'very_positive'
    },
    {
      id: 5,
      title: 'Incident Report - Minor Playground Disagreement',
      category: 'behavioral',
      priority: 'low',
      date: '2024-06-12',
      time: '15:20',
      author: 'Mr. Tunde Adeniyi',
      author_role: 'Playground Supervisor',
      content: 'Minor disagreement between Sarah and another child over playground equipment. Sarah initially became frustrated but quickly used conflict resolution skills learned in counseling sessions. Resolved situation independently without adult intervention.',
      observations: [
        'Initial frustration lasting approximately 2 minutes',
        'Used "I statements" to express feelings',
        'Suggested compromise solution (taking turns)',
        'Apologized for raised voice and made peace'
      ],
      action_items: [
        'Acknowledge positive conflict resolution',
        'Continue reinforcing these skills',
        'Share success with counseling team'
      ],
      mood_rating: 4,
      behavior_indicators: ['frustrated_initially', 'self_regulated', 'problem_solver', 'apologetic'],
      tags: ['conflict_resolution', 'self_regulation', 'peer_interaction', 'coping_skills'],
      follow_up_date: null,
      follow_up_required: false,
      confidentiality: 'standard',
      attachments: [],
      related_goals: ['improve_emotional_regulation', 'conflict_resolution_skills'],
      intervention_type: 'behavioral_observation',
      outcome: 'positive'
    }
  ];

  // Note categories
  const noteCategories = [
    { id: 'all', label: 'All Notes', icon: FaClipboardList, count: mockCaseNotes.length },
    { id: 'behavioral', label: 'Behavioral', icon: FaHeart, count: 2 },
    { id: 'education', label: 'Education', icon: FaGraduationCap, count: 1 },
    { id: 'medical', label: 'Medical', icon: FaUserMd, count: 1 },
    { id: 'family', label: 'Family', icon: FaHome, count: 1 },
    { id: 'development', label: 'Development', icon: FaLightbulb, count: 0 }
  ];

  // Priority levels
  const priorityLevels = [
    { id: 'all', label: 'All Priorities', color: 'default' },
    { id: 'low', label: 'Low Priority', color: 'success' },
    { id: 'medium', label: 'Medium Priority', color: 'warning' },
    { id: 'high', label: 'High Priority', color: 'error' }
  ];

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  // Get outcome color
  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'very_positive': return 'success';
      case 'positive': return 'success';
      case 'stable': return 'warning';
      case 'concerning': return 'error';
      case 'negative': return 'error';
      default: return 'default';
    }
  };

  // Get mood icon
  const getMoodIcon = (rating) => {
    if (rating >= 4) return <FaStar className="th-mood-icon positive" />;
    if (rating === 3) return <FaMinus className="th-mood-icon neutral" />;
    return <FaArrowDown className="th-mood-icon negative" />;
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    let filtered = mockCaseNotes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(note => note.priority === selectedPriority);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by timeframe
    if (selectedTimeframe !== 'all') {
      const now = new Date();
      filtered = filtered.filter(note => {
        const noteDate = parseISO(note.date);
        switch (selectedTimeframe) {
          case 'this_week':
            return isWithinInterval(noteDate, { start: startOfWeek(now), end: endOfWeek(now) });
          case 'this_month':
            return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
          case 'last_30_days':
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return noteDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  }, [selectedCategory, selectedPriority, searchQuery, selectedTimeframe]);

  return (
    <div className="th-case-notes">
      {/* Header */}
      <div className="th-notes-header">
        <div className="th-header-info">
          <h3 className="th-section-title">
            <FaClipboardList className="th-section-icon" />
            Case Notes & Progress Tracking
          </h3>
          <p className="th-section-subtitle">
            Comprehensive documentation of child's development and daily observations
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={<FaDownload />}
          >
            Export Notes
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FaPrint />}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FaPlus />}
            onClick={() => setShowAddNote(true)}
          >
            Add Note
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="th-notes-controls">
        <div className="th-search-section">
          <div className="th-search-wrapper">
            <FaSearch className="th-search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="th-search-input"
            />
          </div>
        </div>

        <div className="th-filter-section">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="th-filter-select"
          >
            {noteCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="th-filter-select"
          >
            {priorityLevels.map(priority => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>

          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="th-filter-select"
          >
            <option value="all">All Time</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_30_days">Last 30 Days</option>
          </select>
        </div>

        <div className="th-view-controls">
          <button
            className={`th-view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline View
          </button>
          <button
            className={`th-view-btn ${viewMode === 'category' ? 'active' : ''}`}
            onClick={() => setViewMode('category')}
          >
            Category View
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="th-notes-summary">
        <div className="th-summary-card">
          <div className="th-summary-icon">
            <FaClipboardList />
          </div>
          <div className="th-summary-info">
            <span className="th-summary-number">{filteredNotes.length}</span>
            <span className="th-summary-label">Total Notes</span>
          </div>
        </div>
        <div className="th-summary-card">
          <div className="th-summary-icon">
            <FaFlag />
          </div>
          <div className="th-summary-info">
            <span className="th-summary-number">
              {filteredNotes.filter(note => note.follow_up_required).length}
            </span>
            <span className="th-summary-label">Require Follow-up</span>
          </div>
        </div>
        <div className="th-summary-card">
          <div className="th-summary-icon">
            <FaStar />
          </div>
          <div className="th-summary-info">
            <span className="th-summary-number">
              {filteredNotes.filter(note => note.mood_rating >= 4).length}
            </span>
            <span className="th-summary-label">Positive Outcomes</span>
          </div>
        </div>
        <div className="th-summary-card">
          <div className="th-summary-icon">
            <FaCalendarAlt />
          </div>
          <div className="th-summary-info">
            <span className="th-summary-number">
              {filteredNotes.filter(note => note.date === new Date().toISOString().split('T')[0]).length || 'None'}
            </span>
            <span className="th-summary-label">Today's Notes</span>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="th-notes-list">
        {filteredNotes.map(note => {
          const categoryInfo = noteCategories.find(cat => cat.id === note.category);
          const CategoryIcon = categoryInfo?.icon || FaClipboardList;

          return (
            <div key={note.id} className="th-note-card">
              <div className="th-note-header">
                <div className="th-note-meta">
                  <div className="th-note-category">
                    <CategoryIcon className="th-category-icon" />
                    <span className="th-category-label">
                      {categoryInfo?.label || note.category}
                    </span>
                  </div>
                  <div className="th-note-date">
                    <FaCalendarAlt className="th-date-icon" />
                    <span>{format(parseISO(note.date), 'MMM dd, yyyy')} at {note.time}</span>
                  </div>
                  <div className="th-note-author">
                    <FaUser className="th-author-icon" />
                    <span>{note.author} - {note.author_role}</span>
                  </div>
                </div>
                <div className="th-note-badges">
                  <span className={`th-priority-badge ${getPriorityColor(note.priority)}`}>
                    <FaFlag className="th-priority-icon" />
                    {note.priority.replace(/\b\w/g, l => l.toUpperCase())} Priority
                  </span>
                  <span className={`th-outcome-badge ${getOutcomeColor(note.outcome)}`}>
                    {note.outcome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  {note.follow_up_required && (
                    <span className="th-followup-badge">
                      <FaClock className="th-followup-icon" />
                      Follow-up Required
                    </span>
                  )}
                </div>
              </div>

              <div className="th-note-body">
                <h4 className="th-note-title">{note.title}</h4>
                
                <div className="th-mood-rating">
                  {getMoodIcon(note.mood_rating)}
                  <span className="th-mood-text">
                    Mood Rating: {note.mood_rating}/5
                  </span>
                </div>

                <div className="th-note-content">
                  <p className="th-content-text">{note.content}</p>
                </div>

                {note.observations && note.observations.length > 0 && (
                  <div className="th-note-section">
                    <h5 className="th-section-title">
                      <FaEye className="th-section-icon" />
                      Key Observations
                    </h5>
                    <ul className="th-observations-list">
                      {note.observations.map((observation, index) => (
                        <li key={index} className="th-observation-item">
                          {observation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {note.action_items && note.action_items.length > 0 && (
                  <div className="th-note-section">
                    <h5 className="th-section-title">
                      <FaCheckCircle className="th-section-icon" />
                      Action Items
                    </h5>
                    <ul className="th-actions-list">
                      {note.action_items.map((action, index) => (
                        <li key={index} className="th-action-item">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="th-note-indicators">
                  <h5 className="th-section-title">
                    <FaHeart className="th-section-icon" />
                    Behavioral Indicators
                  </h5>
                  <div className="th-indicators-list">
                    {note.behavior_indicators.map((indicator, index) => (
                      <span key={index} className="th-indicator-tag">
                        {indicator.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="th-note-tags">
                  <h5 className="th-section-title">
                    <FaTags className="th-section-icon" />
                    Tags
                  </h5>
                  <div className="th-tags-list">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="th-note-tag">
                        {tag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>

                {note.follow_up_date && (
                  <div className="th-follow-up">
                    <FaCalendarAlt className="th-followup-icon" />
                    <span className="th-followup-text">
                      Follow-up scheduled for {format(parseISO(note.follow_up_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              <div className="th-note-footer">
                <div className="th-note-actions">
                  <button className="th-note-action-btn">
                    <FaEye />
                  </button>
                  <button className="th-note-action-btn">
                    <FaEdit />
                  </button>
                  <button className="th-note-action-btn">
                    <FaComments />
                  </button>
                  <button className="th-note-action-btn">
                    <FaDownload />
                  </button>
                </div>
                <div className="th-note-confidentiality">
                  <FaShieldAlt className="th-confidentiality-icon" />
                  <span className="th-confidentiality-text">
                    {note.confidentiality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="th-notes-empty">
          <div className="th-empty-icon">
            <FaClipboardList />
          </div>
          <h3 className="th-empty-title">No case notes found</h3>
          <p className="th-empty-description">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start documenting this child\'s progress by adding your first case note.'
            }
          </p>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={() => setShowAddNote(true)}
          >
            Add First Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseNotes;
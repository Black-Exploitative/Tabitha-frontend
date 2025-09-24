// src/components/Documents/DocumentsList.jsx
import React, { useState, useMemo } from 'react';
import {
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFile,
  FaPlus,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaUpload,
  FaFilter,
  FaSort,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaShieldAlt
} from 'react-icons/fa';
import { format, parseISO, isAfter, subMonths } from 'date-fns';
import Button from '../UI/Button/Button';
import FileUpload from '../Common/FileUpload';
import { formatFileSize } from '../../utils/helpers';
import './DocumentsList.css';

const DocumentsList = ({ childId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Mock documents data
  const mockDocuments = [
    {
      id: 1,
      name: 'Birth Certificate',
      category: 'legal',
      type: 'pdf',
      file_size: 2450000,
      uploaded_date: '2024-01-15',
      uploaded_by: 'Kemi Adebayo',
      description: 'Official birth certificate from Lagos State',
      status: 'verified',
      expiry_date: null,
      tags: ['official', 'identification', 'birth'],
      url: '/documents/birth_cert_001.pdf',
      is_required: true,
      confidentiality: 'restricted'
    },
    {
      id: 2,
      name: 'Medical Examination Report',
      category: 'medical',
      type: 'pdf',
      file_size: 1800000,
      uploaded_date: '2024-02-10',
      uploaded_by: 'Dr. Johnson',
      description: 'Comprehensive medical examination upon admission',
      status: 'verified',
      expiry_date: '2025-02-10',
      tags: ['medical', 'examination', 'admission'],
      url: '/documents/medical_exam_001.pdf',
      is_required: true,
      confidentiality: 'confidential'
    },
    {
      id: 3,
      name: 'School Enrollment Letter',
      category: 'education',
      type: 'pdf',
      file_size: 950000,
      uploaded_date: '2024-03-05',
      uploaded_by: 'Mrs. Okafor',
      description: 'Enrollment confirmation from St. Mary\'s Primary School',
      status: 'verified',
      expiry_date: '2024-12-31',
      tags: ['education', 'enrollment', 'school'],
      url: '/documents/school_enrollment_001.pdf',
      is_required: false,
      confidentiality: 'internal'
    },
    {
      id: 4,
      name: 'Guardian Consent Form',
      category: 'legal',
      type: 'pdf',
      file_size: 1200000,
      uploaded_date: '2024-01-20',
      uploaded_by: 'Kemi Adebayo',
      description: 'Legal guardian consent for care and treatment',
      status: 'verified',
      expiry_date: null,
      tags: ['legal', 'consent', 'guardian'],
      url: '/documents/guardian_consent_001.pdf',
      is_required: true,
      confidentiality: 'restricted'
    },
    {
      id: 5,
      name: 'Progress Photos - June 2024',
      category: 'photos',
      type: 'image',
      file_size: 3200000,
      uploaded_date: '2024-06-15',
      uploaded_by: 'Sarah Williams',
      description: 'Monthly progress and activity photos',
      status: 'approved',
      expiry_date: null,
      tags: ['progress', 'photos', 'activities'],
      url: '/documents/photos_june_2024.zip',
      is_required: false,
      confidentiality: 'internal'
    },
    {
      id: 6,
      name: 'Immunization Record',
      category: 'medical',
      type: 'pdf',
      file_size: 800000,
      uploaded_date: '2024-04-12',
      uploaded_by: 'Health Clinic',
      description: 'Complete immunization history and schedule',
      status: 'pending_review',
      expiry_date: '2025-04-12',
      tags: ['medical', 'immunization', 'vaccines'],
      url: '/documents/immunization_record_001.pdf',
      is_required: true,
      confidentiality: 'confidential'
    }
  ];

  // Document categories
  const documentCategories = [
    { id: 'all', label: 'All Documents', icon: FaFileAlt, count: mockDocuments.length },
    { id: 'legal', label: 'Legal Documents', icon: FaShieldAlt, count: 2 },
    { id: 'medical', label: 'Medical Records', icon: FaFilePdf, count: 2 },
    { id: 'education', label: 'Education', icon: FaFileWord, count: 1 },
    { id: 'photos', label: 'Photos & Media', icon: FaFileImage, count: 1 }
  ];

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return FaFilePdf;
      case 'image': return FaFileImage;
      case 'word': return FaFileWord;
      default: return FaFile;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'approved': return 'success';
      case 'pending_review': return 'warning';
      case 'rejected': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = mockDocuments;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'date_asc':
          return new Date(a.uploaded_date) - new Date(b.uploaded_date);
        case 'date_desc':
          return new Date(b.uploaded_date) - new Date(a.uploaded_date);
        case 'size_asc':
          return a.file_size - b.file_size;
        case 'size_desc':
          return b.file_size - a.file_size;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Check if document is expiring soon
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const oneMonthFromNow = subMonths(new Date(), -1);
    return isAfter(parseISO(expiryDate), new Date()) && 
           !isAfter(parseISO(expiryDate), oneMonthFromNow);
  };

  // Check if document is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return !isAfter(parseISO(expiryDate), new Date());
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on documents:`, selectedDocuments);
    // Implement bulk actions here
  };

  return (
    <div className="th-documents-list">
      {/* Header */}
      <div className="th-documents-header">
        <div className="th-header-info">
          <h3 className="th-section-title">
            <FaFolderOpen className="th-section-icon" />
            Documents & Files
          </h3>
          <p className="th-section-subtitle">
            Manage all important documents and files for this child
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={<FaUpload />}
            onClick={() => setShowUpload(true)}
          >
            Upload Files
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FaPlus />}
          >
            Add Document
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="th-documents-controls">
        <div className="th-search-section">
          <div className="th-search-wrapper">
            <FaSearch className="th-search-icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="th-search-input"
            />
          </div>
        </div>

        <div className="th-filter-section">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="th-sort-select"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="size_desc">Largest First</option>
            <option value="size_asc">Smallest First</option>
          </select>
        </div>

        {selectedDocuments.length > 0 && (
          <div className="th-bulk-actions">
            <span className="th-selection-count">
              {selectedDocuments.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={<FaDownload />}
              onClick={() => handleBulkAction('download')}
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FaTrash />}
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="th-categories-bar">
        {documentCategories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className={`th-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="th-category-icon" />
              <span className="th-category-label">{category.label}</span>
              <span className="th-category-count">{category.count}</span>
            </button>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="th-documents-grid">
        {filteredDocuments.map(document => {
          const FileIcon = getFileIcon(document.type);
          const statusColor = getStatusColor(document.status);
          const expiringSoon = isExpiringSoon(document.expiry_date);
          const expired = isExpired(document.expiry_date);

          return (
            <div
              key={document.id}
              className={`th-document-card ${selectedDocuments.includes(document.id) ? 'selected' : ''}`}
            >
              {/* Document Header */}
              <div className="th-document-header">
                <div className="th-document-select">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(document.id)}
                    onChange={() => handleDocumentSelect(document.id)}
                    className="th-document-checkbox"
                  />
                </div>
                <div className="th-document-icon">
                  <FileIcon />
                </div>
                <div className="th-document-badges">
                  {document.is_required && (
                    <span className="th-badge required">Required</span>
                  )}
                  {expiringSoon && (
                    <span className="th-badge warning">
                      <FaClock className="th-badge-icon" />
                      Expiring Soon
                    </span>
                  )}
                  {expired && (
                    <span className="th-badge error">
                      <FaExclamationTriangle className="th-badge-icon" />
                      Expired
                    </span>
                  )}
                </div>
              </div>

              {/* Document Body */}
              <div className="th-document-body">
                <h4 className="th-document-name">{document.name}</h4>
                <p className="th-document-description">{document.description}</p>

                <div className="th-document-meta">
                  <div className="th-meta-item">
                    <FaCalendarAlt className="th-meta-icon" />
                    <span>Uploaded {format(parseISO(document.uploaded_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="th-meta-item">
                    <FaUser className="th-meta-icon" />
                    <span>By {document.uploaded_by}</span>
                  </div>
                  <div className="th-meta-item">
                    <FaFile className="th-meta-icon" />
                    <span>{formatFileSize(document.file_size)}</span>
                  </div>
                </div>

                {document.expiry_date && (
                  <div className="th-expiry-info">
                    <FaCalendarAlt className="th-expiry-icon" />
                    <span className={expired ? 'expired' : expiringSoon ? 'expiring' : 'valid'}>
                      {expired ? 'Expired' : 'Expires'} {format(parseISO(document.expiry_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}

                <div className="th-document-tags">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="th-document-tag">
                      <FaTag className="th-tag-icon" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document Footer */}
              <div className="th-document-footer">
                <div className="th-document-status">
                  <span className={`th-status-badge ${statusColor}`}>
                    {document.status === 'verified' && <FaCheckCircle className="th-status-icon" />}
                    {document.status === 'pending_review' && <FaClock className="th-status-icon" />}
                    {document.status === 'rejected' && <FaExclamationTriangle className="th-status-icon" />}
                    {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <div className="th-document-actions">
                  <button className="th-action-btn view">
                    <FaEye />
                  </button>
                  <button className="th-action-btn download">
                    <FaDownload />
                  </button>
                  <button className="th-action-btn edit">
                    <FaEdit />
                  </button>
                  <button className="th-action-btn delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="th-documents-empty">
          <div className="th-empty-icon">
            <FaFileAlt />
          </div>
          <h3 className="th-empty-title">No documents found</h3>
          <p className="th-empty-description">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by uploading some important documents for this child.'
            }
          </p>
          <Button
            variant="primary"
            icon={<FaUpload />}
            onClick={() => setShowUpload(true)}
          >
            Upload First Document
          </Button>
        </div>
      )}

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          childId={childId}
          onUploadComplete={(files) => {
            console.log('Files uploaded:', files);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
};

export default DocumentsList;
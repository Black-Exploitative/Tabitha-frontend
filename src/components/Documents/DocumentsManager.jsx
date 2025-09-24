// src/components/Documents/DocumentsManager.jsx
import React, { useState, useCallback } from 'react';
import { 
  FaFileAlt,
  FaUpload,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFile,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaUser,
  FaLock,
  FaUnlock,
  FaHistory,
  FaShare,
  FaPrint,
  FaCloudUpload,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfo,
  FaCertificate,
  FaUserMd,
  FaGraduationCap,
  FaHome,
  FaGavel,
  FaHeart
} from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import { NIGERIAN_DOCUMENT_TYPES, FILE_SIZE_LIMITS } from '../../utils/nigerianDocumentData';
import './DocumentsManager.css';

// Helper functions moved outside component for accessibility
const getFileIcon = (type) => {
  const iconMap = {
    'pdf': FaFilePdf,
    'doc': FaFileWord,
    'docx': FaFileWord,
    'xls': FaFileExcel,
    'xlsx': FaFileExcel,
    'jpg': FaFileImage,
    'jpeg': FaFileImage,
    'png': FaFileImage,
    'gif': FaFileImage,
    'image': FaFileImage
  };
  return iconMap[type] || FaFile;
};

const getAccessLevelInfo = (level) => {
  const accessLevels = {
    'public': { label: 'Public', color: 'success', icon: FaUnlock },
    'general': { label: 'General Staff', color: 'primary', icon: FaLock },
    'medical_staff': { label: 'Medical Staff Only', color: 'warning', icon: FaLock },
    'restricted': { label: 'Restricted Access', color: 'error', icon: FaLock },
    'confidential': { label: 'Confidential', color: 'error', icon: FaLock }
  };
  return accessLevels[level] || accessLevels['general'];
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const days = differenceInDays(new Date(expiryDate), new Date());
  return days <= 30 && days >= 0;
};

const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return differenceInDays(new Date(expiryDate), new Date()) < 0;
};

const DocumentsManager = ({ childId, userRole = 'staff' }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_added');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock documents data - replace with API calls
  const mockDocuments = [
    {
      id: 1,
      name: 'Birth Certificate',
      original_name: 'birth_certificate_sarah_adebayo.pdf',
      category: 'legal',
      type: 'pdf',
      size: 2457600, // 2.4MB
      upload_date: '2024-01-15',
      uploaded_by: 'Dr. Kemi Adebayo',
      last_accessed: '2024-05-20',
      access_level: 'restricted',
      version: 1,
      description: 'Official birth certificate from Lagos State Registry',
      tags: ['official', 'identity', 'legal'],
      expiry_date: null,
      is_verified: true,
      file_url: '/documents/birth_cert_001.pdf'
    },
    {
      id: 2,
      name: 'Medical Report - Annual Checkup',
      original_name: 'annual_medical_checkup_2024.pdf',
      category: 'medical',
      type: 'pdf',
      size: 1245600, // 1.2MB
      upload_date: '2024-05-15',
      uploaded_by: 'Dr. Adebayo Johnson',
      last_accessed: '2024-05-22',
      access_level: 'medical_staff',
      version: 1,
      description: 'Comprehensive annual health examination report',
      tags: ['health', 'checkup', 'annual'],
      expiry_date: '2025-05-15',
      is_verified: true,
      file_url: '/documents/medical_report_001.pdf'
    },
    {
      id: 3,
      name: 'School Report Card - 2nd Term',
      original_name: 'report_card_term2_2024.pdf',
      category: 'education',
      type: 'pdf',
      size: 856400, // 856KB
      upload_date: '2024-04-30',
      uploaded_by: 'Mrs. Adunni Okafor',
      last_accessed: '2024-05-18',
      access_level: 'general',
      version: 1,
      description: 'Academic performance report for second term',
      tags: ['academic', 'grades', 'school'],
      expiry_date: null,
      is_verified: true,
      file_url: '/documents/report_card_001.pdf'
    },
    {
      id: 4,
      name: 'Passport Photos',
      original_name: 'passport_photos_2024.jpg',
      category: 'photos',
      type: 'image',
      size: 3245600, // 3.2MB
      upload_date: '2024-03-10',
      uploaded_by: 'Miss Sandra Okwu',
      last_accessed: '2024-05-15',
      access_level: 'general',
      version: 2,
      description: 'Recent passport-size photographs for official use',
      tags: ['photo', 'passport', 'official'],
      expiry_date: '2025-03-10',
      is_verified: true,
      file_url: '/documents/photos_001.jpg'
    },
    {
      id: 5,
      name: 'Court Placement Order',
      original_name: 'court_placement_order_th2024001.pdf',
      category: 'legal',
      type: 'pdf',
      size: 1890000, // 1.8MB
      upload_date: '2024-01-20',
      uploaded_by: 'Legal Department',
      last_accessed: '2024-02-15',
      access_level: 'restricted',
      version: 1,
      description: 'Official court order for child placement at Tabitha Home',
      tags: ['court', 'placement', 'legal', 'confidential'],
      expiry_date: null,
      is_verified: true,
      file_url: '/documents/court_order_001.pdf'
    },
    {
      id: 6,
      name: 'Vaccination Records',
      original_name: 'immunization_card_updated.pdf',
      category: 'medical',
      type: 'pdf',
      size: 945000, // 945KB
      upload_date: '2024-03-18',
      uploaded_by: 'Nurse Mary Okonkwo',
      last_accessed: '2024-05-20',
      access_level: 'medical_staff',
      version: 3,
      description: 'Complete immunization and vaccination history',
      tags: ['vaccination', 'immunization', 'health'],
      expiry_date: null,
      is_verified: true,
      file_url: '/documents/vaccination_001.pdf'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Documents', icon: FaFileAlt, count: mockDocuments.length },
    { id: 'legal', label: 'Legal Documents', icon: FaGavel, count: mockDocuments.filter(d => d.category === 'legal').length },
    { id: 'medical', label: 'Medical Records', icon: FaUserMd, count: mockDocuments.filter(d => d.category === 'medical').length },
    { id: 'education', label: 'Education Records', icon: FaGraduationCap, count: mockDocuments.filter(d => d.category === 'education').length },
    { id: 'photos', label: 'Photos', icon: FaFileImage, count: mockDocuments.filter(d => d.category === 'photos').length },
    { id: 'personal', label: 'Personal Documents', icon: FaUser, count: mockDocuments.filter(d => d.category === 'personal').length },
    { id: 'family', label: 'Family Documents', icon: FaHome, count: mockDocuments.filter(d => d.category === 'family').length }
  ];

  const hasAccess = (document, userRole) => {
    const accessMatrix = {
      'super_admin': ['public', 'general', 'medical_staff', 'restricted', 'confidential'],
      'admin': ['public', 'general', 'medical_staff', 'restricted'],
      'medical_staff': ['public', 'general', 'medical_staff'],
      'staff': ['public', 'general'],
      'volunteer': ['public']
    };
    return accessMatrix[userRole]?.includes(document.access_level) || false;
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const hasUserAccess = hasAccess(doc, userRole);
    
    return matchesCategory && matchesSearch && hasUserAccess;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date_added':
        aValue = new Date(a.upload_date);
        bValue = new Date(b.upload_date);
        break;
      case 'size':
        aValue = a.size;
        bValue = b.size;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      // Validate file
      if (file.size > FILE_SIZE_LIMITS.max_size) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(FILE_SIZE_LIMITS.max_size)}`);
        return;
      }
      
      if (!FILE_SIZE_LIMITS.allowed_types.includes(file.type)) {
        alert(`File type ${file.type} is not allowed`);
        return;
      }
      
      // Start upload process
      uploadFile(file);
    });
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocument = {
        id: Date.now(),
        name: file.name.split('.')[0],
        original_name: file.name,
        category: 'personal', // Default category
        type: file.type.split('/')[1] || 'unknown',
        size: file.size,
        upload_date: new Date().toISOString().split('T')[0],
        uploaded_by: 'Current User',
        last_accessed: new Date().toISOString().split('T')[0],
        access_level: 'general',
        version: 1,
        description: 'Recently uploaded document',
        tags: ['recent'],
        expiry_date: null,
        is_verified: false,
        file_url: URL.createObjectURL(file)
      };
      
      setDocuments(prev => [...prev, newDocument]);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="th-documents-manager">
      <div className="th-documents-header">
        <div className="th-header-content">
          <h2 className="th-documents-title">
            <FaFileAlt className="th-title-icon" />
            Document Management
          </h2>
          <p className="th-documents-subtitle">
            Organize, store, and manage all child-related documents securely
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            icon={FaCloudUpload}
          >
            Bulk Upload
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            icon={FaUpload}
          >
            Upload Document
          </Button>
        </div>
      </div>

      <div className="th-documents-content">
        {/* Sidebar */}
        <div className="th-documents-sidebar">
          <div className="th-sidebar-section">
            <h3 className="th-sidebar-title">Categories</h3>
            <div className="th-categories-list">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`th-category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="th-category-icon" />
                    <span className="th-category-label">{category.label}</span>
                    <span className="th-category-count">{category.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Zone */}
          <div 
            className={`th-upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="th-upload-icon">
              <FaCloudUpload />
            </div>
            <p className="th-upload-text">
              Drag & drop files here
            </p>
            <p className="th-upload-subtext">
              or <button className="th-upload-link" onClick={() => setShowUploadModal(true)}>browse files</button>
            </p>
            <div className="th-upload-limits">
              <small>Max size: {formatFileSize(FILE_SIZE_LIMITS.max_size)}</small>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="th-upload-progress">
              <div className="th-progress-header">
                <span className="th-progress-label">Uploading...</span>
                <span className="th-progress-percentage">{uploadProgress}%</span>
              </div>
              <div className="th-progress-bar">
                <div 
                  className="th-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="th-documents-main">
          {/* Toolbar */}
          <div className="th-documents-toolbar">
            <div className="th-toolbar-left">
              <div className="th-search-container">
                <FaSearch className="th-search-icon" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="th-search-input"
                />
              </div>
              <div className="th-filter-container">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="th-sort-select"
                >
                  <option value="date_added">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="type">Sort by Type</option>
                </select>
                <button
                  className="th-sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <FaSort />
                </button>
              </div>
            </div>
            <div className="th-toolbar-right">
              <span className="th-documents-count">
                {sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="th-documents-grid">
            {sortedDocuments.map(document => {
              const FileIcon = getFileIcon(document.type);
              const accessInfo = getAccessLevelInfo(document.access_level);
              const AccessIcon = accessInfo.icon;
              const isExpiring = isExpiringSoon(document.expiry_date);
              const expired = isExpired(document.expiry_date);
              
              return (
                <div key={document.id} className="th-document-card">
                  <div className="th-document-header">
                    <div className="th-document-icon-wrapper">
                      <FileIcon className={`th-document-icon ${document.type}`} />
                      {document.version > 1 && (
                        <span className="th-version-badge">v{document.version}</span>
                      )}
                    </div>
                    <div className="th-document-actions">
                      <button
                        className="th-action-btn view"
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowPreview(true);
                        }}
                        title="Preview Document"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="th-action-btn download"
                        onClick={() => window.open(document.file_url, '_blank')}
                        title="Download Document"
                      >
                        <FaDownload />
                      </button>
                      <button
                        className="th-action-btn edit"
                        title="Edit Document Info"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                  
                  <div className="th-document-body">
                    <h4 className="th-document-name">{document.name}</h4>
                    <p className="th-document-description">{document.description}</p>
                    
                    <div className="th-document-meta">
                      <div className="th-meta-item">
                        <FaCalendarAlt className="th-meta-icon" />
                        <span>{format(new Date(document.upload_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="th-meta-item">
                        <FaUser className="th-meta-icon" />
                        <span>{document.uploaded_by}</span>
                      </div>
                      <div className="th-meta-item">
                        <span className="th-file-size">{formatFileSize(document.size)}</span>
                      </div>
                    </div>
                    
                    <div className="th-document-footer">
                      <div className={`th-access-level ${accessInfo.color}`}>
                        <AccessIcon className="th-access-icon" />
                        <span className="th-access-text">{accessInfo.label}</span>
                      </div>
                      
                      {document.is_verified && (
                        <div className="th-verified-badge">
                          <FaCheck className="th-verified-icon" />
                          <span>Verified</span>
                        </div>
                      )}
                      
                      {expired && (
                        <div className="th-status-badge expired">
                          <FaExclamationTriangle className="th-status-icon" />
                          <span>Expired</span>
                        </div>
                      )}
                      
                      {isExpiring && !expired && (
                        <div className="th-status-badge expiring">
                          <FaExclamationTriangle className="th-status-icon" />
                          <span>Expiring Soon</span>
                        </div>
                      )}
                    </div>
                    
                    {document.tags.length > 0 && (
                      <div className="th-document-tags">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="th-tag">
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="th-tag-more">+{document.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {sortedDocuments.length === 0 && (
            <div className="th-empty-state">
              <div className="th-empty-icon">
                <FaFileAlt />
              </div>
              <h3 className="th-empty-title">No documents found</h3>
              <p className="th-empty-text">
                {searchQuery 
                  ? `No documents match "${searchQuery}"`
                  : `No documents in ${categories.find(c => c.id === activeCategory)?.label.toLowerCase()}`
                }
              </p>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
                icon={FaUpload}
              >
                Upload First Document
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFiles}
          childId={childId}
        />
      )}

      {/* Document Preview Modal */}
      {showPreview && selectedDocument && (
        <DocumentPreviewModal
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ isOpen, onClose, onUpload, childId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('personal');
  const [uploadDescription, setUploadDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState('general');
  const [tags, setTags] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    selectedFiles.forEach(file => {
      // Add metadata to file
      file.metadata = {
        category: uploadCategory,
        description: uploadDescription,
        access_level: accessLevel,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
    });
    
    onUpload(selectedFiles);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Documents" size="large">
      <div className="th-upload-modal">
        <div className="th-upload-form">
          <div className="th-form-group">
            <label className="th-form-label">Select Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="th-file-input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
            />
            <small className="th-form-help">
              Supported formats: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max: {formatFileSize(FILE_SIZE_LIMITS.max_size)})
            </small>
          </div>

          <div className="th-form-group">
            <label className="th-form-label">Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="th-form-select"
            >
              {Object.entries(NIGERIAN_DOCUMENT_TYPES).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="th-form-group">
            <label className="th-form-label">Description</label>
            <textarea
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              className="th-form-textarea"
              rows="3"
              placeholder="Brief description of the document(s)"
            />
          </div>

          <div className="th-form-group">
            <label className="th-form-label">Access Level</label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="th-form-select"
            >
              <option value="public">Public - Everyone can access</option>
              <option value="general">General Staff - All staff members</option>
              <option value="medical_staff">Medical Staff Only</option>
              <option value="restricted">Restricted - Admin only</option>
              <option value="confidential">Confidential - Super admin only</option>
            </select>
          </div>

          <div className="th-form-group">
            <label className="th-form-label">Tags (optional)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="th-form-input"
              placeholder="Enter tags separated by commas"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="th-selected-files">
              <h4>Selected Files ({selectedFiles.length})</h4>
              <div className="th-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="th-file-item">
                    <span className="th-file-name">{file.name}</span>
                    <span className="th-file-size">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="th-modal-actions">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            icon={FaUpload}
          >
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Document Preview Modal Component  
const DocumentPreviewModal = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null;

  const accessInfo = getAccessLevelInfo(document.access_level);
  const FileIcon = getFileIcon(document.type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.name} size="extra-large">
      <div className="th-document-preview">
        <div className="th-preview-header">
          <div className="th-preview-info">
            <div className="th-preview-icon">
              <FileIcon className={`th-preview-file-icon ${document.type}`} />
            </div>
            <div className="th-preview-details">
              <h3 className="th-preview-title">{document.name}</h3>
              <p className="th-preview-description">{document.description}</p>
              <div className="th-preview-meta">
                <span>Uploaded: {format(new Date(document.upload_date), 'MMM dd, yyyy')}</span>
                <span>By: {document.uploaded_by}</span>
                <span>Size: {formatFileSize(document.size)}</span>
                <span>Version: {document.version}</span>
              </div>
            </div>
          </div>
          <div className="th-preview-actions">
            <Button variant="outline" size="sm" icon={FaDownload}>
              Download
            </Button>
            <Button variant="outline" size="sm" icon={FaPrint}>
              Print
            </Button>
            <Button variant="outline" size="sm" icon={FaShare}>
              Share
            </Button>
          </div>
        </div>

        <div className="th-preview-content">
          {document.type === 'pdf' && (
            <iframe
              src={document.file_url}
              className="th-pdf-viewer"
              title={document.name}
            />
          )}
          
          {['jpg', 'jpeg', 'png', 'gif', 'image'].includes(document.type) && (
            <div className="th-image-viewer">
              <img src={document.file_url} alt={document.name} />
            </div>
          )}
          
          {!['pdf', 'jpg', 'jpeg', 'png', 'gif', 'image'].includes(document.type) && (
            <div className="th-preview-unavailable">
              <FileIcon className="th-unavailable-icon" />
              <h4>Preview not available</h4>
              <p>This file type cannot be previewed. Click download to view the file.</p>
              <Button variant="primary" icon={FaDownload}>
                Download File
              </Button>
            </div>
          )}
        </div>

        <div className="th-preview-footer">
          <div className="th-document-properties">
            <div className="th-property-group">
              <h5>Security & Access</h5>
              <div className={`th-access-info ${accessInfo.color}`}>
                <accessInfo.icon className="th-access-icon" />
                <span>{accessInfo.label}</span>
              </div>
              {document.is_verified && (
                <div className="th-verification-status">
                  <FaCheck className="th-verified-icon" />
                  <span>Document Verified</span>
                </div>
              )}
            </div>
            
            {document.tags.length > 0 && (
              <div className="th-property-group">
                <h5>Tags</h5>
                <div className="th-tags-display">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="th-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            {document.expiry_date && (
              <div className="th-property-group">
                <h5>Expiry Information</h5>
                <div className={`th-expiry-info ${isExpired(document.expiry_date) ? 'expired' : isExpiringSoon(document.expiry_date) ? 'expiring' : 'valid'}`}>
                  <FaCalendarAlt className="th-expiry-icon" />
                  <span>Expires: {format(new Date(document.expiry_date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentsManager;
import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaUpload, 
  FaDownload, 
  FaSearch, 
  FaFilter,
  FaFolder,
  FaFile,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaTrash,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import SearchInput from '../../components/Common/SearchInput';
import FilterDropdown from '../../components/Common/FilterDropdown';
import './Documents.css';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    dateRange: 'all'
  });

  // Mock documents data
  const mockDocuments = [
    {
      id: 1,
      name: 'Child Registration Form - Sarah Adebayo.pdf',
      type: 'pdf',
      category: 'Children',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'Dr. Amina Hassan'
    },
    {
      id: 2,
      name: 'Medical Report - Ahmed Ibrahim.docx',
      type: 'word',
      category: 'Medical',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      uploadedBy: 'Nurse Sarah Johnson'
    },
    {
      id: 3,
      name: 'Staff Photo - Michael Chen.jpg',
      type: 'image',
      category: 'Staff',
      size: '850 KB',
      uploadDate: '2024-01-13',
      uploadedBy: 'Admin User'
    },
    {
      id: 4,
      name: 'Monthly Report - January 2024.xlsx',
      type: 'excel',
      category: 'Reports',
      size: '3.1 MB',
      uploadDate: '2024-01-12',
      uploadedBy: 'Manager'
    }
  ];

  const filterOptions = {
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'Children', label: 'Children' },
      { value: 'Staff', label: 'Staff' },
      { value: 'Medical', label: 'Medical' },
      { value: 'Reports', label: 'Reports' },
      { value: 'Legal', label: 'Legal' },
      { value: 'Financial', label: 'Financial' }
    ],
    type: [
      { value: 'all', label: 'All Types' },
      { value: 'pdf', label: 'PDF' },
      { value: 'word', label: 'Word' },
      { value: 'excel', label: 'Excel' },
      { value: 'image', label: 'Image' },
      { value: 'other', label: 'Other' }
    ],
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'year', label: 'This Year' }
    ]
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="file-icon pdf" />;
      case 'word': return <FaFileWord className="file-icon word" />;
      case 'excel': return <FaFileExcel className="file-icon excel" />;
      case 'image': return <FaFileImage className="file-icon image" />;
      default: return <FaFile className="file-icon" />;
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      dateRange: 'all'
    });
    setSearchQuery('');
  };

  const handleUpload = () => {
    console.log('Upload document');
  };

  const handleDownload = (document) => {
    console.log('Download document:', document.name);
  };

  const handleView = (document) => {
    console.log('View document:', document.name);
  };

  const handleDelete = (document) => {
    console.log('Delete document:', document.name);
  };

  return (
    <div className="th-documents">
      {/* Header */}
      <div className="th-documents-header">
        <div className="th-header-content">
          <div className="th-header-main">
            <h1 className="th-page-title">
              <FaFileAlt className="th-title-icon" />
              Documents Management
            </h1>
            <p className="th-page-subtitle">
              Manage and organize all documents and files
            </p>
          </div>
          
          <div className="th-page-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<FaDownload />}
            >
              Bulk Download
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FaUpload />}
              onClick={handleUpload}
            >
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="th-documents-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaFileAlt />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{mockDocuments.length}</span>
            <span className="th-stat-label">Total Documents</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaFilePdf />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">1</span>
            <span className="th-stat-label">PDF Files</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaFileWord />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">1</span>
            <span className="th-stat-label">Word Files</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaFileImage />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">1</span>
            <span className="th-stat-label">Images</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="th-documents-controls">
        <div className="th-controls-left">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents by name..."
            className="th-documents-search"
          />
          
          <div className="th-filter-group">
            <FilterDropdown
              label="Category"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              options={filterOptions.category}
            />
            
            <FilterDropdown
              label="Type"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              options={filterOptions.type}
            />
            
            <FilterDropdown
              label="Date"
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              options={filterOptions.dateRange}
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div className="th-documents-content">
        {mockDocuments.length > 0 ? (
          <div className="th-documents-list">
            {mockDocuments.map(document => (
              <div key={document.id} className="th-document-item">
                <div className="th-document-icon">
                  {getFileIcon(document.type)}
                </div>
                
                <div className="th-document-info">
                  <h4 className="th-document-name">{document.name}</h4>
                  <div className="th-document-meta">
                    <span className="th-document-category">{document.category}</span>
                    <span className="th-document-size">{document.size}</span>
                    <span className="th-document-date">{document.uploadDate}</span>
                    <span className="th-document-uploader">by {document.uploadedBy}</span>
                  </div>
                </div>
                
                <div className="th-document-actions">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<FaEye />}
                    onClick={() => handleView(document)}
                    title="View"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<FaDownload />}
                    onClick={() => handleDownload(document)}
                    title="Download"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<FaEdit />}
                    title="Edit"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<FaTrash />}
                    onClick={() => handleDelete(document)}
                    title="Delete"
                    className="th-delete-btn"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="th-documents-empty">
            <div className="th-empty-icon">
              <FaFileAlt />
            </div>
            <h3>No Documents Found</h3>
            <p>
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? 'No documents match your current search and filter criteria.'
                : 'No documents have been uploaded yet.'
              }
            </p>
            <Button
              variant="primary"
              icon={<FaUpload />}
              onClick={handleUpload}
            >
              Upload First Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;

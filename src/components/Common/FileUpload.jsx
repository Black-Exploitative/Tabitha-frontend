// src/components/Common/FileUpload.jsx
import React, { useState, useCallback } from 'react';
import {
  FaUpload,
  FaFile,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaCloud,
  FaSpinner,
  FaClock
} from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import Button from '../UI/Button/Button';
import { formatFileSize } from '../../utils/helpers';
import './FileUpload.css';

const FileUpload = ({ 
  isOpen, 
  onClose, 
  childId, 
  onUploadComplete,
  acceptedTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  },
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  multiple = true
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return FaFileImage;
    if (type === 'application/pdf') return FaFilePdf;
    if (type.includes('word')) return FaFileWord;
    if (type.includes('excel') || type.includes('spreadsheet')) return FaFileExcel;
    return FaFile;
  };

  const getFileColor = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return '#10B981'; // green
    if (type === 'application/pdf') return '#EF4444'; // red
    if (type.includes('word')) return '#3B82F6'; // blue
    if (type.includes('excel')) return '#059669'; // emerald
    return '#6B7280'; // gray
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            console.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
          } else if (error.code === 'file-invalid-type') {
            console.error(`File ${file.name} is not a supported file type`);
          }
        });
      });
    }

    // Handle accepted files
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending', // pending, uploading, success, error
      error: null,
      category: 'general', // To be set by user
      description: '',
      confidentiality: 'internal'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [maxFileSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize: maxFileSize,
    maxFiles: multiple ? maxFiles : 1,
    multiple
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileMetadata = (fileId, metadata) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, ...metadata } : f
    ));
  };

  const simulateUpload = async (file) => {
    const fileId = file.id;
    updateFileMetadata(fileId, { status: 'uploading' });
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Simulate random success/error
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      updateFileMetadata(fileId, { 
        status: 'success',
        uploadedUrl: `/uploads/children/${childId}/${file.name}`
      });
    } else {
      updateFileMetadata(fileId, { 
        status: 'error',
        error: 'Upload failed. Please try again.'
      });
    }

    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    
    // Upload files sequentially (could be done in parallel)
    for (const file of pendingFiles) {
      await simulateUpload(file);
    }
    
    setUploading(false);
    
    // Check if all uploads were successful
    const allSuccessful = uploadedFiles.every(f => f.status === 'success');
    
    if (allSuccessful) {
      onUploadComplete(uploadedFiles);
    }
  };

  const hasValidFiles = uploadedFiles.some(f => f.status === 'pending' || f.status === 'success');
  const hasErrors = uploadedFiles.some(f => f.status === 'error');

  if (!isOpen) return null;

  return (
    <div className="th-modal-overlay">
      <div className="th-modal-container th-upload-modal">
        <div className="th-modal-header">
          <div className="th-modal-title-section">
            <h2 className="th-modal-title">
              <FaUpload className="th-modal-icon" />
              Upload Files & Documents
            </h2>
            <p className="th-modal-subtitle">
              Upload important documents, photos, and files for this child
            </p>
          </div>
          <button className="th-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="th-modal-body">
          {/* Upload Area */}
          <div 
            {...getRootProps()} 
            className={`th-upload-area ${isDragActive ? 'th-upload-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="th-upload-content">
              <div className="th-upload-icon">
                <FaCloud />
              </div>
              <div className="th-upload-text">
                <h3 className="th-upload-title">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="th-upload-subtitle">
                  or <span className="th-upload-link">browse files</span>
                </p>
              </div>
              <div className="th-upload-info">
                <p className="th-upload-limits">
                  Maximum file size: {formatFileSize(maxFileSize)} • 
                  Maximum files: {maxFiles} • 
                  Supported: PDF, Images, Word, Excel
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="th-files-section">
              <h3 className="th-files-title">Selected Files</h3>
              <div className="th-files-list">
                {uploadedFiles.map(file => {
                  const FileIcon = getFileIcon(file.file);
                  const fileColor = getFileColor(file.file);
                  const progress = uploadProgress[file.id];

                  return (
                    <div key={file.id} className={`th-file-item th-file-${file.status}`}>
                      <div className="th-file-main">
                        <div className="th-file-icon" style={{ color: fileColor }}>
                          <FileIcon />
                        </div>
                        <div className="th-file-info">
                          <h4 className="th-file-name">{file.name}</h4>
                          <p className="th-file-size">{formatFileSize(file.size)}</p>
                          {file.status === 'uploading' && (
                            <div className="th-file-progress">
                              <div className="th-progress-bar">
                                <div 
                                  className="th-progress-fill"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="th-progress-text">{progress}%</span>
                            </div>
                          )}
                          {file.status === 'error' && (
                            <p className="th-file-error">{file.error}</p>
                          )}
                        </div>
                        <div className="th-file-status">
                          {file.status === 'pending' && (
                            <div className="th-status-badge th-status-pending">
                              <FaClock className="th-status-icon" />
                              Pending
                            </div>
                          )}
                          {file.status === 'uploading' && (
                            <div className="th-status-badge th-status-uploading">
                              <FaSpinner className="th-status-icon th-spinning" />
                              Uploading
                            </div>
                          )}
                          {file.status === 'success' && (
                            <div className="th-status-badge th-status-success">
                              <FaCheck className="th-status-icon" />
                              Success
                            </div>
                          )}
                          {file.status === 'error' && (
                            <div className="th-status-badge th-status-error">
                              <FaExclamationTriangle className="th-status-icon" />
                              Error
                            </div>
                          )}
                        </div>
                        <button 
                          className="th-file-remove"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'uploading'}
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {/* File Metadata */}
                      <div className="th-file-metadata">
                        <div className="th-metadata-grid">
                          <div className="th-metadata-group">
                            <label className="th-metadata-label">Category</label>
                            <select
                              value={file.category}
                              onChange={(e) => updateFileMetadata(file.id, { category: e.target.value })}
                              className="th-metadata-select"
                              disabled={file.status === 'uploading'}
                            >
                              <option value="general">General</option>
                              <option value="legal">Legal Documents</option>
                              <option value="medical">Medical Records</option>
                              <option value="education">Education</option>
                              <option value="photos">Photos</option>
                              <option value="identification">Identification</option>
                            </select>
                          </div>
                          
                          <div className="th-metadata-group">
                            <label className="th-metadata-label">Confidentiality</label>
                            <select
                              value={file.confidentiality}
                              onChange={(e) => updateFileMetadata(file.id, { confidentiality: e.target.value })}
                              className="th-metadata-select"
                              disabled={file.status === 'uploading'}
                            >
                              <option value="internal">Internal</option>
                              <option value="confidential">Confidential</option>
                              <option value="restricted">Restricted</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="th-metadata-group th-metadata-full">
                          <label className="th-metadata-label">Description</label>
                          <textarea
                            value={file.description}
                            onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                            placeholder="Brief description of this document..."
                            className="th-metadata-textarea"
                            rows="2"
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="th-modal-footer">
          {hasErrors && (
            <div className="th-upload-error">
              <FaExclamationTriangle className="th-error-icon" />
              Some files failed to upload. Please try again.
            </div>
          )}
          
          <div className="th-upload-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="primary"
              icon={<FaUpload />}
              onClick={handleUpload}
              disabled={!hasValidFiles || uploading}
              loading={uploading}
            >
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
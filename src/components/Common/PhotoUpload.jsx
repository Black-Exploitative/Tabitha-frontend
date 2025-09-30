import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaCamera, FaTimes, FaCheck } from 'react-icons/fa';
import './PhotoUpload.css';

const PhotoUpload = ({ 
  onFileSelect, 
  preview = true, 
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*",
  className = "",
  disabled = false
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            alert(`File ${file.name} is too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
          } else if (error.code === 'file-invalid-type') {
            alert(`File ${file.name} is not a supported image type`);
          }
        });
      });
      return;
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // Create preview URL
      if (preview) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
      
      // Call the parent callback
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  }, [maxSize, preview, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    maxSize: maxSize,
    multiple: false,
    disabled: disabled
  });

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`th-photo-upload ${className}`}>
      {!uploadedFile ? (
        <div 
          {...getRootProps()} 
          className={`th-photo-dropzone ${isDragActive ? 'th-photo-active' : ''} ${disabled ? 'th-photo-disabled' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="th-photo-content">
            <div className="th-photo-icon">
              <FaCamera />
            </div>
            <div className="th-photo-text">
              <h4 className="th-photo-title">
                {isDragActive ? 'Drop photo here' : 'Upload Child Photo'}
              </h4>
              <p className="th-photo-subtitle">
                {isDragActive ? 'Release to upload' : 'Click to browse or drag & drop'}
              </p>
            </div>
            <div className="th-photo-info">
              <p className="th-photo-limits">
                Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB • 
                Supported: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="th-photo-preview">
          {preview && previewUrl && (
            <div className="th-photo-image-container">
              <img 
                src={previewUrl} 
                alt="Child photo preview" 
                className="th-photo-image"
              />
              <div className="th-photo-overlay">
                <button 
                  className="th-photo-remove"
                  onClick={removeFile}
                  type="button"
                  title="Remove photo"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          <div className="th-photo-details">
            <div className="th-photo-info-item">
              <FaCheck className="th-photo-success-icon" />
              <span className="th-photo-filename">{uploadedFile.name}</span>
            </div>
            <div className="th-photo-info-item">
              <span className="th-photo-size">{formatFileSize(uploadedFile.size)}</span>
            </div>
            <button 
              className="th-photo-change-btn"
              onClick={removeFile}
              type="button"
            >
              Change Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

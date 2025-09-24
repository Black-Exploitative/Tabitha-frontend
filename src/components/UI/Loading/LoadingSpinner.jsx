// src/components/UI/Loading/LoadingSpinner.jsx - Following established patterns
import React from 'react';
import { 
  FaExclamationTriangle,
  FaRedo,
  FaPlus,
  FaSpinner
} from 'react-icons/fa';
import Button from '../Button/Button';
import './LoadingSpinner.css';

// Basic Loading Spinner
const LoadingSpinner = ({ 
  size = 'base', 
  color = 'primary', 
  className = '',
  text = null 
}) => {
  const classes = [
    'th-loading-spinner',
    `th-spinner-${size}`,
    `th-spinner-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="th-spinner-container">
      <div className={classes}></div>
      {text && <p className="th-spinner-text">{text}</p>}
    </div>
  );
};

// Loading State Component
export const LoadingState = ({ 
  size = 'default',
  message = 'Loading...',
  submessage = null,
  className = ''
}) => {
  const sizeClass = size === 'fullscreen' ? 'fullscreen' : size === 'inline' ? 'inline' : '';
  
  return (
    <div className={`th-loading-state ${sizeClass} ${className}`}>
      <LoadingSpinner size="lg" />
      <p className="th-loading-message">{message}</p>
      {submessage && <p className="th-loading-submessage">{submessage}</p>}
    </div>
  );
};

// Error State Component
export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'Please try again or contact support if the problem persists.',
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`th-error-state ${className}`}>
      <div className="th-error-icon">
        <FaExclamationTriangle />
      </div>
      <h3 className="th-error-title">{title}</h3>
      <p className="th-error-message">{message}</p>
      <div className="th-error-actions">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            icon={<FaRedo />}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon: IconComponent = FaSpinner,
  title = 'No data found',
  message = 'There are no items to display at the moment.',
  action = null,
  className = ''
}) => {
  return (
    <div className={`th-empty-state ${className}`}>
      <div className="th-empty-icon">
        <IconComponent />
      </div>
      <h3 className="th-empty-title">{title}</h3>
      <p className="th-empty-message">{message}</p>
      {action && action}
    </div>
  );
};

// Button Spinner (for loading buttons)
export const ButtonSpinner = ({ className = '' }) => {
  return <div className={`th-button-spinner ${className}`}></div>;
};

// Loading Overlay
export const LoadingOverlay = ({ 
  message = 'Loading...',
  dark = false,
  className = ''
}) => {
  return (
    <div className={`th-loading-overlay ${dark ? 'dark' : ''} ${className}`}>
      <LoadingSpinner size="lg" color={dark ? 'white' : 'primary'} />
      <p className="th-spinner-text">{message}</p>
    </div>
  );
};

// Skeleton Loading Components
export const SkeletonLine = ({ 
  width = 'long',
  height = 16,
  className = ''
}) => {
  return (
    <div 
      className={`th-skeleton th-skeleton-line ${width} ${className}`}
      style={{ height: `${height}px` }}
    ></div>
  );
};

export const SkeletonAvatar = ({ 
  size = 48,
  className = ''
}) => {
  return (
    <div 
      className={`th-skeleton th-skeleton-avatar ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    ></div>
  );
};

export const SkeletonCard = ({ 
  height = 120,
  className = ''
}) => {
  return (
    <div 
      className={`th-skeleton th-skeleton-card ${className}`}
      style={{ height: `${height}px` }}
    ></div>
  );
};

// Staff Card Skeleton
export const SkeletonStaffCard = ({ className = '' }) => {
  return (
    <div className={`th-skeleton-staff-card ${className}`}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <SkeletonAvatar size={48} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="medium" height={18} />
          <SkeletonLine width="short" height={14} />
        </div>
      </div>
      <SkeletonLine width="long" height={14} />
      <SkeletonLine width="medium" height={14} />
      <SkeletonLine width="short" height={14} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <SkeletonLine width="short" height={32} />
        <SkeletonLine width="short" height={32} />
      </div>
    </div>
  );
};

// Data Loading Hook Helper
export const useLoadingState = (isLoading, error, data) => {
  if (isLoading) {
    return { 
      component: <LoadingState />, 
      shouldRender: true 
    };
  }
  
  if (error) {
    return { 
      component: <ErrorState message={error.message} />, 
      shouldRender: true 
    };
  }
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return { 
      component: <EmptyState />, 
      shouldRender: true 
    };
  }
  
  return { 
    component: null, 
    shouldRender: false 
  };
};

// Comprehensive Loading Component
export const DataState = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  loadingMessage = 'Loading data...',
  errorTitle = 'Failed to load data',
  errorMessage = 'Please try again or contact support if the problem persists.',
  emptyTitle = 'No data found',
  emptyMessage = 'There are no items to display at the moment.',
  emptyIcon = FaSpinner,
  emptyAction = null,
  onRetry = null,
  children = null,
  className = ''
}) => {
  if (isLoading) {
    return (
      <LoadingState 
        message={loadingMessage}
        className={className}
      />
    );
  }
  
  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={error?.message || errorMessage}
        onRetry={onRetry}
        className={className}
      />
    );
  }
  
  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        action={emptyAction}
        className={className}
      />
    );
  }
  
  return children;
};

export default LoadingSpinner;
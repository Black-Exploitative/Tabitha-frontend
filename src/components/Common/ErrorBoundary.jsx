// src/components/Common/ErrorBoundary.jsx
import React from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import Button from '../UI/Button/Button';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="th-error-boundary">
          <div className="th-error-container">
            <div className="th-error-icon">
              <FaExclamationTriangle />
            </div>
            
            <h1 className="th-error-title">Oops! Something went wrong</h1>
            
            <p className="th-error-message">
              We're sorry, but something unexpected happened. Our team has been notified 
              and is working to fix this issue.
            </p>

            <div className="th-error-actions">
              <Button 
                onClick={this.handleRefresh}
                icon={FaRedo}
                variant="primary"
              >
                Refresh Page
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                icon={FaHome}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="th-error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="th-error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
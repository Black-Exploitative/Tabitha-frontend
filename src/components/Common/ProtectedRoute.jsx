import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/Loading/LoadingSpinner';

const ProtectedRoute = ({ children, requiredPermission = null, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="th-loading-container">
        <LoadingSpinner size="lg" />
        <p className="th-loading-text">Checking authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
    return (
      <div className="th-access-denied">
        <div className="th-access-denied-content">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>Required role: <strong>{requiredRole}</strong></p>
          <p>Your role: <strong>{user?.role}</strong></p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !user?.permissions?.includes(requiredPermission) && user?.role !== 'super_admin') {
    return (
      <div className="th-access-denied">
        <div className="th-access-denied-content">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>Required permission: <strong>{requiredPermission}</strong></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="th-auth-layout">
      <div className="th-auth-background">
        <div className="th-auth-gradient"></div>
        <div className="th-auth-pattern"></div>
      </div>
      
      <div className="th-auth-container">
        <div className="th-auth-brand">
          <div className="th-auth-logo">
            <span>TH</span>
          </div>
          <h1 className="th-auth-title">Tabitha Home</h1>
          <p className="th-auth-subtitle">
            Caring for Children with Love & Excellence
          </p>
        </div>
        
        <div className="th-auth-card">
          {children}
        </div>
      </div>
      
      <div className="th-auth-footer">
        <p>&copy; 2024 Tabitha Home. Built with ❤️ for Nigerian children.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
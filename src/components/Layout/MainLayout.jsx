import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="th-main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="th-layout-container">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="th-main-content">
          <div className="th-content-wrapper">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay - Only show on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className={`th-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;
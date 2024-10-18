// src/components/Layout/DashboardLayout.js
import React from 'react';
import SidebarComponent from '../Sidebar/Sidebar';

const DashboardLayout = ({ isSidebarOpen, toggleSidebar, children }) => (
  <div className="App">
    <SidebarComponent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {children}
    </div>
  </div>
);

export default DashboardLayout;
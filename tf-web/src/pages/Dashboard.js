import React from 'react';
import DashboardComponent from '../components/Dashboard/DashboardComponent';

const Dashboard = ({ isSidebarOpen }) => {
  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;
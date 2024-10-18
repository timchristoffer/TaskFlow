import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Auth from './pages/Auth';
import DashboardDetail from './components/Dashboard/DashboardDetail';
import DashboardLayout from './components/Dashboard/DashboardLayout';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <DashboardLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Dashboard isSidebarOpen={isSidebarOpen} />
          </DashboardLayout>
        } />
        <Route path="/dashboard/:dashboardId" element={
          <DashboardLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <DashboardDetail isSidebarOpen={isSidebarOpen} />
          </DashboardLayout>
        } />
        {/* Här kan du lägga till fler routes senare */}
      </Routes>
    </Router>
  );
}

export default App;
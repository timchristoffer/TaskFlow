import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import DashboardDetail from './components/Dashboard/DashboardDetail';
import SidebarComponent from './components/Sidebar/Sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <SidebarComponent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard isSidebarOpen={isSidebarOpen} />} />
            <Route path="/dashboard/:dashboardId" element={<DashboardDetail isSidebarOpen={isSidebarOpen} />} />
            {/* Här kan du lägga till fler routes senare */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
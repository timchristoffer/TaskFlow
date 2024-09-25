import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import DashboardDetail from './components/Dashboard/DashboardDetail';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard/:dashboardName" element={<DashboardDetail />} /> {/* Add this line */}
          {/* Här kan du lägga till fler routes senare */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

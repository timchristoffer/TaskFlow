import React from 'react';
import './Sidebar.css';
import '../../styles/App.css';

const SidebarComponent = ({ isOpen, toggleSidebar }) => {
  return (
    <div>
      <div id="nav-icon3" className={isOpen ? 'open' : ''} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="menu">
          <a href="/">
            <img src="/icons/home.svg" alt="Home" className="menu-icon" />
            Home
          </a>
          <a href="/dashboards">
            <img src="/icons/chalkboard.svg" alt="Dashboards" className="menu-icon" />
            Dashboards
          </a>
          <a href="/profile">
            <img src="/icons/profile_2.svg" alt="Profile" className="menu-icon" />
            Profile
          </a>
          <a href="/">
            <img src="/icons/logout.svg" alt="Logout" className="menu-icon" />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
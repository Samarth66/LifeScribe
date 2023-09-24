import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Header.css";
import socket from "../socket";
import { useSidebar } from "../../SidebarContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/journal": "Journal",
    "/goal": "Goal Tracker",
    "/health": "Health Tracker",
    "/spending": "Spending Tracker",
    "/dashboard": "Dashboard",
  };

  const currentPageTitle = pageTitles[location.pathname] || "";

  const handleLogout = () => {
    socket.disconnect();
    navigate("/");
  };

  const { toggleSidebar } = useSidebar();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="hd">
      <header>
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <h2 className="logo">LifeScribe</h2>
        <h2 className="subheading">{currentPageTitle}</h2>
        <nav className={`navigation ${showSidebar ? "show" : ""}`}>
          <Link to="/journal">Journal</Link>
          <Link to="/goal">Goal Tracker</Link>
          <Link to="/health">Health Tracker</Link>
          <Link to="/spending">Spending Tracker</Link>
          <Link to="/dashboard">Dashboard</Link>
          <button className="loginButtonn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <nav className="mobile-navigation dropdown">
          <button className="loginButtonn">Menu</button>
          <div className="dropdown-content">
            <Link to="/journal">Journal</Link>
            <Link to="/goal">Goal Tracker</Link>
            <Link to="/health">Health Tracker</Link>
            <Link to="/spending">Spending Tracker</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;

import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import "../css/Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define a mapping of route paths to page titles
  const pageTitles = {
    "/journal": "Journal",
    "/goal": "Goal Tracker",
    "/health": "Health Tracker",
    "/spending": "Spending Tracker",
    "/dashboard": "Dashboard",
  };

  const currentPageTitle = pageTitles[location.pathname] || "";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="hd">
      <header>
        <h2 className="logo">LifeScribe</h2>
        <h2 className="subheading">{currentPageTitle}</h2>
        <nav className="navigation">
          <Link to="/journal">Journal</Link>
          <Link to="/goal">Goal Tracker</Link>
          <Link to="/health">Health Tracker</Link>
          <Link to="/spending">Spending Tracker</Link>
          <Link to="/dashboard">Dashboard</Link>
          <button className="loginButtonn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Header;

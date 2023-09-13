import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const location = useLocation(); // Get the current route location

  // Define a mapping of route paths to page titles
  const pageTitles = {
    "/journal": "Journal",
    "/goal": "Goal Tracker",
    "/health": "Health Tracker",
    "/spending": "Spending Tracker",
    "/dashboard": "Dashboard",
  };

  // Get the page title based on the current route path
  const currentPageTitle = pageTitles[location.pathname] || "";

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
          <button className="loginButton">Logout</button>
        </nav>
      </header>
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const [page, setPage] = useState("");

  function updateHeader(event) {
    const clickedPage = event.target.textContent;
    setPage(clickedPage);
  }

  return (
    <div>
      <header>
        <h2 className="logo">Logo</h2>
        <h2 className="subheading">{page}</h2>
        <nav className="navigation">
          <Link to="/journal" onClick={updateHeader}>
            Journal
          </Link>
          <Link to="/goal" onClick={updateHeader}>
            Goal Tracker
          </Link>
          <Link to="/health" onClick={updateHeader}>
            Health Tracker
          </Link>
          <Link to="/spending" onClick={updateHeader}>
            Spending Tracker
          </Link>
          <Link to="/dashboard" onClick={updateHeader}>
            Dashboard
          </Link>
          <button className="loginButton">Logout</button>
        </nav>
      </header>
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import "../css/Header.css";

const Header = () => {
  const [page, setPage] = useState("");

  function updateHeader(event) {
    console.log();
    setPage(event.target.textContent);
  }
  return (
    <div>
      <header>
        <h2 className="logo">Logo</h2>
        <h2 className="subheading">{page}</h2>
        <nav className="navigation">
          <a href="#" onClick={updateHeader}>
            Journal
          </a>
          <a href="#" onClick={updateHeader}>
            Goal Tracker
          </a>
          <a href="#" onClick={updateHeader}>
            Health Tracker
          </a>
          <a href="#" onClick={updateHeader}>
            Spending Tracker
          </a>
          <a href="#" onClick={updateHeader}>
            Dashboard
          </a>
          <button className="loginButton">Logout</button>
        </nav>
      </header>
    </div>
  );
};

export default Header;

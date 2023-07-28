import React from "react";
import "../css/Login.css";

const LoginHeader = () => {
  return (
    <div>
      <header>
        <h2 className="logo">Logo</h2>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <button className="loginButton">Login</button>
        </nav>
      </header>
    </div>
  );
};

export default LoginHeader;

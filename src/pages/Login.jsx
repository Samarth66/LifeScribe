import React, { useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "animate.css";
import LoginHeader from "./LoginHeader";
import LoginLeft from "./LoginLeft";
import LoginRight from "./LoginRight";

const Login = () => {
  const capt = "Capture Conquer Elevate";

  return (
    <div>
      <LoginHeader />
      <div className="container">
        <div className="leftContainer">
          <LoginLeft />
        </div>
        <div className="rightContainer">
          <LoginRight />
        </div>
      </div>
    </div>
  );
};

export default Login;

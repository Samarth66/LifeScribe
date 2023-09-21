import React from "react";
import "./Login.css";
import "animate.css";
import LoginHeader from "../header/LoginHeader";
import LoginLeft from "../loginLeft/LoginLeft";
import LoginRight from "../loginRight/LoginRight";

const Login = () => {
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

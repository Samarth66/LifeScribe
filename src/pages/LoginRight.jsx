import React, { useEffect, useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
const initializeSocket = require("./socket");

const LoginRight = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {}, [userDetails]);

  const toggleForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setMessage("");
    setIsLogin(!isLogin);
  };

  const submit = async (e) => {
    e.preventDefault();

    let url = isLogin
      ? "http://localhost:8000/"
      : "http://localhost:8000/signup";
    let data = isLogin
      ? { email, password }
      : { id: uuidv4(), name, email, password };

    await axios
      .post(url, data)
      .then((res) => {
        const resData = res.data;

        if (isLogin) {
          if (resData.status === "exist") {
            const userData = {
              id: resData.id,
              name: resData.name,
            };
            socket.emit("joinRoom", resData.id);
            dispatch({ type: "SET_USER_DETAILS", payload: userData });
            history("/dashboard");
          } else if (resData.status === "notexist") {
            alert("User doesn't exist");
          } else if (resData.status === "incorrectPassword") {
            alert("Please enter the correct password");
          }
        } else {
          if (resData.status === "exist") {
            alert("User already exists");
          } else if (resData.status === "password") {
            alert(
              "Please provide a password that consists of a minimum of six digits"
            );
          } else if (resData.status === "success") {
            console.log("success");
            setMessage("Signup successful. Welcome aboard!");
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <form className="form" onSubmit={submit}>
        <h1>{isLogin ? "Login" : "Signup"}</h1>

        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <input type="submit" value={isLogin ? "Login" : "Signup"} />
        <p>
          <b>{message}</b>
        </p>
        <button type="button" className="loginButton" onClick={toggleForm}>
          {isLogin ? "Switch to Signup" : "Switch to Login"}
        </button>
      </form>
    </div>
  );
};
export default LoginRight;

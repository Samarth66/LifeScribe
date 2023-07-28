import React, { useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const history = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/signup", {
          id: uuidv4(),
          name,
          email,
          password,
        })
        .then((res) => {
          const resData = res.data;
          if (resData.status == "exist") {
            alert("user already exists");
          } else if (resData.status == "notexist") {
            history("/journal", {
              state: { name: resData.name, id: resData.id },
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <div className="headingContainer">
        <h1 className="heading">
          Introducing LifeScribe: Your Ultimate Life Management Hub! Capture,
          Conquer, and Elevate Every Moment of Your Life.
        </h1>
      </div>
      <form className="form">
        <p>
          <b>Login</b>
        </p>
        <input
          className="formInput"
          type="text"
          onChange={function (e) {
            setName(e.target.value);
          }}
          placeholder="Enter Name"
        />
        <input
          className="formInput"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter registered email"
        />
        <br />
        <input
          className="formInput"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter password"
        />
        <input type="submit" onClick={submit} />
      </form>
    </div>
  );
};

export default Signup;

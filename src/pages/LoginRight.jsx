import React, { useEffect, useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

const LoginRight = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  const history = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/", {
          email,
          password,
        })
        .then((res) => {
          const resData = res.data;
          console.log(resData.status);
          if (resData.status == "exist") {
            const userData = {
              id: resData.id,
              name: resData.name,
            };
            dispatch({ type: "SET_USER_DETAILS", payload: userData });
            history("/journal", {
              state: { name: resData.name, id: resData.id },
            });
          } else if (resData.status == "notexist") {
            alert("user doesn't exists");
          } else if (resData.status == "incorrectPassword") {
            alert("Please enter correct password");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch {
      console.log(e);
    }
  }
  return (
    <div>
      <form className="form">
        <h1 className="log">login</h1>

        <input
          className="formInput"
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter registered email"
        />
        <br />
        <input
          className="formInput"
          type="password"
          onChange={function (e) {
            setPassword(e.target.value);
          }}
          placeholder="Enter password"
        />
        <br />
        <input className="submitButton" type="submit" onClick={submit} />
      </form>
    </div>
  );
};

export default LoginRight;

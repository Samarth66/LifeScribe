import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "../css/Journal.css";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const Journal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const journalEntries = useSelector((state) => state.journal.journalEntries);
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const id = location.state.id;

  useEffect(() => {
    console.log(journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  useEffect(() => {
    const userData = {
      id: "23134sad",
      name: "samarth",
    };
    dispatch({ type: "SET_USER_DETAILS", payload: userData });
  }, [dispatch]); // Move the dispatch call inside the useEffect hook

  async function addEntry(e) {
    const current = new Date().toLocaleDateString();

    e.preventDefault();

    dispatch({ type: "ADD_ENTRY", payload: title });

    try {
      await axios.post("http://localhost:8000/journal", {
        id,
        title,
        description,
        current,
      });
    } catch {
      console.log(e);
    }
  }

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar userid={id} />
      </div>
      <form className="JournalForm">
        <input
          type="text"
          className="journalInput"
          placeholder="Enter Title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          type="textArea"
          className="journalInput"
          placeholder="Why keep thoughts in your mind write it out"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <input className="submitButton" type="submit" onClick={addEntry} />
      </form>
    </div>
  );
};

export default Journal;

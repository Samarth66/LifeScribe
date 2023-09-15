import React, { useState, useEffect } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "../css/Journal.css";
import { useLocation, useNavigate } from "react-router-dom";
import ChatBot from "./ChatBot/ChatBot";
import ChatBotIcon from "../robot-solid.svg";
import rake from "rake-js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import { v4 as uuidv4 } from "uuid";

const Journal = () => {
  const [title, setTitle] = useState("");
  const [updateButton, setUpdateButton] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const journalEntries = useSelector((state) => state.journal.journalEntries);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const selectedJournalDetails = useSelector(
    (state) => state.journalDetails.selectedJournalDetails
  );
  const [showChatBot, setShowChatBot] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [showDialog, setShowDialog] = useState(true);
  const [prompt, setPrompt] = useState("");

  const toggleChatBot = () => {
    const wordlist = rake(description);
    const m = Math.min(3, wordlist.length);
    setKeywords(wordlist.slice(0, m));

    const keywordString = keywords.join(", ");
    console.log(wordlist, wordlist.slice(0, m), keywordString);
    setPrompt("In brief Tell me 5 books related to " + keywordString);

    setShowChatBot(!showChatBot);
  };
  useEffect(() => {
    console.log("Effect triggered due to selectedJournalDetails change");

    if (selectedJournalDetails.title) {
      console.log("Setting title and description");
      setTitle(selectedJournalDetails.title);
      setDescription(selectedJournalDetails.description);
      setUpdateButton(1);
    } else {
      console.log("Clearing title and description");
      setTitle("");
      setDescription("");
      console.log(selectedJournalDetails, title, description);
      //setUpdateButton(0);
    }
  }, [selectedJournalDetails]);

  useEffect(() => {
    if (updateButton == 0) {
      console.log("new entry");
    } else {
      console.log("update entry");
    }
  }, [updateButton]);

  const id = userDetails.id;
  console.log("id is", selectedJournalDetails);

  // Inside Journal.jsx
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/journal-entries",
          {
            params: { userId: id },
          }
        );
        dispatch({ type: "FETCH_JOURNAL_ENTRIES", payload: response.data });
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };

    fetchEntries();
  }, [dispatch, id]);

  const handleClearData = () => {
    setTitle("");
    setDescription("");
    setUpdateButton(0);
  };

  function formatDate(date) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);

    // Split the formatted date into day, month, and year parts
    const [month, day, year] = formattedDate.split(" ");

    // Convert the month abbreviation to uppercase
    const capitalizedMonth = month.toUpperCase();

    // Return the formatted date with uppercase month abbreviation and desired format
    return `${day} ${capitalizedMonth} ${year}`;
  }

  async function addEntry(e) {
    if (updateButton == 0) {
      const options = { day: "2-digit", month: "short", year: "numeric" };

      e.preventDefault();
      const date = new Date();
      const current = formatDate(date);
      console.log("date", current);
      try {
        const newEntry = await axios.post("http://localhost:8000/journal", {
          id,
          title,
          description,
          current,
        });

        const jEntry = {
          _id: newEntry.data[0]._id,
          title: newEntry.data[0].title,
          date: newEntry.data[0].date,
        };

        console.log("adding", jEntry);

        console.log("this will be added to redux", jEntry);

        dispatch({ type: "ADD_ENTRY", payload: jEntry });
      } catch {
        console.log(e);
      }
    } else {
      try {
        e.preventDefault();
        await axios.put("http://localhost:8000/journal-update", {
          journalId: selectedJournalDetails.id,
          updatedJournalDescription: description,
          updatedJournalTitle: title,
        });
      } catch (e) {
        console.log("unable to update", e);
      }
    }
  }

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="containerr">
        <div className="journalSidebar">
          <Sidebar onClearData={handleClearData} />
        </div>

        <div className="journalFormContainer">
          <form className="JournalForm">
            <input
              type="text"
              className="journalTitle"
              placeholder="Enter Title"
              value={title} // controlled value
              onChange={(event) => setTitle(event.target.value)}
            />

            <br />
            <textarea
              className="journalBody"
              placeholder="Writing is a journey to self-discovery"
              value={description} // controlled value
              onChange={(event) => setDescription(event.target.value)}
            />

            <br />
            <input
              className="submitButton journalSubmit"
              type="submit"
              onClick={addEntry}
              value="Add to journal"
            />
          </form>
          <div className="chat">
            <div className={`dialog-box ${showDialog ? "show" : ""}`}>
              Interested in discovering books and articles that align with your
              journal entries?
            </div>
            <div>
              <svg
                onClick={toggleChatBot}
                style={{ position: "fixed", bottom: "20px", right: "20px" }}
              >
                {<SmartToyOutlinedIcon />}
              </svg>
              {showChatBot && <ChatBot prompt={prompt} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;

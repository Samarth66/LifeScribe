import React, { useState, useEffect } from "react";

import Header from "../../header/Header";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./Journal.css";
import ChatBot from "../../ChatBot/ChatBot";
import { useSidebar } from "../../../SidebarContext";

import rake from "rake-js";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('userToken');

const Journal = () => {
  const [title, setTitle] = useState("");
  const [updateButton, setUpdateButton] = useState(0);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { showSidebar } = useSidebar();

  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const selectedJournalDetails = useSelector(
    (state) => state.journalDetails.selectedJournalDetails
  );
  const [showChatBot, setShowChatBot] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [prompt, setPrompt] = useState("");
  const gptMessage =
    "Please click on 'Send' to see books and articles related to your journal entry.";

  const toggleChatBot = () => {
    const wordlist = rake(description);

    const m = Math.min(3, wordlist.length);
    setKeywords(wordlist.slice(0, m));

    const keywordString = keywords.join(", ");

    setPrompt("In brief Tell me 5 books related to " + keywordString);

    setShowChatBot(!showChatBot);
  };
  useEffect(() => {
    if (selectedJournalDetails.title) {
      setTitle(selectedJournalDetails.title);
      setDescription(selectedJournalDetails.description);
      setUpdateButton(1);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [selectedJournalDetails]);

  const id = userDetails.id;

  const getIconSize = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      return "60px";
    } else {
      return "130px";
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          "https://lifescrive-backend.onrender.com/journal-entries",
          {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        
            params: { userId: id },
         
        }
          
        );
        setUpdateButton(0);

        dispatch({ type: "FETCH_JOURNAL_ENTRIES", payload: response.data });
      } catch (error) {
        console.log(error);
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

      try {
        const newEntry = await axios.post(`${apiBaseUrl}/journal`, {
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

        const jDetails = {
          id: newEntry.data[0]._id,
          title: newEntry.data[0].title,
          description: newEntry.data[0].description,
          date: newEntry.data[0].date,
        };

        dispatch({ type: "GET_JOURNAL_DETAILS", payload: jDetails });

        dispatch({ type: "ADD_ENTRY", payload: jEntry });
      } catch {
        console.log(e);
      }
    } else {
      try {
        e.preventDefault();
        await axios.put(`${apiBaseUrl}/journal-update`, {
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
        {showSidebar && (
          <div className="journalSidebar">
            <Sidebar onClearData={handleClearData} />
          </div>
        )}

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
            <div>
              <SmartToyOutlinedIcon
                onClick={toggleChatBot}
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  fontSize: getIconSize(),
                }}
              />
              {showChatBot && (
                <ChatBot prompt={prompt} gptMessage={gptMessage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;

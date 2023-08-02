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

  useEffect(() => {
    const journalBody = document.getElementById("journalBody");
    const journalTitle = document.getElementById("journalTitle");
    journalBody.value = selectedJournalDetails.description;
    journalTitle.value = selectedJournalDetails.title;
    setUpdateButton(1);
  }, [selectedJournalDetails]);

  useEffect(() => {
    if (updateButton == 0) {
      console.log("new entry");
    } else {
      console.log("update entry");
    }
  }, [updateButton]);

  const id = userDetails.id;

  useEffect(() => {}, [journalEntries]);

  useEffect(() => {
    // Fetch journal entries for the specific user ID when the component mounts
    console.log(journalEntries);

    dispatch(fetchJournalEntries(id));
  }, [dispatch, id]);

  const handleClearData = () => {
    const journalBody = document.getElementById("journalBody");
    const journalTitle = document.getElementById("journalTitle");
    journalBody.value = "";
    journalTitle.value = "";
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

  const fetchJournalEntries = (id) => async (dispatch) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/journal-entries",
        {
          params: { userId: id }, // Pass the user ID as a query parameter
        }
      );

      dispatch({ type: "FETCH_JOURNAL_ENTRIES", payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      fetchJournalEntries(id);
      <Header />
      <div className="containerr">
        <div className="journalSidebar">
          <Sidebar onClearData={handleClearData} />
        </div>
        <div className="journalFormContainer">
          <form className="JournalForm">
            <input
              type="text"
              className="journalTitle"
              id="journalTitle"
              placeholder="Enter Title"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <br />
            <textarea
              className="journalBody"
              id="journalBody"
              placeholder="Writing is a journey to self-discovery"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <br />
            <input
              className="submitButton journalSubmit"
              type="submit"
              onClick={addEntry}
              value="Add to journal"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Journal;

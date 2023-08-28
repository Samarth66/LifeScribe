import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import JournalEntry from "./JournalEntry";
import SidebarTitles from "./SidebarTitles";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ onClearData }) => {
  const [sideEntries, setSideEntries] = useState([]);
  const journalEntries = useSelector((state) => state.journal.journalEntries);

  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const handleNewEntryClick = () => {
    onClearData(); // Correctly calls the onClearData prop from the parent component
  };
  return (
    <div className="sidebar">
      <p className="name">
        {userDetails.name.charAt(0).toUpperCase() +
          userDetails.name.slice(1).toLowerCase()}
        's Journal
      </p>

      <input type="search" className="titleSearch" />
      <br />
      <button className="newEntry" onClick={handleNewEntryClick}>
        <b>New Entry</b>
      </button>
      <div className="entry">
        {journalEntries.map((entry) => (
          <SidebarTitles
            title={entry.title}
            date={entry.date}
            key={entry._id}
            id={entry._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

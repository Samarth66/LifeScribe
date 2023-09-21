import React from "react";
import "../../../css/Sidebar.css";

import JournalSidebarList from "./JournalSidebarList";
import { useSelector } from "react-redux";

const Sidebar = ({ onClearData }) => {
  const journalEntries = useSelector((state) => state.journal.journalEntries);

  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const handleNewEntryClick = () => {
    onClearData();
  };
  return (
    <div className="sidebar">
      <p className="name">
        {userDetails.name.charAt(0).toUpperCase() +
          userDetails.name.slice(1).toLowerCase()}
        's Journal
      </p>

      <button className="newEntry" onClick={handleNewEntryClick}>
        <b>New Entry</b>
      </button>
      <div className="entry">
        {journalEntries.map((entry) => (
          <JournalSidebarList
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

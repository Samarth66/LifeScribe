import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import JournalEntry from "./JournalEntry";

const Sidebar = (props) => {
  console.log("props", props.userid);

  const [sideEntries, setSideEntries] = useState([]);

  useEffect(() => {});

  return (
    <div>
      <div className="Sidebar">
        <p className="name">Name </p>
        <input type="search" className="searchBox" />
        <br />
        <button className="newEntry">New Entry</button>
        <h3>sidebar</h3>
      </div>
    </div>
  );
};

export default Sidebar;

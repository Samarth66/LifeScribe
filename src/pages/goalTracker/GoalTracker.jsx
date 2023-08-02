import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const GoalTracker = () => {
  return (
    <div>
      <Header />
      <div className="GoalTrackerBody"></div>
      <Sidebar />
    </div>
  );
};

export default GoalTracker;

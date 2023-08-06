import React, { useState } from "react";
import Header from "./Header";
import GoalTrackerSidebar from "./GoalTrackerSidebar";
import "../css/GoalTracker.css";
import { useDispatch, useSelector } from "react-redux";
import GoalLists from "./GoalLists";

const GoalTracker = () => {
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  return (
    <div>
      <div className="GoalTrackerBody">
        <div className="goalTrackerSidebar">
          <GoalTrackerSidebar />
        </div>
        <div className="lists">
          <GoalLists />
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;

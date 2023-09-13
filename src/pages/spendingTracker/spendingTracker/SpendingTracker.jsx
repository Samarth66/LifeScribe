import React from "react";
import Header from "../../Header";
import SpendingTrackerSidebar from "../sidebar/SpendingTrackerSidebar";
import SpendingTrackerBody from "../spendingTrackerBody/SpendingTrackerBody";
import "./spendingTracker.css";

function spendingTracker() {
  return (
    <div>
      <Header />
      <div className="spendingTracker">
        <div className="spendingTrackerSidebar">
          <SpendingTrackerSidebar />
        </div>
        <div className="spendingTrackerB">
          <SpendingTrackerBody />
        </div>
      </div>
    </div>
  );
}

export default spendingTracker;

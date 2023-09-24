import React from "react";
import Header from "../../header/Header";
import SpendingTrackerSidebar from "../sidebar/SpendingTrackerSidebar";
import SpendingTrackerBody from "../spendingTrackerBody/SpendingTrackerBody";
import "./spendingTracker.css";
import { useSidebar } from "../../../SidebarContext";

function SpendingTracker() {
  const { showSidebar } = useSidebar();
  return (
    <div>
      <Header />

      <div className="spendingTracker">
        {showSidebar && (
          <div className="spendingTrackerSidebar">
            <SpendingTrackerSidebar />
          </div>
        )}

        <div className="spendingTrackerB">
          <SpendingTrackerBody />
        </div>
      </div>
    </div>
  );
}

export default SpendingTracker;

import React from "react";
import Header from "../../header/Header";
import HealthTrackerSidebar from "../sidebar/HealthTrackerSidebar";
import { useSidebar } from "../../../SidebarContext";

import "./HealthTracker.css";
import HealthTrackerBody from "../HealthTrackerBody/HealthTrackerBody";
import { useDispatch } from "react-redux";

function HealthTracker() {
  const dispatch = useDispatch();
  const { showSidebar } = useSidebar();

  return (
    <div>
      <Header />

      <div className="HealthTracker">
        {showSidebar && (
          <div className="healthTrackerSidebar">
            <HealthTrackerSidebar />
          </div>
        )}
        <div className="CaloriesTracker">
          <HealthTrackerBody />
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;

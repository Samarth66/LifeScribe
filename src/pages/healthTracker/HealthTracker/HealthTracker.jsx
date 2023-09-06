import React from "react";
import Header from "../../Header";
import HealthTrackerSidebar from "../sidebar/HealthTrackerSidebar";

import "./HealthTracker.css";
import HealthTrackerBody from "../HealthTrackerBody/HealthTrackerBody";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function HealthTracker() {
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="HealthTracker">
        <div className="healthTrackerSidebar">
          <HealthTrackerSidebar />
        </div>
        <div className="CaloriesTracker">
          <HealthTrackerBody />
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;
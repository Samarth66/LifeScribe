import React, { useState } from "react";
import "../../../css/Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";

function HealthTrackerSidebar() {
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const healthDate = useSelector(
    (state) => state.selectedDateDetails.selectedDateDetails.date
  );

  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const dispatch = useDispatch();

  const handleDateClick = (date) => {
    if (date > new Date()) {
      return;
    }

    setSelectedDate(date);
    const isoDateString = date.toISOString().split("T")[0];
    // Convert Date to ISO string
    dispatch({ type: "SELECTED_DATE_DETAIL", payload: isoDateString });
  };

  useEffect(() => {
    handleDateClick(selectedDate);
  }, []);

  const maxSelectableDate = new Date();
  maxSelectableDate.setHours(0, 0, 0, 0);

  return (
    <div className="sidebar-spending">
      <p className="name">
        {userDetails.name.charAt(0).toUpperCase() +
          userDetails.name.slice(1).toLowerCase()}
        's Health Tracker
      </p>

      <br />

      <div className="calendar">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          maxDate={maxSelectableDate}
        />
      </div>

      <div className="entry">{/* Add content here */}</div>
    </div>
  );
}

export default HealthTrackerSidebar;

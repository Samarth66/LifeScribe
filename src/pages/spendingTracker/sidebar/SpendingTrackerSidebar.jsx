import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../css/Sidebar.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function SpendingTrackerSidebar() {
  // Define a state variable to store the selected spending date
  const [selectedSpendingDate, setSelectedSpendingDate] = useState(null);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const SpendingDate = useSelector(
    (state) =>
      state.selectedSpendingDateDetails.selectedSpendingDateDetails.date
  );

  const dispatch = useDispatch();

  const handleDateClick = (date) => {
    // Check if the clicked date is in the future
    if (date > new Date()) {
      return;
    }

    // Format the selected date as a string in the desired format "YYYY-MM-DD"
    const formattedDate = date.toISOString().split("T")[0];

    // Store the selected date in the state variable
    setSelectedSpendingDate(formattedDate);
    dispatch({ type: "SELECTED_SPENDING_DATE_DETAIL", payload: formattedDate });
  };

  useEffect(() => {
    console.log("s", SpendingDate);
  }, [SpendingDate]);

  return (
    <div className="sidebar-spending">
      {/* Render the calendar */}
      <p className="name">
        {userDetails.name.charAt(0).toUpperCase() +
          userDetails.name.slice(1).toLowerCase()}
        's Spending Trakcer
      </p>
      <div className="calendar">
        <Calendar
          onClickDay={handleDateClick}
          // Set the value prop to the selected spending date if you want to preselect a date
        />
      </div>
      {/* Display the selected spending date */}

      <div className="entry">
        {/* You can add additional content or components related to your spending tracker here */}
      </div>
    </div>
  );
}

export default SpendingTrackerSidebar;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // Import Axios
import MealComponent from "../Meals/MealComponent";
import HealthCharts from "../healthCharts/HealthCharts";
import "./HealthTrackerBody.css";
import socket from "../../socket";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatBot from "../../ChatBot/ChatBot";

const HealthTrackerBody = () => {
  const dispatch = useDispatch();
  const healthDate = useSelector(
    (state) => state.selectedDateDetails.selectedDateDetails.date
  );
  const healthId = useSelector(
    (state) => state.selectedIdDetails.selectedIdDetails.id
  );
  const [mealUpdated, setMealUpdated] = useState(false);

  const [entry, setEntry] = useState(null);
  const [chartData, setChartData] = useState(null);
  const user = useSelector((state) => state.userDetails.userDetails);
  const userDetails = user.id;
  const [showDialog, setShowDialog] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);

  // useEffect(() => {
  //console.log("is it working?");
  //dispatch({ type: "SELECTED_DATE_DETAIL", payload: "" });
  // console.log("after", healthDate);
  //}, [healthDate]);
  useEffect(() => {
    if (healthDate) {
      //console.log("automatic", userDetails, healthDate);
      console.log("in healthbody");
      fetchEntryForDate(userDetails, healthDate);
    }
    socket.on("meal-updated", () => {
      fetchEntryForDate(userDetails, healthDate);
      console.log("received from socket");
    });

    return () => {
      socket.off("meal-updated");
    };
  }, [healthDate]);

  const fetchEntryForDate = async (userId, date) => {
    try {
      console.log(userDetails, healthDate);
      const response = await axios.post("http://localhost:8000/fetch-lists", {
        userDetails,
        healthDate,
      });

      if (response.status === 200) {
        const entryData = response.data;
        console.log("fetched Data", entryData);

        if (!entryData) {
          await createEntryForDate(userDetails, healthDate);
        } else {
          setEntry(entryData);
          setChartData(entryData.meals.total);
          dispatch({ type: "SELECTED_HEALTH_ID", payload: response.data._id });
          console.log(
            "REsponse",
            entryData,
            "health",
            healthId,
            "Total",
            chartData
          );
        }
      } else {
        console.error("Error fetching entry for date:", response.status);
      }
    } catch (error) {
      console.error("Error fetching entry for date:", error);
    }
  };

  const createEntryForDate = async (userId, date) => {
    try {
      const dataToSend = {
        userId: userId,
        date: date, // Send the date directly as 'date'
      };
      const response = await axios.post("http://localhost:8000/create-entry", {
        dataToSend,
      });

      if (response.status == 200) {
        const entryData = response.data;
        console.log("created entry data", entryData);
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [arrowDirection, setArrowDirection] = useState(null);
  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);

    if (direction === "left") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (direction === "right") {
      newDate.setDate(newDate.getDate() + 1);
    }

    setSelectedDate(newDate);
  };

  const handleLeftArrowClick = () => {
    setArrowDirection("left");
    handleDateChange("left");
  };

  const handleRightArrowClick = () => {
    setArrowDirection("right");
    handleDateChange("right");
  };
  const formattedDate = new Date(healthDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Set the time zone to UTC
  });

  const toggleChatBot = () => {
    const mealsData = entry.meals;

    // Convert the mealsData object into a string
    let mealsString =
      "Consider yourself as a nutritionist. In brief in less than 250 words, tell me the adjustments and recommendations for your diet:\n\n";

    // Iterate through the meal categories
    for (const mealCategory in mealsData) {
      if (mealsData.hasOwnProperty(mealCategory)) {
        mealsString += mealCategory + ":\n";

        // Access properties within each meal category
        const mealCategoryData = mealsData[mealCategory];

        for (const mealName in mealCategoryData) {
          if (mealCategoryData.hasOwnProperty(mealName)) {
            const meal = mealCategoryData[mealName];
            mealsString += `${mealName}, Protein: ${meal.protein}, Energy: ${meal.energy}, Carbohydrates: ${meal.carbohydrates}, Fats: ${meal.fats}, Sugar: ${meal.sugar}\n`;
          }
        }
      }
    }

    // Add the total nutritional data
    mealsString += "\nTotal callories of the dat:\n";
    mealsString += `protein: ${mealsData.total.protein}, energy: ${mealsData.total.energy}, carbohydrates: ${mealsData.total.carbohydrates}, fats: ${mealsData.total.fats}, sugar: ${mealsData.total.sugar}\n`;

    // Now you can set the formatted string as the prompt
    setPrompt(mealsString);

    setShowChatBot(!showChatBot);
  };

  return (
    <div>
      <div className="selected-date">
        <p>Selected Date: {formattedDate}</p>
      </div>
      <div className="healthTrackerBodyy">
        {console.log("stopppppp", healthDate)}
        <div className="healthMeals">
          {entry && (
            <div className="healthMeal">
              <MealComponent title="breakfast" meals={entry.meals.breakfast} />
              <MealComponent title="lunch" meals={entry.meals.lunch} />
              <MealComponent title="dinner" meals={entry.meals.dinner} />
            </div>
          )}
        </div>
        <div className="healthCharts">
          {entry && (
            <HealthCharts
              totalValues={chartData}
              total={entry.meals.total["energy"]}
            />
          )}
        </div>
      </div>
      <div>
        <svg
          onClick={toggleChatBot}
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
        >
          {<SmartToyOutlinedIcon />}
        </svg>
        {showChatBot && <ChatBot prompt={prompt} />}
      </div>
    </div>
  );
};

export default HealthTrackerBody;

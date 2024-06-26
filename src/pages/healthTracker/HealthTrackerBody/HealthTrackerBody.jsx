import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // Import Axios
import MealComponent from "../Meals/MealComponent";
import HealthCharts from "../healthCharts/HealthCharts";
import "./HealthTrackerBody.css";
import socket from "../../socket";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatBot from "../../ChatBot/ChatBot";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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
  const gptMessage =
    "Click 'Send' to discover dietary modifications and receive recommendations.";

  useEffect(() => {
    if (healthDate) {
      fetchEntryForDate(userDetails, healthDate);
    }
    socket.on("meal-updated", () => {
      fetchEntryForDate(userDetails, healthDate);
    });

    return () => {
      socket.off("meal-updated");
    };
  }, [healthDate]);

  const getIconSize = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      return "60px";
    } else {
      return "130px";
    }
  };

  const fetchEntryForDate = async (userId, date) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/fetch-lists`, {
        userDetails,
        healthDate,
      });

      if (response.status === 200) {
        let entryData = response.data;

        if (!entryData) {
          await createEntryForDate(userDetails, healthDate);

          // After creating, fetch the new entry
          const newEntryResponse = await axios.post(
            `${apiBaseUrl}/fetch-lists`,
            {
              userDetails,
              healthDate,
            }
          );

          // Update the entryData with the newly fetched entry
          entryData = newEntryResponse.data;
        }

        // Check again if we got the entry (either initially or after creating & fetching)
        if (entryData) {
          setEntry(entryData);
          setChartData(entryData.meals.total);
          dispatch({ type: "SELECTED_HEALTH_ID", payload: entryData._id });
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
      const response = await axios.post(`${apiBaseUrl}/create-entry`, {
        dataToSend,
      });

      if (response.status == 200) {
        const entryData = response.data;
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
    const mealsData = entry?.meals;

    // Convert the mealsData object into a string
    let mealsString =
      "Imagine yourself as a nutrition expert. In a concise response of fewer than 250 words, outline the dietary modifications and suggestions you would propose for my diet:\n\n";

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
        <div className="healthMeals">
          {entry && entry.meals && (
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
        <SmartToyOutlinedIcon
          onClick={toggleChatBot}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontSize: getIconSize(),
          }}
        />

        {showChatBot && <ChatBot prompt={prompt} gptMessage={gptMessage} />}
      </div>
    </div>
  );
};

export default HealthTrackerBody;

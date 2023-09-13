import React, { useEffect, useState } from "react";
import "./MealComponent.css"; // Import your CSS file
import AddIcon from "@mui/icons-material/Add";
import OverlayBox from "../Overlay/OverlayBox";
import axios from "axios";
import { useSelector } from "react-redux";
import FoodList from "../healthTrackerFoodList/FoodList";
import Chart from "chart.js/auto";

const MealComponent = ({ title, meals }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const healthId = useSelector(
    (state) => state.selectedIdDetails.selectedIdDetails.id
  );

  console.log("mealdata from above", meals);

  const [mealData, setMealData] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch-meal", {
        params: { healthId },
      });
      const data = response.data;
      console.log("got data?,", data);
      setMealData(data);
    } catch (e) {
      console.log("fetching failed ", e);
    }
  };

  const openOverlay = () => {
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  const handleReload = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const calculateTotalEnergy = () => {
    let totalEnergy = 0;
    if (meals) {
      // Check both mealData and mealData[title]
      meals.forEach((foodItem) => {
        totalEnergy += foodItem.energy || 0;
      });
      console.log("totalenrgy", totalEnergy);
    }
    return totalEnergy;
  };

  //useEffect(() => {
  //  fetchFoodList();
  //}, [healthId, reloadKey]);

  return (
    <div className="meal-card">
      <div className="mealHead">
        <h2>{title.toUpperCase()} </h2>

        <AddIcon onClick={openOverlay} />
      </div>
      {
        <div className="totalEnergy">
          <h5>Total Calories: {calculateTotalEnergy()} kcal</h5>
        </div>
      }

      <OverlayBox
        isVisible={isOverlayVisible}
        onClose={() => {
          closeOverlay();
          handleReload();
        }}
        mealTitle={title}
        onSearch={(food) => {
          const apiKey = "fkl0GhEvo5Fcd4opKmp2ej4bnPOkaPExKc9I103y";

          const apiUrl = `https://api.nal.usda.gov/fdc/v1/search?api_key=${apiKey}&query=${food}`;

          return fetch(apiUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              const searchResults = data.foods || [];
              const topResults = searchResults.slice(0, 10);
              console.log(topResults);
              return topResults;
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              return [];
            });
        }}
      />
      {console.log("test", mealData[title])}

      {meals &&
        meals.map((foodItem) => {
          console.log("foodItem:", foodItem);
          return (
            <FoodList
              key={foodItem.foodId}
              foodData={foodItem.energy}
              foodName={foodItem.foodName}
            />
          );
        })}
    </div>
  );
};

export default MealComponent;

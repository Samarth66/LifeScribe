import React, { useState, useEffect } from "react";
import "./OverlayBox.css";
import axios from "axios";
import { useSelector } from "react-redux";

const OverlayBox = ({
  isVisible,
  onClose,
  onSearch,

  mealTitle,
}) => {
  const [food, setFood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const user = useSelector((state) => state.userDetails.userDetails);

  const userDetails = user.id;
  const healthDate = useSelector(
    (state) => state.selectedDateDetails.selectedDateDetails.date
  );

  const handleInputChange = (e) => {
    setFood(e.target.value);
  };

  const handleSearch = () => {
    setIsLoading(true);

    onSearch(food)
      .then((results) => {
        setSearchResults(results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error searching for food:", error);
        setIsLoading(false);
      });
  };

  const handleAdd = async (result) => {
    try {
      const { foodNutrients, description, fdcId } = result;
      const nutrientData = {
        foodName: description,
        foodId: fdcId,
        protein: null,
        energy: null,
        carbohydrates: null,
        fats: null,
        sugar: null,
      };

      foodNutrients.forEach((nutrient) => {
        switch (nutrient.nutrientName) {
          case "Protein":
            nutrientData.protein = nutrient.value;
            break;
          case "Energy":
            nutrientData.energy = nutrient.value;
            break;
          case "Carbohydrate, by difference":
            nutrientData.carbohydrates = nutrient.value;
            break;
          case "Total lipid (fat)":
            nutrientData.fats = nutrient.value;
            break;
          case "Sugars, total including NLEA":
            nutrientData.sugar = nutrient.value;
            break;
        }
      });

      const mealData = {
        userId: userDetails,
        date: healthDate,
        mealType: mealTitle,
        description: description,
        fdcId: fdcId,

        nutrientData: nutrientData,
      };

      const response = await axios.post(
        "http://localhost:8000/add-meal",
        mealData
      );

      console.log("Meal added successfully:", response.data);

      setSearchResults([]);
      setFood("");
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setFood("");
    }
  }, [isVisible]);

  const handleClose = () => {
    setSearchResults([]);
    onClose();
  };

  return isVisible ? (
    <div className="overlay-box">
      <div className="overlay-content">
        <h2>Add Your Meals</h2>
        <input
          type="text"
          placeholder="Enter food name"
          value={food}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>

        {isLoading ? <div className="loading-indicator">Loading...</div> : null}

        {searchResults.length > 0 && !isLoading ? (
          <div className="search-results">
            <h3>Search Results</h3>
            <ul>
              {searchResults.slice(0, 10).map((result) => (
                <li key={result.fdcId}>
                  <strong>{result.description}</strong>
                  <button onClick={() => handleAdd(result)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default OverlayBox;

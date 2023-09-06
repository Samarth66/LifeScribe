import React from "react";
import "./FoodList.css";

const FoodList = (props) => {
  return (
    <div className="food-list">
      <div className="food-card">
        <h3>{props.foodName}</h3>
        <p>
          <strong>Energy:</strong> {props.foodData.energy}
        </p>
      </div>
    </div>
  );
};

export default FoodList;

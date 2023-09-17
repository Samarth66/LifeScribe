import React from "react";
import "./FoodList.css";
import DeleteIcon from "@mui/icons-material/Delete";

const FoodList = (props) => {
  const handleDelete = () => {
    props.onDelete(props.foodName, props.foodId);
  };

  return (
    <div className="food-list">
      <div className="food-card">
        <h3>{props.foodName}</h3>
        <p>
          <strong>Energy:</strong> {props.foodData}
        </p>
        <DeleteIcon onClick={handleDelete} />
      </div>
    </div>
  );
};

export default FoodList;

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
        <div>
          <h3>
            <strong>{props.foodName}</strong>{" "}
          </h3>
          <p>Energy:{props.foodData}</p>
        </div>
        <>
          <DeleteIcon onClick={handleDelete} />
        </>
      </div>
    </div>
  );
};

export default FoodList;

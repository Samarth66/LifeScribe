import React from "react";
import "../css/GoalList.css";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

function GoalLists() {
  function addCard() {}

  const [showInput, setShowInput] = useState(false);

  function handleCardTitleChange(event) {
    setShowInput(true);
  }
  function handleCardTitleChangeF(event) {
    setShowInput(false);
  }
  return (
    <div className="list">
      <div className="listBody">
        <p className="listName">
          <b>Name</b>
        </p>
        {showInput ? (
          <>
            <input
              type="text"
              name="textBox"
              placeholder="enter item"
              className="enterItem"
            />
            <button className="button" onClick={handleCardTitleChangeF}>
              Save Item
            </button>
          </>
        ) : (
          <button className="button" onClick={handleCardTitleChange}>
            <AddIcon /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}

export default GoalLists;

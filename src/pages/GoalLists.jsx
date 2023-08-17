import React, { useEffect } from "react";
import "../css/GoalList.css";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import axios from "axios";
import Card from "./Card";

function GoalLists(props) {
  function addCard() {}

  const [showInput, setShowInput] = useState(false);
  const [cardName, setCardName] = useState("");
  const listId = props.id;

  function handleCardTitleChange(event) {
    setShowInput(true);
  }
  async function handleCardTitleChangeF(event) {
    setShowInput(false);
    try {
      const title = cardName;
      event.preventDefault();
      await axios.post("http://localhost:8000/add-card", {
        title,
        listId,
      });
    } catch {
      console.log("not able");
    }
  }

  return (
    <div className="list">
      <div className="listBody">
        <p className="listName">
          <b>{props.listName}</b>
        </p>
        <Card />
        {showInput ? (
          <>
            <input
              type="text"
              name="textBox"
              placeholder="enter item"
              className="enterItem"
              onChange={(e) => {
                setCardName(e.target.value);
              }}
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

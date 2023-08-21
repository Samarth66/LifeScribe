import React, { useEffect } from "react";
import "../css/GoalList.css";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import axios from "axios";
import Card from "./Card";
import socket from "./socket";

function GoalLists(props) {
  const [showInput, setShowInput] = useState(false);
  const [cardName, setCardName] = useState("");
  const listId = props.id;
  const [fetchedCards, setFetchedCards] = useState([]);

  useEffect(() => {
    // Log a message when the socket is connected

    socket.on("cardDeleted", () => {
      console.log("card gone");
    });

    return () => socket.disconnect();
  }, []);

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
      fetchCards();
    } catch {
      console.log("not able");
    }
  }

  async function fetchCards() {
    const response = await axios.get("http://localhost:8000/fetch-cards", {
      params: { listId: listId },
    });
    setFetchedCards(response.data);
  }

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <div className="list">
      <div className="listBody">
        <p className="listName">
          <b>{props.listName}</b>
        </p>

        {fetchedCards.map((data) => (
          <Card
            title={data.title}
            key={data._id}
            id={data._id}
            listId={props.id}
          />
        ))}

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

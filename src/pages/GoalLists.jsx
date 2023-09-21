import React, { useEffect } from "react";
import "../css/GoalList.css";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import axios from "axios";
import Card from "./Card";
import socket from "./socket";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Import the components
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function GoalLists(props) {
  const [showInput, setShowInput] = useState(false);
  const [cardName, setCardName] = useState("");
  const listId = props.id;
  const [fetchedCards, setFetchedCards] = useState([]);

  useEffect(() => {
    fetchCards();
  }, [props.forceUpdate]);
  useEffect(() => {
    fetchCards();
    socket.on("cardDeleted", () => {
      console.log("received deleteion confirmation");
      fetchCards();
    });

    return () => {
      socket.off("cardDeleted", handleCardDeleted);
    };
  }, []);

  const handleCardDeleted = () => {
    console.log("card gone");
  };

  function handleCardTitleChange(event) {
    setShowInput(true);
  }
  async function handleCardTitleChangeF(event) {
    setShowInput(false);
    try {
      const title = cardName;
      event.preventDefault();
      await axios.post(`${apiBaseUrl}/add-card`, {
        title,
        listId,
      });
      fetchCards();
    } catch {
      console.log("not able");
    }
  }

  async function fetchCards() {
    const response = await axios.get(`${apiBaseUrl}/fetch-cards`, {
      params: { listId: listId },
    });
    setFetchedCards(response.data);
  }

  return (
    <div>
      <div className="list">
        <div className="listBody">
          <p className="listName">
            <b>{props.listName}</b>
          </p>
          <Droppable droppableId={listId.toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="cardsContainer"
              >
                {fetchedCards.map((data, index) => (
                  <Draggable
                    key={data._id}
                    draggableId={data._id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card title={data.title} id={data._id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

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
    </div>
  );
}

export default GoalLists;

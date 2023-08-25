import React, { useEffect, useState } from "react";

import GoalTrackerSidebar from "./GoalTrackerSidebar";
import "../css/GoalTracker.css";
import { useDispatch, useSelector } from "react-redux";
import GoalLists from "./GoalLists";
import axios from "axios";
import socket from "./socket";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GoalTracker = () => {
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const dispatch = useDispatch();
  const boardEntries = useSelector((state) => state.board.boardEntries);
  const selectedBoardDetails = useSelector((state) => state.boardDetails.board);
  const [fetchedList, setFetchedList] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [cardEntries, setCardEntries] = useState([]);

  /* useEffect(() => {
    // Log a message when the socket is connected

    socket.on("cardDeleted", () => {
      fetchData();
    });

    return () => socket.disconnect();
  }, []);
  */

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch-lists", {
        params: {
          boardId: selectedBoardDetails.boardId,
        },
      });
      setCardEntries(response.data);
      setFetchedList(response.data);
      console.log(response.data, "response");
    } catch {
      console.log("not able to retrieve anything");
    }
  };

  useEffect(() => {
    console.log("this is the selected board", selectedBoardDetails);
    fetchData();
  }, [selectedBoardDetails]);

  const handleDragEnd = async (result) => {
    console.log("Drag result:", result);

    const cardId = result.draggableId;
    const newParentListId = result.destination.droppableId;
    console.log(cardId, newParentListId);

    try {
      await axios.post("http://localhost:8000/update-cards", {
        cardId,
        newParentListId,
      });
      setForceUpdate((prevState) => !prevState);
    } catch {
      console.log("update card details");
    }

    if (!result.destination) {
      return;
    }

    // Rest of your handling logic
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="GoalTrackerBody">
        <div className="goalTrackerSidebar">
          <GoalTrackerSidebar />
        </div>

        <div className="lists">
          {fetchedList.map((data) => (
            <Droppable droppableId={data._id.toString()} key={data._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="list"
                >
                  <GoalLists
                    listName={data.title}
                    id={data._id}
                    provided={provided}
                    forceUpdate={forceUpdate}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default GoalTracker;

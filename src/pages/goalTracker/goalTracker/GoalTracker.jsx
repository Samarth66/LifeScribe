import React, { useEffect, useState } from "react";

import GoalTrackerSidebar from "../goalTrackerSidebar/GoalTrackerSidebar";
import "./GoalTracker.css";
import { useDispatch, useSelector } from "react-redux";
import GoalLists from "../goalList/GoalLists";
import axios from "axios";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatBot from "../../ChatBot/ChatBot";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const GoalTracker = () => {
  const selectedBoardDetails = useSelector((state) => state.boardDetails.board);

  const [fetchedList, setFetchedList] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [showChatBot, setShowChatBot] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [listData, setListData] = useState({});

  /* useEffect(() => {
    // Log a message when the socket is connected

    socket.on("cardDeleted", () => {
      fetchData();
    });

    return () => socket.disconnect();
  }, []);
  */
  const gptMessage =
    "Kindly select 'send' to receive a personalized schedule to complete tasks";

  const toggleChatBot = () => {
    fetchData();
    const formattedListData = Object.entries(listData)
      .map(([listName, cardNames]) => {
        return `${listName}: ${cardNames}`;
      })
      .join("\n");

    const s =
      "Assist me in structuring my day for optimal task completion." +
      formattedListData;

    // Initialize the spendingPrompt variable
    setPrompt(s);

    setShowChatBot(!showChatBot);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/fetch-lists`, {
        params: {
          boardId: selectedBoardDetails.boardId,
        },
      });

      setFetchedList(response.data);

      await Promise.all(
        response.data.map(async (list) => {
          const cards = await axios.get(`${apiBaseUrl}fetch-cards`, {
            params: {
              listId: list._id,
            },
          });

          // Extract card titles
          const cardNames = cards.data.map((card) => card.title);

          // Store list name and associated card names in the format "listname=cardnames"
          setListData((prevData) => ({
            ...prevData,
            [list.title]: cardNames.join(","),
          }));

          return list;
        })
      );

      // Now listData in the component's state contains the desired format
    } catch {
      console.log("Not able to retrieve anything");
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBoardDetails]);

  const handleDragEnd = async (result) => {
    const cardId = result.draggableId;
    const newParentListId = result.destination.droppableId;

    try {
      await axios.post(`${apiBaseUrl}/update-cards`, {
        cardId,
        newParentListId,
      });
      setForceUpdate((prevState) => !prevState);
    } catch {
      console.log("update card details failed");
    }

    if (!result.destination) {
      return;
    }

    // Rest of your handling logic
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="GoalTrackerBody">
        <div className="goalTrackerSidebar journalSidebar">
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
        <div>
          <svg
            onClick={toggleChatBot}
            style={{ position: "fixed", bottom: "20px", right: "20px" }}
          >
            {<SmartToyOutlinedIcon />}
          </svg>
          {showChatBot && <ChatBot prompt={prompt} gptMessage={gptMessage} />}
        </div>
      </div>
    </DragDropContext>
  );
};

export default GoalTracker;

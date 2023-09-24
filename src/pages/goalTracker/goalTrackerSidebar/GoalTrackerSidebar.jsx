import React, { useEffect, useState } from "react";

import "../../../css/Sidebar.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BoardItems from "../sidebarBoardList/BoardItems";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function GoalTrackerSidebar() {
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const [showInput, setShowInput] = useState(false);
  const [boardName, setBoardsName] = useState("");
  const dispatch = useDispatch();
  const boardEntries = useSelector((state) => state.board.boardEntries);

  const id = userDetails.id;

  const fetchBoardEntries = (id) => async (dispatch) => {
    try {
      const entries = await axios.get(`${apiBaseUrl}/fetch-sidebar`, {
        params: { userId: id }, // Pass the user ID as a query parameter
      });
      const bentry = entries.data;
      dispatch({
        type: "FETCH_BOAD_ENTRIES",
        payload: bentry,
      });
    } catch (e) {
      console.log("cannot fetch board entries", e);
    }
  };
  useEffect(() => {
    dispatch(fetchBoardEntries(id));
  }, [dispatch, id]);

  function show() {
    setShowInput(true);
  }
  async function hideshow(e) {
    e.preventDefault();

    try {
      const boardEntry = await axios.post(`${apiBaseUrl}/goal-sidebar-board`, {
        userId: id,
        title: boardName,
      });

      dispatch({ type: "ADD_BOARD_ENTRIES", payload: boardEntry.data });
    } catch (e) {
      console.log("cannot enter board to collection", e);
    }
    setShowInput(false);
  }

  return (
    <div>
      <div className="sidebar">
        <p className="name">
          {userDetails.name.charAt(0).toUpperCase() +
            userDetails.name.slice(1).toLowerCase()}
          's Goal Tracker
        </p>

        <button className="newEntry" onClick={show}>
          <b>Add a board</b>
        </button>
        {showInput ? (
          <div className="createBoard">
            <p className="newBoard">create a new board</p>
            <input
              className="boardInput"
              type="text"
              onChange={(event) => {
                setBoardsName(event.target.value);
              }}
            ></input>
            <button className="boardButton" onClick={hideshow}>
              Add Board
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className="entry">
          {boardEntries.map((board, index) => (
            <BoardItems key={board._id} id={board._id} title={board.title} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GoalTrackerSidebar;

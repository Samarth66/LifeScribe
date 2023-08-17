import React from "react";
import "../css/BoardItems.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

function BoardItems(props) {
  const dispatch = useDispatch();
  const selectedBoardDetails = useSelector((state) => state.boardDetails.board);
  const boardEntries = useSelector((state) => state.board.boardEntries);

  useEffect(() => {}, [selectedBoardDetails]);
  function handleClick() {
    const jentry = {
      _id: props.id,
      title: props.title,
    };

    dispatch({ type: "SELECTED_JOURNAL_DETAIL", payload: jentry });

    console.log("board", selectedBoardDetails, props);
  }
  return (
    <div className="goalSidebarBlock" onClick={handleClick}>
      <p>{props.title}</p>
    </div>
  );
}

export default BoardItems;

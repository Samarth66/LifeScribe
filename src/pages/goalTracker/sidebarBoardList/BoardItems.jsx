import React, { useState } from "react";
import "./BoardItems.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function BoardItems(props) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userDetails.userDetails).id;

  const [anchorEl, setAnchorEl] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleClick = () => {
    const jentry = {
      _id: props.id,
      title: props.title,
    };

    dispatch({ type: "SELECTED_BOARD_DETAIL", payload: jentry });
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/delete-board-entry`, {
        params: { boardId: props.id, userId: userId },
      });

      dispatch({ type: "DELETE_BOARD_ENTRY", payload: props.id });
      dispatch({ type: "RESET_SELECTED_BOARD_DETAILS" });
    } catch (error) {
      console.log("failed to delete board entry", error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="goalSidebarBlock" onClick={handleClick}>
      <div className="boardTitle">
        <p>{props.title}</p>
      </div>
      <div className="options" onClick={handleMenuClick}>
        <MoreVertIcon className="threeDots" />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon className="deleteButton" />
          Delete
        </MenuItem>
        {/* Add more menu items as needed */}
      </Menu>
    </div>
  );
}

export default BoardItems;

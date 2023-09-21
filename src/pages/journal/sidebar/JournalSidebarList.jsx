import React, { useState } from "react";
import "./SidebarTitles.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const SidebarTitles = (props) => {
  const user = useSelector((state) => state.userDetails.userDetails);
  const userId = user.id;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const selectedJournalDetails = useSelector(
    (state) => state.journalDetails.selectedJournalDetails
  );

  const handleClick = () => {
    const currentId = props.id;
    fetchSelectedJournalDetails(currentId, dispatch);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    handleMenuClose();
    // Add your delete logic here. For example:
    try {
      await axios.delete(`${apiBaseUrl}/delete-journal-entry`, {
        params: {
          postId: props.id,
          userId: userId,
        },
      });
      // Dispatch an action to update the state or re-fetch data
      dispatch({ type: "DELETE_JOURNAL_ENTRY", payload: props.id });
      dispatch({ type: "RESET_SELECTED_JOURNAL_DETAILS" });
    } catch (error) {
   
    }
  };

  const fetchSelectedJournalDetails = async (id, dispatch) => {
    try {
      const resp = await axios.get(`${apiBaseUrl}/selected-journal-entry`, {
        params: {
          postId: id,
        },
      });

    

      const jDetails = {
        id: resp.data[0]._id,
        title: resp.data[0].title,
        description: resp.data[0].description,
        date: resp.data[0].date,
      };

      dispatch({ type: "GET_JOURNAL_DETAILS", payload: jDetails });
    } catch (error) {
      console.log("cannot fetch journal entry", error);
    }
  };

  return (
    <div className="sidebarBlock" onClick={handleClick}>
      <div className="sidebarTitles">
        <p className="title">{props.title}</p>
        <p className="date">{props.date}</p>
      </div>
      <MoreVertIcon className="threeDots" onClick={handleMenuClick} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default SidebarTitles;

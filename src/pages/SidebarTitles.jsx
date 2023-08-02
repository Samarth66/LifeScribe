import React from "react";
import "../css/SidebarTitles.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const SidebarTitles = (props) => {
  const dispatch = useDispatch();
  const selectedJournalDetails = useSelector(
    (state) => state.journalDetails.selectedJournalDetails
  );

  const handleClick = () => {
    const currentId = props.id;
    console.log("current id", props.id, props.title);

    fetchSelectedJournalDetails(currentId, dispatch);
  };

  const fetchSelectedJournalDetails = async (id, dispatch) => {
    try {
      const resp = await axios.get(
        "http://localhost:8000/selected-journal-entry",
        {
          params: {
            postId: id,
          },
        }
      );

      console.log("fetched", resp.data);

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
      <MoreVertIcon className="threeDots"></MoreVertIcon>
    </div>
  );
};

export default SidebarTitles;

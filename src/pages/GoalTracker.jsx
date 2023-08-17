import React, { useEffect, useState } from "react";
import Header from "./Header";
import GoalTrackerSidebar from "./GoalTrackerSidebar";
import "../css/GoalTracker.css";
import { useDispatch, useSelector } from "react-redux";
import GoalLists from "./GoalLists";
import axios from "axios";

const GoalTracker = () => {
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const dispatch = useDispatch();
  const boardEntries = useSelector((state) => state.board.boardEntries);
  const selectedBoardDetails = useSelector((state) => state.boardDetails.board);
  const [fetchedList, setFetchedList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch-lists", {
        params: {
          boardId: selectedBoardDetails.boardId,
        },
      });

      setFetchedList(response.data);
      console.log(fetchedList);
    } catch {
      console.log("not able to retrieve anything");
    }
  };

  useEffect(() => {
    console.log("this is the selected board", selectedBoardDetails);
    fetchData();
  }, [selectedBoardDetails]);

  return (
    <div>
      <div className="GoalTrackerBody">
        <div className="goalTrackerSidebar">
          <GoalTrackerSidebar />
        </div>

        <div className="lists">
          {fetchedList.map((data) => (
            <GoalLists listName={data.title} id={data._id} key={data._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;

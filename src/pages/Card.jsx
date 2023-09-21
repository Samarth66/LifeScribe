import React from "react";
import "../css/Card.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSelector } from "react-redux";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
function Card(props) {
  const userId = useSelector((state) => state.userDetails.userDetails).id;

  const deleteCard = async () => {
    axios
      .delete(`${apiBaseUrl}/delete-cards`, {
        params: {
          id: props.id,
          userId: userId,
        },
      })
      .then((response) => {
        console.log("card deleted succesfully");
      })
      .catch((error) => {
        console.log("card deletetion failed");
      });
  };
  return (
    <div className="cards">
      <p>{props.title}</p>
      <DeleteIcon
        onClick={() => {
          deleteCard();
        }}
      />
    </div>
  );
}

export default Card;

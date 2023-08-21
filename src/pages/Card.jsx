import React from "react";
import "../css/Card.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function Card(props) {
  const deleteCard = async () => {
    console.log(props);
    axios
      .delete("http://localhost:8000/delete-cards", {
        params: {
          id: props.id,
        },
      })
      .then((response) => {
        console.log("card deleted succesfully");
      })
      .catch((error) => {
        console.log("sda dsa");
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

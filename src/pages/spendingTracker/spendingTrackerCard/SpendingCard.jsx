import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "./SpendingCard.css";

const SpendingCard = (props) => {
  const { index, name, id, category, amount, handleDeleteTransaction } = props; // add handleDeleteTransaction

  return (
    <div className="transaction-card">
      <div className="cardHeading">
        <h3>Transaction: {index + 1}</h3>
        <button onClick={() => handleDeleteTransaction(id)}>
          <DeleteIcon />
        </button>
      </div>
      <p>Name: {name}</p>
      <p>Category: {category}</p>
      <p>Amount: ${amount}</p>
    </div>
  );
};

export default SpendingCard;

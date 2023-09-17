import React from "react";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon

const SpendingCard = (props) => {
  const { index, name, id, category, amount, handleDeleteTransaction } = props; // add handleDeleteTransaction

  return (
    <div className="transaction-card">
      <h3>Transaction: {index + 1}</h3>
      <p>Name: {name}</p>
      <p>Category: {category}</p>
      <p>Amount: ${amount}</p>
      <button onClick={() => handleDeleteTransaction(id)}>
        {" "}
        {/* Add Delete Button */}
        <DeleteIcon />
      </button>
    </div>
  );
};

export default SpendingCard;

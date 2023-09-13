import React from "react";
import "./SpendingCard";

const SpendingCard = (props) => {
  //.log(name, category, amount);
  const { index, name, category, amount } = props;

  return (
    <div className="transaction-card">
      <h3>Transaction: {index + 1}</h3>
      <p>Name: {name}</p>
      <p>Category: {category}</p>
      <p>Amount: ${amount}</p>
    </div>
  );
};

export default SpendingCard;

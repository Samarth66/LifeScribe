import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SpendingOverlayForm.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const SpendingOverlayForm = ({ onClose, onTransactionAdded }) => {
  const [transactionName, setTransactionName] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [categories, setCategories] = useState([
    "General",
    "Clothes",
    "Eating Out",
    "Gifts",
    "Holidays",
    "Sports",
    "Groceries",
    "Fuel",
    "Entertainment",
    "Utilities",
    "Travel",
    "Other",
    // Add more categories as needed
  ]);
  const user = useSelector((state) => state.userDetails.userDetails);
  const SpendingDate = useSelector(
    (state) =>
      state.selectedSpendingDateDetails.selectedSpendingDateDetails.date
  );
  const userDetails = user.id;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const transactionId = uuidv4();

    const newTransactionData = {
      id: transactionId,
      name: transactionName,
      amount: transactionAmount,
      category: transactionCategory,
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/add-transaction`, {
        userDetails,
        SpendingDate,
        newTransactionData,
      });

      if (response.status === 201) {
        onTransactionAdded();
        onClose();
      } else {
        console.log("Failed to create the transaction");
      }
    } catch (e) {
      console.log("Error creating the transaction:", e);
    }
  };

  return (
    <div className="transaction-form-overlay">
      <div className="transaction-form-box">
        <h3>Add Transaction</h3>
        <form onSubmit={handleFormSubmit}>
          <label>
            Transaction Name:
            <input
              type="text"
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
              required
            />
          </label>
          <label>
            Transaction Category:
            <select
              value={transactionCategory}
              onChange={(e) => setTransactionCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount:
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default SpendingOverlayForm;

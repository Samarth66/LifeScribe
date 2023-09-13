import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SpendingTrackerBody.css";
import SpendingTrackerChart from "../spendingTrackerChart/SpendingTrackerChart";
import SpendingOverlayForm from "../SpendingOverlayForm/SpendingOverlayForm";
import socket from "../../socket";
import SpendingCard from "../spendingTrackerCard/SpendingCard";
const SpendingTrackerBody = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.userDetails);
  const SpendingDate = useSelector(
    (state) =>
      state.selectedSpendingDateDetails.selectedSpendingDateDetails.date
  );
  const userDetails = user.id;
  const [data, setData] = useState([]);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);

  // Add state variables to manage form fields (transaction name, category, amount)
  const [transactionName, setTransactionName] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [spendingData, SetSpendingData] = useState("");

  const fetchSpendEntries = async (userId, date) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch-spendings",
        {
          params: {
            userId: userId,
            date: date,
          },
        }
      );

      console.log("status fetch", response.status, response.data);

      if (response.status === 200) {
        const spendingData = response.data;
        console.log("data fetched", spendingData);

        if (!spendingData) {
          await createSpendingEntry(userDetails, SpendingDate);

          console.log("created new spending entry");
        } else {
          setData(spendingData);
          console.log(data);
        }
      } else {
        console.log("Error fetching spending data");
      }
    } catch (error) {
      console.log("Error fetching spending data:", error);
    }
  };

  const createSpendingEntry = async (userId, date) => {
    const dataToSend = {
      userId: userId,
      date: date,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/create-spendings",
        dataToSend
      );
      console.log(response.status);
      if (response.status === 201) {
        console.log("Successfully created the data");
      } else {
        console.log("Failed to create spending entry");
      }
    } catch (e) {
      console.log("Error creating spending entry:", e);
    }
  };

  const handleAddTransaction = () => {
    // Show the add transaction form overlay
    setShowAddTransactionForm(true);
  };

  useEffect(() => {
    if (userDetails && SpendingDate) {
      fetchSpendEntries(userDetails, SpendingDate);
    }
  }, [userDetails, SpendingDate]);

  return (
    <div>
      <div className="spendingHeading">
        <h2>Spending Tracker: {SpendingDate}</h2>
      </div>
      <div className="spending-tracker-body">
        <div className="spending-tracker-card">
          {/* ... (other code remains the same) */}
          <h2>Transaction History</h2>
          <button
            className="add-transaction-button"
            onClick={() => handleAddTransaction()}
          >
            Add
          </button>
          <div className="transaction-card-container">
            {data.transactions ? (
              data.transactions.map((transaction, index) => (
                <div key={index}>
                  {/* Add more details here */}

                  <SpendingCard
                    key={index}
                    index={index}
                    name={transaction.name}
                    category={transaction.category}
                    amount={transaction.amount}
                  />
                </div>
              ))
            ) : (
              <p>No transactions available.</p>
            )}
          </div>
        </div>
        <div className="spendingCharts">
          <SpendingTrackerChart data={data} />
        </div>

        {/* Use the TransactionForm component */}
        {showAddTransactionForm && (
          <SpendingOverlayForm
            onClose={() => setShowAddTransactionForm(false)}
            onTransactionAdded={() => {
              // Fetch updated data after adding a transaction
              fetchSpendEntries(userDetails, SpendingDate);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SpendingTrackerBody;

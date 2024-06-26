import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SpendingTrackerBody.css";
import SpendingTrackerChart from "../spendingTrackerChart/SpendingTrackerChart";
import SpendingOverlayForm from "../SpendingOverlayForm/SpendingOverlayForm";

import SpendingCard from "../spendingTrackerCard/SpendingCard";
import ChatBot from "../../ChatBot/ChatBot";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const SpendingTrackerBody = () => {
  const user = useSelector((state) => state.userDetails.userDetails);
  const SpendingDate = useSelector(
    (state) =>
      state.selectedSpendingDateDetails.selectedSpendingDateDetails.date
  );
  const userDetails = user.id;
  const [data, setData] = useState([]);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);

  // Add state variables to manage form fields (transaction name, category, amount)

  const [prompt, setPrompt] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  const gptMessage = "Click on send to analyze your todays spending";

  const fetchSpendEntries = async (userId, date) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/fetch-spendings`, {
        params: {
          userId: userId,
          date: date,
        },
      });

      if (response.status === 200) {
        const spendingData = response.data;
        if (!spendingData) {
          await createSpendingEntry(userDetails, SpendingDate);
        } else {
          setData(spendingData);
        }
      } else {
        console.log("Error fetching spending data");
      }
    } catch (error) {
      console.log("Error fetching spending data:", error);
    }
  };
  const getIconSize = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      return "60px";
    } else {
      return "130px";
    }
  };

  const createSpendingEntry = async (userId, date) => {
    const dataToSend = {
      userId: userId,
      date: date,
    };
    try {
      const response = await axios.post(
        `${apiBaseUrl}/create-spendings`,
        dataToSend
      );
      console.log(response.status);
      if (response.status === 201) {
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

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/delete-transaction`, {
        params: {
          userId: userDetails,
          date: SpendingDate,
          id: transactionId,
        },
      });

      if (response.status === 200) {
        fetchSpendEntries(userDetails, SpendingDate);
      } else {
        console.log("Failed to delete transaction");
      }
    } catch (e) {
      console.log("Error deleting transaction:", e);
    }
  };

  const toggleChatBot = () => {
    let spendingPrompt =
      "act as an financial advisor, below is my todays spending data, in brief analyze it and give me advise if required, "; // Initialize the spendingPrompt variable
    if (!data.transaction) {
      for (const transaction of data.transactions) {
        spendingPrompt +=
          "ITEM: " +
          `${transaction.name}" AMOUNT: $"${transaction.amount}" CATEGORY:" ${transaction.category}\n`;
      }
      setPrompt(spendingPrompt);
    }

    // setPrompt(
    //    "please in brief analyze my spending, and feel free to give me financial advice if you "
    // );

    setShowChatBot(!showChatBot);
  };

  return (
    <div>
      <div className="spendingHeading">
        <h2>Spending Tracker: {SpendingDate}</h2>
      </div>
      <div className="spending-tracker-body">
        <div className="spending-tracker-card">
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
                  <SpendingCard
                    key={index}
                    index={index}
                    id={transaction.id}
                    name={transaction.name}
                    category={transaction.category}
                    amount={transaction.amount}
                    handleDeleteTransaction={handleDeleteTransaction}
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
      <div>
        <SmartToyOutlinedIcon
          onClick={toggleChatBot}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontSize: getIconSize(),
          }}
        />
        {showChatBot && <ChatBot prompt={prompt} gptMessage={gptMessage} />}
      </div>
    </div>
  );
};

export default SpendingTrackerBody;

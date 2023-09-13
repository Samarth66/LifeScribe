// spendingRoutes.js

const express = require("express");
const router = express.Router();
const UserTransaction = require("./spendingTracker"); // Import your Mongoose model
const { json } = require("react-router-dom");

// Endpoint to fetch user transactions by user ID and date

function spendingTrackerEntries(io) {
  router.get("/fetch-spendings", async (req, res) => {
    try {
      const { userId, date } = req.query;
      console.log("received?", userId, date, req.query);
      const userTransactions = await UserTransaction.findOne({
        userId,
        date: date,
      });

      res.json(userTransactions);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Endpoint to create a new user transaction
  router.post("/create-spendings", async (req, res) => {
    try {
      const { userId, date } = req.body;
      const userTransaction = new UserTransaction({
        userId,
        date: date,
        transactions: [],
        total: 0, // You can initialize transactions as an empty array
      });
      const savedUserTransaction = await userTransaction.save();
      res.status(201).json(savedUserTransaction);
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
    }
  });

  router.get("/spending-dashboard-entries", async (req, res) => {
    try {
      const { userId } = req.query;
      const spendingEntries = await UserTransaction.find({ userId: userId });
      res.json(spendingEntries);
    } catch (e) {
      console.log("failed to fetch spending table data", e);
    }
  });

  // Endpoint to add a new transaction to an existing user's transactions
  router.post("/add-transaction", async (req, res) => {
    try {
      const { userDetails, SpendingDate, newTransactionData } = req.body;

      // Find the user's transactions by userId and date
      const userId = userDetails;
      const date = SpendingDate;
      const userTransactions = await UserTransaction.findOne({
        userId,
        date,
      });

      if (!userTransactions) {
        return res.status(404).json({ error: "User transactions not found" });
      }

      // Add the new transaction to the existing transactions array
      userTransactions.transactions.push(newTransactionData);

      // Calculate the new total by summing up all transaction amounts
      const newTotal = userTransactions.transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Update the total field
      userTransactions.total = newTotal;

      // Save the updated user transactions
      const updatedUserTransactions = await userTransactions.save();
      io.emit("meal-updated");

      res.status(201).json(updatedUserTransactions);
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
    }
  });

  return router;
}

module.exports = spendingTrackerEntries;

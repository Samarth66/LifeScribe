// spendingRoutes.js

const express = require("express");
const router = express.Router();
const UserTransaction = require("./spendingTracker");
const { json } = require("react-router-dom");

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

  router.post("/create-spendings", async (req, res) => {
    try {
      const { userId, date } = req.body;
      const userTransaction = new UserTransaction({
        userId,
        date: date,
        transactions: [],
        total: 0,
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
  router.delete("/delete-transaction", async (req, res) => {
    try {
      const { userId, date, id } = req.query;

      const userTransaction = await UserTransaction.findOne({ userId, date });

      if (!userTransaction) {
        return res.status(404).json({ error: "User transaction not found" });
      }

      const index = userTransaction.transactions.findIndex(
        (transaction) => transaction.id === id
      );

      if (index === -1) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      userTransaction.transactions.splice(index, 1);

      const newTotal = userTransaction.transactions.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      userTransaction.total = newTotal;

      await userTransaction.save();

      res.status(200).json(userTransaction);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "An error occurred" });
    }
  });

  router.post("/add-transaction", async (req, res) => {
    try {
      const { userDetails, SpendingDate, newTransactionData } = req.body;

      const userId = userDetails;
      const date = SpendingDate;
      const userTransactions = await UserTransaction.findOne({
        userId,
        date,
      });

      if (!userTransactions) {
        return res.status(404).json({ error: "User transactions not found" });
      }

      userTransactions.transactions.push(newTransactionData);

      const newTotal = userTransactions.transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      userTransactions.total = newTotal;

      const updatedUserTransactions = await userTransactions.save();

      res.status(201).json(updatedUserTransactions);
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
    }
  });

  return router;
}

module.exports = spendingTrackerEntries;

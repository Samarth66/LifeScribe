const mongoose = require("mongoose");

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  id: String,
  name: String,
  amount: Number,
  category: String,
});

// Define the user transaction schema
const userTransactionSchema = new mongoose.Schema({
  userId: String, // You can use ObjectId if you want to reference user documents
  date: String,
  transactions: [transactionSchema], // Array of transactions
  total: Number,
});

// Create a model for user transactions
const UserTransaction = mongoose.model(
  "UserTransaction",
  userTransactionSchema
);

module.exports = UserTransaction;

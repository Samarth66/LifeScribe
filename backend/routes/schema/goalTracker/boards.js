const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "list",
    required: true,
  },
});

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },

  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "board",
    required: true,
  }, // Reference to the board it belongs to
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }], // Array of references to cards associated with this list
});

const boardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  createdAt: {
    type: String,
    required: true,
    default: Date.now,
  },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

const Board = mongoose.model("Board", boardSchema);
const List = mongoose.model("List", listSchema);
const Card = mongoose.model("Card", cardSchema);
module.exports = { Board, List, Card };

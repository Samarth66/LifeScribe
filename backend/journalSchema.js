const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
});

const journalDetail = mongoose.model("journalDetail", journalSchema);

module.exports = journalDetail;

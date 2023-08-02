const express = require("express");
const router = express.Router();
const journalDetail = require("../journalSchema");

router.get("/journal-entries", async (req, res) => {
  const { userId } = req.query;
  console.log("req body", req.query);
  try {
    const journalEntries = await journalDetail.find(
      { user: userId },
      { _id: 1, title: 1, date: 1 }
    );
    res.json(journalEntries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

router.get("/selected-journal-entry", async (req, res) => {
  const { postId } = req.query;
  try {
    const currentJournalEntry = await journalDetail.find({
      _id: postId,
    });
    console.log("got the current post", currentJournalEntry);
    res.json(currentJournalEntry);
  } catch (error) {
    console.log("cannot fetch post from database ", error);
  }
});

router.put("/journal-update", async (req, res) => {
  const { journalId, updatedJournalDescription, updatedJournalTitle } =
    req.body;
  console.log("got values?", journalId, updatedJournalDescription);

  try {
    await journalDetail.findOneAndUpdate(
      { _id: journalId },
      { description: updatedJournalDescription, title: updatedJournalTitle }
    );
  } catch (e) {
    console.log("Cannot update the function new journal in database", e);
  }
});

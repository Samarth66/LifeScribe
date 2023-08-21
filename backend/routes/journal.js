const express = require("express");
const router = express.Router();
const journalDetail = require("../journalSchema");

function journalRoutes(io) {
  router.post("/journal", async (req, res) => {
    const { id, title, description, current } = req.body;

    const data = {
      user: id,
      title: title,
      description: description,
      date: current,
    };

    try {
      const newEntry = await journalDetail.insertMany([data]);
      io.emit("newEntry", data); // Use the 'io' object to emit the event
      console.log("entry added", newEntry[0]._id);
      res.json(newEntry);
    } catch {
      console.log("error in adding data");
    }
  });

  return router;
}

module.exports = journalRoutes;

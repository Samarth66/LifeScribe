const express = require("express");
const router = express.Router();
const journalDetail = require("../journalSchema");

function journalRoutes(io) {
  io.on("connection", (socket) => {
    // This will be executed when a client connects
    io.emit("testEvent", "This is a test event!");

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });

  router.post("/journal", async (req, res) => {
    const { id, title, description, current } = req.body;

    const data = {
      user: id,
      title: title,
      description: description,
      date: current,
    };

    try {
      await journalDetail.insertMany([data]);
      io.emit("newEntry", data); // Use the 'io' object to emit the event
      res.status(201).json({ message: "Entry added successfully" });
    } catch {
      console.log("error in adding data");
    }
  });

  return router;
}

module.exports = journalRoutes;

const express = require("express");
const router = express.Router();
const journalDetail = require("../journalSchema");
const axios = require("axios");
require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
function journalRoutes(io) {
  // Existing journal route
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
      const userId = req.body.id;
      io.to(userId).emit("newEntry", data);
      console.log("entry added", newEntry[0]._id);
      res.json(newEntry);
    } catch (error) {
      console.log("error in adding data");
      res.status(500).json({ message: "Failed to add new entry" });
    }
  });

  router.delete("/delete-journal-entry", async (req, res) => {
    const entryId = req.query.postId;
    const userId = req.query.userId;
    console.log(entryId);

    if (!entryId) {
      return res
        .status(400)
        .json({ message: "Missing postId query parameter" });
    }

    try {
      // Use Mongoose to find and delete the entry by ID
      const deletedEntry = await journalDetail.findByIdAndDelete(entryId);

      if (!deletedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      io.to(userId).emit("entryDeleted", entryId);

      res.json({ message: "Entry deleted successfully", deletedEntry });
    } catch (error) {
      console.log("Error in deleting entry", error);
      res.status(500).json({ message: "Failed to delete entrys" });
    }
  });

  router.post("/ask", async (req, res) => {
    try {
      console.log(req.body);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions", // Correct endpoint for chat models
        {
          model: "gpt-3.5-turbo", // Specify the model here
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: req.body.prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      console.log(response);
      res.send(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.log("Error in OpenAI API call", error);
      res.status(500).send(error);
    }
  });

  return router;
}

module.exports = journalRoutes;

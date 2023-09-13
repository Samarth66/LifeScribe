const express = require("express");
const router = express.Router();
const journalDetail = require("../journalSchema");
const axios = require("axios");

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
      io.emit("newEntry", data);
      console.log("entry added", newEntry[0]._id);
      res.json(newEntry);
    } catch (error) {
      console.log("error in adding data");
      res.status(500).send(error);
    }
  });

  // Chatbot route

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
            Authorization: `Bearer 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`, // Replace with your API key
          },
        }
      );
      console.log(response);
      res.send(response.data.choices[0].message.content.trim()); // Updated line
    } catch (error) {
      console.log("Error in OpenAI API call", error);
      res.status(500).send(error);
    }
  });

  return router;
}

module.exports = journalRoutes;

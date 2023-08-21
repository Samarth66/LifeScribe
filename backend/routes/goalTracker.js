const express = require("express");
const router = express.Router();
const { Board, List, Card } = require("./schema/goalTracker/boards");
const { LockSharp } = require("@mui/icons-material");
const { default: axios } = require("axios");

function goalTracker(io) {
  router.post("/goal-sidebar-board", async (req, res) => {
    console.log("test", req.body);
    const data = {
      userId: req.body.userId,
      title: req.body.title,
    };

    try {
      const newBoard = await Board.create(data);
      console.log("board Entry added");
      res.json(newBoard);

      const defaultLists = [
        { title: "To Do", boardId: newBoard._id, cards: [] },
        { title: "In Process", boardId: newBoard._id, cards: [] },
        { title: "Done", boardId: newBoard._id, cards: [] },
      ];
      try {
        const createdLists = await List.insertMany(defaultLists);
        const newListReferences = createdLists.map((list) => ({
          _id: list._id,
        }));

        newBoard.lists = [...newBoard.lists, ...newListReferences];
        await newBoard.save();

        console.log("list entry added");
      } catch (e) {
        console.log("list not added", e);
      }
      return newBoard;
    } catch (e) {
      console.log("entry not added in board collection", express);
    }
  });

  router.post("/goal-sidebar-list", async (req, res) => {
    try {
      const newEntry = await List.insertMany(req.body);
      console.log(" list entry added");
      res.json(newEntry);
    } catch (e) {
      console.log("default lists cannot be added", e);
    }
  });

  router.post("/add-card", async (req, res) => {
    try {
      const newEntry = await Card.insertMany(req.body);

      io.emit("new-card-added", newEntry);
      console.log("card added to database");
    } catch (e) {
      console.log("failed to add card data to database");
    }
  });

  router.get("/fetch-sidebar", async (req, res) => {
    try {
      const { userId } = req.query;
      const goalSidebarEntries = await Board.find({
        userId: userId,
      });
      res.json(goalSidebarEntries);
    } catch (e) {
      console.log("failed");
    }
  });

  router.get("/fetch-lists", async (req, res) => {
    try {
      const { boardId } = req.query;
      console.log("req", boardId, req.query);
      const lists = await List.find({ boardId: boardId });
      res.json(lists);
    } catch (e) {
      console.log("Cannot retrieve lists from database", e);
    }
  });

  router.get("/fetch-cards", async (req, res) => {
    try {
      const { listId } = req.query;

      const cards = await Card.find({ listId: listId });
      res.json(cards);
    } catch (e) {
      console.log("sorry cannot fetch cards");
    }
  });

  router.delete("/delete-cards", async (req, res) => {
    try {
      const { id } = req.query;

      await Card.findByIdAndDelete(id);
      io.emit("cardDeleted");
    } catch (e) {
      console.log("card deletion failed", e);
    }
  });
  return router;
}

module.exports = goalTracker;

const express = require("express");
const router = express.Router();
const { Board, List, Card } = require("./schema/goalTracker/boards");
const { LockSharp } = require("@mui/icons-material");

function goalTracker(io) {
  router.post("/add-card", async (req, res) => {
    try {
      const data = {
        title: req.body.title,
        listId: req.body.listId,
      };

      const newCard = await Card.create(data);

      const list = await List.findById(req.body.listId);

      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      list.cards.push(newCard._id);
      await list.save();

      res
        .status(200)
        .json({ message: "Card added successfully", card: newCard });
    } catch (e) {
      console.log("Failed to add card data to database", e);
      res.status(500).json({ message: "Failed to add card" });
    }
  });

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
      const { id, userId } = req.query;
      console.log(userId);

      const card = await Card.findById(id);

      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      const list = await List.findOne({ _id: card.listId });

      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      list.cards = list.cards.filter((cardId) => cardId.toString() !== id);
      await list.save();

      await Card.findByIdAndDelete(id);

      io.to(userId).emit("cardDeleted");
      res.status(200).json({ message: "Card deleted successfully" });
    } catch (e) {
      console.log("Card deletion failed", e);
      res.status(500).json({ message: "Card deletion failed" });
    }
  });

  router.post("/update-cards", async (req, res) => {
    try {
      const { cardId, newParentListId } = req.body;

      const card = await Card.findById(cardId);

      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      const oldList = await List.findOne({ _id: card.listId });

      if (!oldList) {
        return res.status(404).json({ message: "Old list not found" });
      }

      oldList.cards = oldList.cards.filter(
        (id) => id.toString() !== cardId.toString()
      );
      await oldList.save();

      card.listId = newParentListId;
      await card.save();

      const newList = await List.findOne({ _id: newParentListId });

      if (!newList) {
        return res.status(404).json({ message: "New list not found" });
      }

      newList.cards.push(cardId);
      await newList.save();

      res.status(200).json({ message: "Card's list updated successfully." });
    } catch (e) {
      console.log("Updating card failed", e);
      res.status(500).json({ message: "Card's list update failed" });
    }
  });
  router.get("/count-cards-in-lists", async (req, res) => {
    try {
      const { userId } = req.query;

      // Find all boards belonging to the user
      const boards = await Board.find({ userId });

      // Initialize counts for each list
      let todoCount = 0;
      let inProgressCount = 0;
      let completedCount = 0;

      // Loop through each board
      for (const board of boards) {
        // Find the lists for the current board
        const lists = await List.find({ boardId: board._id });

        // Loop through each list and count the cards

        for (const list of lists) {
          if (list.title === "To Do") {
            todoCount += list.cards.length;
          } else if (list.title === "In Process") {
            inProgressCount += list.cards.length;
          } else if (list.title === "Done") {
            completedCount += list.cards.length;
          }
        }
      }

      console.log(todoCount, inProgressCount, completedCount);

      // Return the counts
      res.status(200).json({
        todoCount,
        inProgressCount,
        completedCount,
      });
    } catch (e) {
      console.log("Failed to count cards in lists", e);
      res.status(500).json({ message: "Failed to count cards in lists" });
    }
  });

  router.delete("/delete-board-entry", async (req, res) => {
    const { boardId, userId } = req.query;

    try {
      const deletedBoard = await Board.findByIdAndDelete(boardId);

      if (!deletedBoard) {
        return res.status(404).json({ message: "Board not found" });
      }
      io.to(userId).emit("boardDeleted");
      res.json({ message: "Board deleted successfully", deletedBoard });
    } catch (error) {
      console.log("Error in deleting board entry", error);
      res.status(500).send(error);
    }
  });

  return router;
}

module.exports = goalTracker;

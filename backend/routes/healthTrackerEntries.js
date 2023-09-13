const express = require("express");
const router = express.Router();
const HealthEntry = require("./healthTracker");

function healthTracker(io) {
  router.post("/fetch-lists", async (req, res) => {
    try {
      const data = req.body;
      const userId = data.userDetails;
      const date = data.healthDate;
      console.log("fetch", userId, date);
      const entry = await HealthEntry.findOne({ userId, date });
      res.status(200).json(entry);
    } catch (error) {
      res.status(500).json({ error: "Error fetching entry" });
    }
  });

  router.get("/fetch-meal", async (req, res) => {
    try {
      const { healthId } = req.query;

      const healthEntry = await HealthEntry.findById(healthId);

      if (!healthEntry) {
        return res.status(404).json({ error: "Health entry not found" });
      }

      const mealData = healthEntry.meals;

      res.status(200).json(mealData);
    } catch (error) {
      console.error("Error fetching meal data:", error);
      res.status(500).json({ error: "Error fetching meal data" });
    }
  });

  router.post("/create-entry", async (req, res) => {
    try {
      const { userId, date } = req.body.dataToSend;

      const newEntry = await HealthEntry.create({
        userId,
        date,
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
        },
      });

      console.log(newEntry);
      res.status(200).json({ message: "Entry created successfully" });
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ error: "Error creating entry" });
    }
  });

  const updateTotalNutrients = (meal, totalNutrients) => {
    totalNutrients.protein = (
      totalNutrients.protein + (meal.protein || 0)
    ).toFixed(2);
    totalNutrients.energy = (
      totalNutrients.energy + (meal.energy || 0)
    ).toFixed(2);
    totalNutrients.carbohydrates = (
      totalNutrients.carbohydrates + (meal.carbohydrates || 0)
    ).toFixed(2);
    totalNutrients.fats = (totalNutrients.fats + (meal.fats || 0)).toFixed(2);
    totalNutrients.sugar = (totalNutrients.sugar + (meal.sugar || 0)).toFixed(
      2
    );
  };
  router.get("/health-dashboard-entries", async (req, res) => {
    try {
      const { userId } = req.query;
      const spendingEntries = await HealthEntry.find({ userId: userId });
      res.json(spendingEntries);
    } catch (e) {
      console.log("failed to fetch spendingEntries", e);
    }
  });

  router.post("/add-meal", async (req, res) => {
    try {
      const { userId, date, mealType, description, nutrientData } = req.body;

      // Find the existing entry for the user and date
      const existingEntry = await HealthEntry.findOne({ userId, date });

      if (!existingEntry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      existingEntry.meals[mealType].push(nutrientData);

      updateTotalNutrients(nutrientData, existingEntry.meals.total);

      await existingEntry.save();
      io.emit("meal-updated");

      res.status(200).json({ message: "Meal added successfully" });
    } catch (error) {
      console.error("Error adding meal:", error);
      res.status(500).json({ error: "Error adding meal" });
    }
  });

  return router;
}

module.exports = healthTracker;

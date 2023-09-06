const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  foodName: {
    required: true,
    type: String,
  },
  foodId: {
    required: true,
    type: String,
  },
  protein: {
    type: Number,
  },
  energy: {
    type: Number,
  },
  carbohydrates: {
    type: Number,
  },
  fats: {
    type: Number,
  },
  sugar: {
    type: Number,
  },
});

const healthSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  meals: {
    breakfast: [mealSchema],
    lunch: [mealSchema],
    dinner: [mealSchema],
    total: {
      protein: {
        type: Number,
        default: 0,
      },
      energy: {
        type: Number,
        default: 0,
      },
      carbohydrates: {
        type: Number,
        default: 0,
      },
      fats: {
        type: Number,
        default: 0,
      },
      sugar: {
        type: Number,
        default: 0,
      },
    },
  },
});

const HealthEntry = mongoose.model("HealthEntry", healthSchema);

module.exports = HealthEntry;

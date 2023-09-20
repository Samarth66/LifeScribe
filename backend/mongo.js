const mongoose = require("mongoose");
require("dotenv").config();
const dbUri = process.env.DB_URI;

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.error("connection failed:", err.message);
  });

const loginSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const loginDetail = mongoose.model("loginDetail", loginSchema);

module.exports = loginDetail;

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/life", {
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

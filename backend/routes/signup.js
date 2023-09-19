const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const loginDetail = require("../mongo");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await loginDetail.findOne({ email });
    if (existingUser) {
      // Don't reveal if the email already exists
      return res.json({ status: "error" });
    }

    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: uuid.v4(),
      name,
      email,
      password: hashedPassword,
    };

    // Insert the new user into the database
    await loginDetail.insertMany([newUser]);

    return res.json({ status: "success", name });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ status: "error" });
  }
});

module.exports = router;

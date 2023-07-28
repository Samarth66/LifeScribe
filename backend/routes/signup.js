const express = require("express");
const router = express.Router();
const loginDetail = require("../mongo");

router.post("/signup", async (req, res) => {
  const { id, name, email, password } = req.body;

  const data = {
    id: id,
    name: name,
    email: email,
    password: password,
  };

  try {
    const check = await loginDetail.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      res.json({ status: "notexist" });
      await loginDetail.insertMany([data]);
    }
  } catch (e) {
    res.json({ status: "notexist" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const loginDetail = require("../mongo");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await loginDetail.findOne({ email: email });

    if (check) {
      if (check.password == password) {
        res.json({ status: "exist", name: check.name, id: check.id });
        console.log("id", check.id);
      } else {
        res.json({ status: "incorrectPassword", name: check.name });
      }
    } else {
      res.json({ status: "notexist" });
    }
  } catch (e) {
    res.json({ status: "notexist" });
  }
});
module.exports = router;

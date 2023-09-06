const express = require("express");
const passport = require("passport");
const router = express.Router();
const loginDetail = require("../mongo");

router.post("/", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ status: "incorrectPassword", name: info.name });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("exists");
      return res.json({ status: "exist", name: user.name, id: user.id });
    });
  })(req, res, next);
});
module.exports = router;

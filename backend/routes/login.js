const express = require("express");
const passport = require("passport");
const router = express.Router();
const loginDetail = require("../mongo");
const jwt= require("jsonwebtoken");
const secret_key= "ThisIsAStrongKey@6969";

router.post("/verifyToken", (req,res) => {
  
  const { token } = req.body;

  if(!token){
    return res.status(401).json({isValid: false, message:'No Token Present'});
  }

  jwt.verify(token, secret_key, (err, decoded) =>{
    if(err) {
      return res.status(401).json({ isValid: false, message: 'Invalid token' });
    }
   
    return res.json({ isValid: true, userId: decoded.id, name: decoded.name});
  })
})

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
      const token = jwt.sign({id: user.id, name:user.name}, secret_key, {
        expiresIn: '2h'
      });

      
      return res.json({ status: "exist", name: user.name, id: user.id, token:token});
    });
  })(req, res, next);
});

module.exports = router;

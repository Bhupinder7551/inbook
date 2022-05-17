const { body, validationResult } = require("express-validator");
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "BhupinderisagoodB$oy";
// Create a User using: POST "/api/auth/"
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
      user:{
         id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
     
      // .then((user) => res.json(user))
      // .catch(err=> {console.log(err)
      // res.json({error:'please enter a unique email'})})
      res.json({authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error occured");
    }
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Admin = require("../Models/Admin");
var fetchuser = require('../middleware/fetchuser');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");


const JWT_SECRET = "Bhupinderisagoodb$oy";

// Route 1 : Create admin using:POST "/api/createadmin". no login required
router.post(
  "/createadmin",
  [
    body("adminname", "Enter a valid name").isLength({ min: 3 }),
    body("adminemail", "Enter a valid email").isEmail(),
    body("adminpassword", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ adminemail: req.body.adminemail });
      if (admin) {
        return res
          .status(400)
          .json({ error: "Sorry admin with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.adminpassword, salt);
      // Create a new admin
      admin = await Admin.create({
        adminname: req.body.adminname,
        adminemail: req.body.adminemail,
        adminpassword: secPass,
      });
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken, admin });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

  
// ROUTE 2: Authenticate a admin using: POST "/api/adminlogin". No login required

router.post(
  "/adminlogin",
  [
    body("adminemail", "Enter a valid email").isEmail(),
    body("adminpassword", "Password must be atleast 5 characters").exists(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ adminemail: req.body.adminemail });
      if (!admin) {
        success = false
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(req.body.adminpassword, admin.adminpassword);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken, admin });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
// ROUTE 3: Get loggedin admin Details using: POST "/api/getadmin". Login required
router.post('/getadmin', fetchuser,  async (req, res) => {

  try {
    adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select("-adminpassword")
    res.send(admin)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;

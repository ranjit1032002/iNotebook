const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ranjitisagoodb$oy";

// Route 1: creating a user using : POST "/api/auth/createuser" . No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleat 5 characters").isLength({
      min: 5,
    }),
  ],
  //If there are errors, return Bad Request and the error object
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const user = User(req.body);
    // user.save();

    try {
      // check whether the user with this email is exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(200)
          .json({ success,error: "user with this email already exists" });
      }
      const salt = await bcrypt.genSaltSync(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      res.json({success:true, authToken });
      // res.send(user);
      // Catch the error
    } catch (e) {
      res
        .status(500)
        .json({ success, error: "Internal Server Error", message: e.message });
    }

    // console.log(res.send(data));
  }
);

// Route 2: Authenticate a user using : POST "/api/auth/login" .Login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email!").isEmail(),
    body("password", "Password required!").exists(),
  ],
  //If there are errors, return Bad Request and the error object
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        const success = false;
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success:true, authToken });
    } catch (e) {
      res
        .status(500)
        .json({success, error: "Internal Server Error", message: e.message });
    }
  }
);

// Route 3: Get loggedin user details : POST "/api/auth/getuser" .Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id ;
    const user = await User.findById(userId).select("-password");
    // console.log(req)
    res.send(user);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: e.message });
  }
});

module.exports = router;

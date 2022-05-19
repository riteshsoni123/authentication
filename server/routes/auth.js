const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "riteshkumarsoni";

// Create a user using :POST "/api/auth/createuser" No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter strong password").isLength({ min: 5 }),
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
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Authenticate a user using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors then return bad requests and error

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
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const data = {
        user: {
          id: user.is,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findOne(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Intternal Server Error");
  }
});

router.put("/editprofile/:id", fetchuser, async (req, res) => {
  const { age, gender, college, branch, year, profession } = req.body;
  const updatedProfile = {};

  if (age) {
    updatedProfile.age = age;
  }
  if (gender) {
    updatedProfile.gender = gender;
  }
  if (college) {
    updatedProfile.college = college;
  }
  if (branch) {
    updatedProfile.branch = branch;
  }
  if (year) {
    updatedProfile.year = year;
  }
  if (profession) {
    updatedProfile.profession = profession;
  }
  userId = req.user.id;
  let user = await User.findOne(userId);
  if (!user) {
    return res.status(404).send("Not Found");
  }

  user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updatedProfile },
    { new: true }
  ).select("-password");
  res.json({ user });
});

module.exports = router;

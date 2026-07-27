const express = require("express");
const { validateSignUp } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

const cookieOptions = {
  expires: new Date(Date.now() + 8 * 3600000),
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered. Please login." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "Account created successfully!", data: savedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, cookieOptions);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = authRouter;

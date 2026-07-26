const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      return res.status(400).json({ message: "Invalid fields in request. Only firstName, lastName, photoUrl, age, gender, about and skills are allowed." });
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile, please try again" });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const updatedPassword = await bcrypt.hash(password, 12);
    req.user.password = updatedPassword;
    await req.user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password, please try again" });
  }
});

module.exports = profileRouter;

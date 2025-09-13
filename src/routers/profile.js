const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");

const { validateProfileEditData } = require("../utils/validations");
const { findOne } = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User does not exists!");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request!");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successdully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user

    if (!user) {
      return res.status(404).send("User not found");
    }

    const updatedPassword = await bcrypt.hash(password, 12);
    user.password = updatedPassword;

    await user.save();
    res.send("Password updated successfully!");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = profileRouter;

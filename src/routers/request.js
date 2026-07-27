const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Allowed: ignored, interested" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(409).json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
    const data = await connectionRequest.save();

    try {
      const emailRes = await sendEmail.run();
      console.log(emailRes);
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr.message);
    }

    res.json({
      message: `${req.user.firstName} ${status} ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send request, please try again" });
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Allowed: accepted, rejected" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found or already reviewed" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: `Connection request ${status}`,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to review request, please try again" });
  }
});

module.exports = requestRouter;

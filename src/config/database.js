const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yashmankar349:x0fX5UCKo9q6bIpd@cluster0.lsglvs7.mongodb.net/devTinder"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // re-throw so the server doesn't start
  }
};

module.exports = connectDB;

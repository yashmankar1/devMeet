const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const allowedOrigins = [
  "http://localhost:5173",
  "https://devmeet-ten.vercel.app",
  "https://devmeetup.me",
  "https://www.devmeetup.me",
];

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if (!chat) {
          chat = new Chat({ participants: [userId, targetUserId], messages: [] });
        }
        chat.messages.push({ senderId: userId, text });
        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, lastName, text });
      } catch (error) {
        console.error("Socket sendMessage error:", error);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

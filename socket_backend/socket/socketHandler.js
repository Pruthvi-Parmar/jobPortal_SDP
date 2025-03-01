import { Server } from "socket.io";
import { Chat } from "../models/chatModel.js";

const users = {}; // Store connected users

export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("registerUser", ({ userId }) => {
      users[userId] = socket.id;
      console.log(`✅ User Registered: ${userId}`);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      if (users[receiverId]) {
        io.to(users[receiverId]).emit("receiveMessage", newMessage);
      }
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`❌ User disconnected: ${userId}`);
      }
    });
  });

  return io;
};

import { Server } from "socket.io";
import { Chat } from "../models/chat.mpdel.js";
import { User } from "../models/user.model.js";

const users = {}; // Store connected users

export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("registerUser", async ({ userId }) => {
      users[userId] = socket.id;
      console.log(`✅ User Registered: ${userId}`);

      // Broadcast updated online user list
      const onlineUsers = Object.keys(users);
      io.emit("updateOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      if (users[receiverId]) {
        io.to(users[receiverId]).emit("receiveMessage", newMessage);
      }
    });
    

    socket.on("getOnlineUsers", () => {
      socket.emit("updateOnlineUsers", Object.keys(users));
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`❌ User disconnected: ${userId}`);

        // Notify clients about user disconnection
        io.emit("updateOnlineUsers", Object.keys(users));
      }
    });
  });

  return io;
};

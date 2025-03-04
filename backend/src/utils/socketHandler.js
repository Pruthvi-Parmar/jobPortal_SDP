import { Server } from "socket.io";
import { Chat } from "../models/chat.model.js";
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

    // Initiate chat event
    socket.on("initiateChat", async ({ senderId, receiverId }) => {
      try {
        let existingChat = await Chat.findOne({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        });
        if (!existingChat) {
          existingChat = new Chat({ senderId, receiverId, message: "Chat initiated" });
          await existingChat.save();
        }
        // Emit chatInitiated event to both sender and receiver if online
        if (users[receiverId]) {
          io.to(users[receiverId]).emit("chatInitiated", existingChat);
        }
        if (users[senderId]) {
          io.to(users[senderId]).emit("chatInitiated", existingChat);
        }
      } catch (error) {
        console.error("Error initiating chat:", error);
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      // Emit message to receiver if online
      if (users[receiverId]) {
        io.to(users[receiverId]).emit("receiveMessage", newMessage);
      }
      // Also emit message to sender for immediate UI update
      if (users[senderId]) {
        io.to(users[senderId]).emit("receiveMessage", newMessage);
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
        io.emit("updateOnlineUsers", Object.keys(users));
      }
    });
  });

  return io;
};

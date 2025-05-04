import { Server } from "socket.io"
import { Chat } from "../models/chat.model.js"

const users = {} // Store connected users

export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: "https://jobportal-sdp.onrender.com/v1" } })

  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`)

    socket.on("registerUser", async ({ userId }) => {
      // Store the socket ID for this user
      users[userId] = socket.id
      console.log(`✅ User Registered: ${userId}`)

      // Broadcast updated online user list
      const onlineUsers = Object.keys(users)
      io.emit("updateOnlineUsers", onlineUsers)
    })

    // Initiate chat event
    socket.on("initiateChat", async ({ senderId, receiverId }) => {
      try {
        let existingChat = await Chat.findOne({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        })
        if (!existingChat) {
          existingChat = new Chat({ senderId, receiverId, message: "Chat initiated" })
          await existingChat.save()
        }
        // Emit chatInitiated event to both sender and receiver if online
        if (users[receiverId]) {
          io.to(users[receiverId]).emit("chatInitiated", existingChat)
        }
        if (users[senderId]) {
          io.to(users[senderId]).emit("chatInitiated", existingChat)
        }
      } catch (error) {
        console.error("Error initiating chat:", error)
      }
    })

    socket.on("sendMessage", async (messageData) => {
      // Don't create a new message here - it's already created via REST API
      // Just forward the message to the receiver

      // Emit message to receiver if online
      if (users[messageData.receiverId]) {
        io.to(users[messageData.receiverId]).emit("receiveMessage", messageData)
      }
    })

    socket.on("getOnlineUsers", () => {
      socket.emit("updateOnlineUsers", Object.keys(users))
    })

    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id)
      if (userId) {
        delete users[userId]
        console.log(`❌ User disconnected: ${userId}`)
        io.emit("updateOnlineUsers", Object.keys(users))
      }
    })
  })

  return io
}


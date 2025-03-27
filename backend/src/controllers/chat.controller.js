import { Chat } from "../models/chat.model.js"
import { User } from "../models/user.model.js"

// Fetch all potential chat users (based on role)
export const getChatUsers = async (req, res) => {
  try {
    // console.log(req.body.userId);
    const userId = req.body.userId
    const user = await User.findById(userId)
    // console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Fetch recruiters if the logged-in user is a job seeker, otherwise fetch job seekers
    const userType = user.role // 'jobseeker' or 'recruiter'

    const chatUsers =
      userType === "jobseeker"
        ? await User.find({ role: "recruiter" }).select("fullname username email")
        : await User.find({ role: "jobseeker" }).select("fullname username email")

    res.json(chatUsers)
  } catch (error) {
    console.log("chat controller error: ", error)
    res.status(500).json({ error: "Error fetching chat users" })
  }
}

// Fetch chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params
    const userId = req.user._id

    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat history" })
  }
}

// Send a new message via REST
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, userId } = req.body
    const senderId = userId

    // Check if this exact message already exists to prevent duplicates
    const existingMessage = await Chat.findOne({
      senderId,
      receiverId,
      message,
      createdAt: { $gte: new Date(Date.now() - 5000) }, // Check messages from last 5 seconds
    })

    if (existingMessage) {
      // If the message already exists, just return it
      return res.status(200).json(existingMessage)
    }

    // Create and save the new message
    const newMessage = new Chat({ senderId, receiverId, message })
    await newMessage.save()

    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ error: "Error sending message" })
  }
}

// Get list of ongoing chats (unique conversation partners)
export const getOngoingChats = async (req, res) => {
  try {
    const userId = req.body.userId

    // Find all messages where the user is either sender or receiver
    const messages = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 })

    // Use a set to store unique conversation partner IDs
    const partnerIds = new Set()
    messages.forEach((msg) => {
      if (msg.senderId.toString() === userId.toString()) {
        partnerIds.add(msg.receiverId.toString())
      } else if (msg.receiverId.toString() === userId.toString()) {
        partnerIds.add(msg.senderId.toString())
      }
    })

    // Fetch user details for these conversation partners
    const ongoingChats = await User.find({ _id: { $in: Array.from(partnerIds) } }).select("fullname username email")

    res.json(ongoingChats)
  } catch (error) {
    //console.error("❌ Error fetching ongoing chats:", error)
    res.status(500).json({ error: "Error fetching ongoing chats" })
  }
}

// Initiate a chat between two users
export const initiateChat = async (req, res) => {
  try {
    const senderId = req.user._id // using JWT for logged in user
    const { receiverId } = req.body

    // Check if a chat already exists between these two users
    const existingChat = await Chat.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })

    if (existingChat) {
      return res.json({ message: "Chat already initiated", chat: existingChat })
    }

    // Create a new chat record with an initial message
    const newChat = new Chat({ senderId, receiverId, message: "Chat initiated" })
    await newChat.save()

    res.status(201).json({ message: "Chat initiated", chat: newChat })
  } catch (error) {
    //console.error("❌ Error initiating chat:", error)
    res.status(500).json({ error: "Error initiating chat" })
  }
}


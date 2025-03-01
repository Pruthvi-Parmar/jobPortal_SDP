import { Chat } from "../models/chatModel.js";
import { User } from "../../backend/src/models/user.model.js";

// Fetch all chat users for logged-in user
export const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatUsers = await Chat.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .populate("senderId receiverId", "fullname username email")
      .sort({ updatedAt: -1 });

    res.json(chatUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat users" });
  }
};

// Fetch chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;
    const messages = await Chat.find({
      $or: [{ senderId: userId, receiverId: otherUserId }, { senderId: otherUserId, receiverId: userId }],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat history" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

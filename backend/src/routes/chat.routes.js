import { Router } from "express";
import { 
    getChatUsers, 
  getChatHistory, 
  sendMessage, 
  getOngoingChats, 
  initiateChat 
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all available users for chat (filtered by role)
router.post("/users", getChatUsers);

// Get chat history with a specific user
router.get("/:otherUserId", verifyJWT, getChatHistory);

// Send a message via REST (in addition to real-time via socket)
router.post("/", sendMessage);

// Get list of ongoing chats (unique conversation partners)
router.post("/ongoing-chats", verifyJWT, getOngoingChats);

// Initiate a chat with another user
router.post("/initiate-chat", verifyJWT, initiateChat);

export default router;

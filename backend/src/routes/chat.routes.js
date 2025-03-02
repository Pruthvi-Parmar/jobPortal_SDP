
import { Router } from "express";
import { getAvailableUsers, getChatHistory, sendMessage } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// Get all available users for chat
router.post("/users", getAvailableUsers);

// Get chat history
router.get("/:otherUserId", verifyJWT, getChatHistory);

// Send a message
router.post("/", sendMessage);

export default router;
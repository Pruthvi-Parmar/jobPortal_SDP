import express from "express";
import { getAvailableUsers, getChatHistory, sendMessage } from "../controllers/chatController.js";
import { verifyJWT } from "../../backend/src/middlewares/auth.middleware.js";

const router = express.Router();

// Get all available users for chat
router.post("/users", getAvailableUsers);

// Get chat history
router.get("/:otherUserId", verifyJWT, getChatHistory);

// Send a message
router.post("/", verifyJWT, sendMessage);

export default router;

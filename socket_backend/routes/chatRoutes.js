import express from "express";
import { getChatUsers, getChatHistory, sendMessage } from "../controllers/chatController.js";
import { verifyJWT } from "../../backend/src/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getChatUsers);
router.get("/:otherUserId", verifyJWT, getChatHistory);
router.post("/", verifyJWT, sendMessage);

export default router;

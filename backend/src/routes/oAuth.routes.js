import express from "express";
import { handleGoogleAuth } from "../controllers/oAuth.controller.js"; // Import the controller function

const router = express.Router();

// Route for Google OAuth
router.post("/google", handleGoogleAuth);

export default router;
import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import queryString from "query-string";
import {User} from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Redirect user to Google OAuth
router.post("/google", async (req, res) => {
    console.log("inside google controller : ");
    
    const { token } = req.body;
    console.log(token);
    

    try {
        // Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, picture, sub: googleId } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (Sign Up)
            user = new User({ googleId, email, name, avatar: picture });
            await user.save();
        }

        // Generate JWT token for authentication
        const jwttoken = jwt.sign(
            { userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }  // ✅ Correct format
        );
        

        res.json({
            message: user.googleId ? "Login Successful" : "Sign-Up Successful",
            token: jwttoken,
            user,
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ error: "Google authentication failed" });
    }
});

// Handle Google OAuth callback
router.get("/google/callback", async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
                code,
            },
        });

        const { access_token } = tokenResponse.data;

        // Fetch user data from Google
        const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, email, name, picture } = userResponse.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ googleId: id, email, name, avatar: picture });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Google authentication failed" });
    }
});

export default router;

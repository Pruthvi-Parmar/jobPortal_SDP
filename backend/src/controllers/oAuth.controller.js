import { User } from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handles Google OAuth authentication.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleGoogleAuth = async (req, res) => {
    // console.log("Inside Google controller");

    const { token, role, bio, location, qualifications, experience } = req.body;
    // console.log("Received token:", token);
    // console.log("Received role:", role);

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
            user = new User({
                googleId,
                email,
                username: name, // Use Google Name as Username
                fullname: name, // Store Full Name
                avatar: picture, // Store Google Profile Picture
                password: null, // No password needed for Google Auth
                role, // Additional fields
                bio,
                location,
                qualifications,
                experience,
            });
            await user.save();
        } else if (!user.googleId) {
            // If user exists but was created with email/password, update googleId
            user.googleId = googleId;
            await user.save();
        }

        // Generate JWT access & refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save();

        // Send response
        res.json({
            message: user.googleId ? "Login Successful" : "Sign-Up Successful",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ error: "Google authentication failed" });
    }
};
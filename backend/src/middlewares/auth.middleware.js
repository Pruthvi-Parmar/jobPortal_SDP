import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        console.log("TOKEN : ", token)
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        let decodedToken;
        let user;

        // Step 1: Try verifying as a backend JWT
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("✅ Backend JWT Verified:", decodedToken);

            // Find the user by ID
            user = await User.findById(decodedToken._id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }
        } catch (jwtError) {
            console.log("❌ Backend JWT Verification Failed. Trying Google Token...");

            // Step 2: Try verifying as a Google ID token
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                decodedToken = ticket.getPayload();
                console.log("✅ Google Token Verified:", decodedToken);

                // Find or create the user by email
                user = await User.findOne({ email: decodedToken.email });
                if (!user) {
                    user = await User.create({
                        username: decodedToken.name || "New User",
                        email: decodedToken.email,
                        role: decodedToken.role || "jobseeker", // Use role from token or default to "jobseeker"
                        googleId: decodedToken.sub, // Google ID for Google-authenticated users
                    });
                }
            } catch (googleError) {
                console.error("❌ Google Token Verification Failed:", googleError.message);
                throw new ApiError(401, "Invalid Token: Neither JWT nor Google Token is valid");
            }
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid Access Token");
    }
});
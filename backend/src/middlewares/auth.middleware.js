import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        let token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        let decodedToken;

        if (token.startsWith("ey")) { // Check if it's a JWT token
            try {
                decodedToken = jwt.decode(token, { complete: true });
                if (!decodedToken) throw new Error("Invalid Token Format");

                console.log("🔍 Decoded Token Header:", decodedToken.header);

                if (decodedToken.header.alg === "RS256") {
                    // Google Token Verification
                    const ticket = await googleClient.verifyIdToken({
                        idToken: token,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    });
                    decodedToken = ticket.getPayload();
                    console.log("✅ Google Token Verified:", decodedToken);
                } else {
                    // Normal JWT issued by our backend
                    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                }
            } catch (error) {
                console.error("❌ Token Verification Failed:", error.message);
                throw new ApiError(401, "Invalid Token");
            }
        } else {
            throw new ApiError(401, "Invalid Token Format");
        }

        let user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            user = await User.create({
                username: decodedToken.name || "New User",
                email: decodedToken.email,
                role: "jobseeker",
                googleId: decodedToken.sub,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid Access Token");
    }
});

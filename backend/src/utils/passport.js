import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log("PROFILE", profile)
        if (!user) {
          user = await User.create({
            username: profile.displayName || "defaultusername",
            email: profile.emails[0].value,
            password: "google-auth", // No actual password needed
          });
        }

        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;

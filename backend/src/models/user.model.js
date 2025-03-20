import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        // Authentication Fields
        googleId: { type: String, unique: true, sparse: true }, // For Google-authenticated users
        email: { type: String, required: true, unique: true }, // Email is required for all users
        password: { type: String }, // Password is optional (for email/password users)
        refreshToken: { type: String }, // Refresh token for JWT

        // Profile Fields
        username: { type: String, required: true, unique: true }, // Username is required
        fullname: { type: String }, // Full name
        avatar: { type: String }, // Profile picture URL
        role: { type: String, enum: ["jobseeker", "recruiter"], default: "jobseeker" }, // User role
        bio: { type: String }, // User bio
        location: { type: String }, // User location

        // Jobseeker-Specific Fields
        qualifications: [
            {
                education: { type: String }, // Education details
                certificate: { type: String }, // Certifications
                skills: { type: String }, // Skills
            },
        ],
        experience: [
            {
                title: { type: String }, // Job title
                company: { type: String }, // Company name
                desc: { type: String }, // Job description
            },
        ],

        // Recruiter-Specific Fields
        company: { type: String }, // Company name (for recruiters)
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

// Hash password before saving (for email/password users)
userSchema.pre("save", async function (next) {
    // Skip password hashing if the password is not modified or if the user is Google-authenticated
    if (!this.isModified("password") || !this.password) return next();

    // Hash the password only if it exists
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords (for email/password users)
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare hashed passwords
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
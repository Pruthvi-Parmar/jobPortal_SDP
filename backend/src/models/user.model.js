import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            //required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            //required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: false,
            trim: true,
            index: true
        },
        resume:{
            type: String, //cloudinary if use!
            required: false
        },
        coverimage:{
            type: String, //cloudinary if use!
            required: false
        },
        password:{
            type: String, //becrypt
            //required: true
        },
        refreshToken:{
            type: String,
        },
        role:{
            type: String,
            //required: true
        },
        bio:{
            type: String,
        },
        location:{
            type: String,
        },
        qualifications:[{
            education:{
                type: String,
            },
            certifricate:{
                type: String,
            },
            skills:{
                type: String,
            }
        }],
        experience:[{
            title:{
                type: String,
            },
            company:{
                type: String,
            },
            desc:{
                type: String,
            }
        }],
        company:{
            type: String,
        },
        isPremium: { 
            type: Boolean, 
            default: false 
        },
        googleId: { 
            type: String,
            unique: true,
            sparse: true 
        },
        isAllowedToPostJob: {
            type: Boolean,
            default:false,
        },
    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function (next) {
    // Skip password hashing if the password is not modified or if the user is Google-authenticated
    if (!this.isModified("password") || !this.password) return next();

    // Hash the password only if it exists
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare hashed passwords
};

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


export const User = mongoose.model('User',userSchema)
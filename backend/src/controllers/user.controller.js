import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,error+" : something went wrong while generating Access and Refresh tokens")
    }
} 


const registerUser = asyncHandler( async (req, res) => {
    const {username, email, password, role, bio } = req.body
    // console.log("request body ",req.body)
    // console.log(email);
    // console.log(role);
    

    if(
        [username,email,password,role].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }
    
    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })

    if(existedUser){
        throw new ApiError(400,"user already exist")
    }
    // console.log("errrrrrrorrrr!!!!!!");
    // console.log(username);
    // console.log(email);
    // console.log(password);
    // console.log(req.files);
    

    const avatarLocalPath = req.files?.coverimage[0]?.path;

    const coverimage = await uploadOnCloudinary(avatarLocalPath)
    //const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverimage) {
        throw new ApiError(400, "coverimage file is required")
    }
    const avatarLocalPath1 = req.files?.resume[0]?.path;

    const resume = await uploadOnCloudinary(avatarLocalPath1)
    //const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverimage) {
        throw new ApiError(400, "resume file is required")
    }

    // console.log(coverimage.url);
    // console.log(resume.url);

    if(role=="jobseeker"){
        const {qualifications, experience, location} = req.body
       // console.log(qualifications, experience, location, bio);
        // if(
        //     [qualifications,experience,location,bio].some((field) => field?.trim() === "")
        // ){
        //     throw new ApiError(400,"all fields are requried")
        // }
        const user = await User.create({
            username,
            email,
            password,
            role,
            coverimage : coverimage.url,
            resume: resume.url,
            qualifications,
            experience,
            location,
            bio
        })

        if(!user){
            console.log("nothing ");
            
        }
        
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering user")
        }
    
        return res.status(200).json(
            new ApiResponse(200, createdUser, "user registerd successfully")
        )
    }

    
    

    if(role=="recruiter"){
        const { company } = req.body
        // if(
        //     [company].some((field) => field?.trim() === "")
        // ){
        //     throw new ApiError(400,"all fields are requried")
        // }
       // console.log("bio",bio);
        
        const user = await User.create({
            username,
            email,
            password,
            role,
            coverimage : coverimage.url,
            bio,
            company,

        })

        if(!user){
            console.log("nothing ");
            
        }
        
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering user")
        }
    
        return res.status(200).json(
            new ApiResponse(200, createdUser, "user registerd successfully")
        )
    }

    


    // const user = await User.create({
    //     username,
    //     email,
    //     password,
    //     role,
    //     coverimage : coverimage.url,
    //     resume: resume.url,
    // })

    // if(!user){
    //     console.log("nothing ");
        
    // }
    

    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    // if(!createdUser){
    //     throw new ApiError(500,"something went wrong while registering user")
    // }

    // return res.status(200).json(
    //     new ApiResponse(200, createdUser, "user registerd successfully")
    // )
})

const loginUser = asyncHandler( async(req, res) => {
    const {email, username, password} = req.body

    // console.log(req.body);
    

    if(!(email || username)){
        throw new ApiError(400,"email or username is requried")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log(user);
    

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged In successfully"
        )
    )
})


const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(
                200,
                {},
                "user loged out"
            ))
})

const refreshAccessToken = asyncHandler(async(req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    console.log("Token : ",incomingRefreshToken);
    
    //const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if(!incomingRefreshToken){
        new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken._id)
    
        if(!user){
            new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Access Token Refreshed "
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const {password} = req.body
    user.password = password
    await user.save({validateBeforeSave:false})
    const changedUser = await User.findById(req.user._id)
    res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            password
        },
        "password changed"
    ))

})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, email } = req.body
  
    // console.log("Request body:", req.body)
  
    // if (!username || !email) {
    //   throw new ApiError(400, "Username and email are required")
    // }
  
    // Create an update object with only the fields that are provided
    const updateData = {
      username,
      email,
    }
  
    // Add any additional fields that might be in the request
    // This allows for extending the update functionality
    if (req.body.fullname) updateData.fullname = req.body.fullname
    if (req.body.bio) updateData.bio = req.body.bio
    if (req.body.location) updateData.location = req.body.location

    const avatarLocalPath1 = req.files?.resume[0]?.path;

    const resume = await uploadOnCloudinary(avatarLocalPath1)
    
    if (!resume) {
        throw new ApiError(400, "resume file is required")
    }

    console.log("resume url : ",resume.url);
    updateData.resume = resume.url
  
    try {
      const user = await User.findByIdAndUpdate(req.user?._id, { $set: updateData }, { new: true }).select("-password")
  
      if (!user) {
        throw new ApiError(404, "User not found")
      }
  
      return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
    } catch (error) {
      console.error("Error updating user:", error)
      throw new ApiError(500, error.message || "Failed to update account details")
    }
  })
  

const viewProfile = asyncHandler(async(req, res) => {
    const {username, email} = req.body

    if (!username || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"))
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
    } catch (error) {
        // console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Error retrieving users" });
    }
});



// const forgotPassword = asyncHandler(async (req, res) => {
//     const {email, newPassword} = req.body

//     if(!email){
//         throw new ApiError(400,"email is requried")
//     }

//     const user = await User.findOne(email)

//     if(!user){
//         throw new ApiError(404,"user does not exist")
//     }

// })



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    viewProfile,
    getAllUsers
}
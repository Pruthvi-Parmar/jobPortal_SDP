import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Admin} from "../models/admin.model.js"
import {Applications} from "../models/jobApplication.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { Jobs } from "../models/jobs.models.js"

const generateAccessAndRefreshTokens =( async (userId) => {
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,error+" : something went wrong while generating Access and Refresh tokens")
    }
})

const registerAdmin = asyncHandler( async (req, res) => {
    const {username, email, password } = req.body
    console.log(req.body)
    console.log(email);
   
    

    if(
        [username,email,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }
    
    const existedAdmin = await Admin.findOne({
        $or: [{email},{username}]
    })

    if(existedAdmin){
        throw new ApiError(400,"user already exist")
    }
    console.log("errrrrrrorrrr!!!!!!");
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(req.files);
    

   
    const admin = await Admin.create({
        username,
        email,
        password,
    })

    if(!admin){
        console.log("nothing ");
        
    }
    

    const createdAdmin= await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if(!createdAdmin){
        throw new ApiError(500,"something went wrong while registering user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdAdmin, "admin registerd successfully")
    )
})

const loginAdmin = asyncHandler( async(req, res) => {
    const {email, username, password} = req.body

    //console.log(req.body);
    

    if(!(email || username)){
        throw new ApiError(400,"email or username is requried")
    }

    const admin = await Admin.findOne({
        $or: [{username},{email}]
    })

    if(!admin){
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    //console.log(admin);
    

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInAdmin, accessToken, refreshToken
            },
            "admin logged In successfully"
        )
    )
})

const logoutAdmin = asyncHandler(async (req, res) => {

    await Admin.findByIdAndUpdate(
        req.admin._id,
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
                "admin loged out"
            ))
})

const getAdminDashboard = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Jobs.countDocuments();
    const totalApplications = await Applications.countDocuments();

    const data = {
        totalUsers,
        totalJobs,
        totalApplications,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Admin Dashboard Data"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users retrieved successfully"))
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const user = await User.findByIdAndDelete(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"))
});

const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Jobs.find().populate("createdBy", "title");
    return res
        .status(200)
        .json(new ApiResponse(200, jobs, "Jobs retrieved successfully"));
});

const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.body
    const job = await Jobs.findByIdAndDelete(jobId);
    if(!job){
        throw new ApiError(404, "Job not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Job deleted successfully"));
});

const getAllApplications = asyncHandler(async (req, res) => {
    const applications = await Applications.find()
        .populate("applicant", "username email")
        .populate("job", "title");
    return res
        .status(200)
        .json(new ApiResponse(200, applications, "Applications retrieved successfully"));
});

const deleteApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.body
    const application = await Applications.findByIdAndDelete(applicationId);
    if(!application){
        throw new ApiError(404, "Application not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Application deleted successfully"));
});
const changePostJobStatus = asyncHandler(async(req, res)=>{

    const {userId} = req.body

    if(!userId){
        throw new ApiError(404,"userId is undefined")
    }

    const user = await User.findById(userId)

    user.isAllowedToPostJob = true

    user.save({validateBeforeSave:false})

    return res
            .status(200)
            .json(new ApiResponse(
                200,
                {user},
                "Recruiter Allowed to post jobs now!"
            ))
})

const getMonthlyJobStats = asyncHandler(async (req, res) => {
    const monthlyStats = await Jobs.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalJobs: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, monthlyStats, "Monthly job stats retrieved successfully"));
});

const getMonthlyApplicationsStats = asyncHandler(async (req, res) => {
    const monthlyStats = await Applications.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalApplications: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, monthlyStats, "Monthly application stats retrieved successfully"));
});

const getMonthlyJobApplications = asyncHandler(async (req, res) => {
    const monthlyApplications = await Applications.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalApplications: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, monthlyApplications, "Monthly job applications count retrieved successfully")
    );
});

const getMonthlyUserRegistrations = asyncHandler(async (req, res) => {
    const monthlyUsers = await User.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalUsers: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, monthlyUsers, "Monthly user registrations retrieved successfully")
    );
});

const getMonthlyJobPostings = asyncHandler(async (req, res) => {
    const monthlyJobs = await Jobs.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalJobs: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, monthlyJobs, "Monthly job postings retrieved successfully")
    );
});

const getTopJobCategories = asyncHandler(async (req, res) => {
    const categoryStats = await Applications.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "jobDetails"
            }
        },
        { $unwind: "$jobDetails" },
        {
            $group: {
                _id: "$jobDetails.category",
                totalApplications: { $sum: 1 }
            }
        },
        { $sort: { totalApplications: -1 } },
        { $limit: 5 } 
    ]);

    return res.status(200).json(
        new ApiResponse(200, categoryStats, "Top job categories retrieved successfully")
    );
});

const getApplicationStatusDistribution = asyncHandler(async (req, res) => {
    const statusDistribution = await Applications.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, statusDistribution, "Application status distribution retrieved successfully")
    );
});

const getAverageSalaryByCategory = asyncHandler(async (req, res) => {
    const avgSalary = await Jobs.aggregate([
        {
            $group: {
                _id: "$category",
                averageSalary: { $avg: "$salary" }
            }
        },
        { $sort: { averageSalary: -1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, avgSalary, "Average salary by category retrieved successfully")
    );
});







export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminDashboard,
    deleteUser,
    getAllUsers,
    deleteJob,
    getAllJobs,
    getAllApplications,
    deleteApplication,
    changePostJobStatus,
    getMonthlyJobApplications,
    getMonthlyUserRegistrations,
    getMonthlyJobPostings,
    getTopJobCategories,
    getApplicationStatusDistribution,
    getAverageSalaryByCategory,

    getMonthlyJobStats,
    getMonthlyApplicationsStats,
}
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Applications} from "../models/jobApplication.models.js"
import {Jobs} from "../models/jobs.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"
import { sendEmail } from "../utils/Nodemailer.js"
import { User } from "../models/user.model.js"

const applyToJob = asyncHandler(async (req, res) => {

    const { jobId } = req.body
    // console.log(jobId);
    // console.log(req.body);
    
    
    
    if(!jobId){
        throw new ApiError(400, "jobId is required")
    }

    const job = await Jobs.findById(jobId)

    if(!job){
        throw new ApiError(400,"job not found")
    }

    const existingApplication = await Applications.findOne({
        job : jobId,
        applicant : req.user._id
    })

    if(existingApplication){
        throw new ApiError(400,"already applied to this job")
    }

    const newApplication = await Applications.create({
        job : jobId,
        applicant : req.user._id
    })

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const emailSubject = `Applied to ${job.title}`;
    const emailText =
       ` ${user.username} applied For ${job.title} 
       Location : ${job.location} 
       Type : ${job.type} 
       Overview : ${job.overview} 
       Responsibility : ${job.responsiblity} 
       Requirment : ${job.requirment} 
       SALARY : ${job.salary}`

    await sendEmail(user.email, emailSubject, emailText);

    //console.log("email sent!");

    res
    .status(200)
    .json(new ApiResponse(200,newApplication,"applied to job successfully"))

})

const getApplicant = asyncHandler(async (req, res) => {

    const { jobId } = req.body
   // console.log(req.body);
    const JobId = jobId
    
    const applicantForJobs = await Applications.aggregate([
        {
            $match : { job : new mongoose.Types.ObjectId(JobId)}
        },
        {   
            $lookup : {
                from : "users",
                localField : "applicant",
                foreignField : "_id",
                as : "applicantDetails"
            },
        },
        {
            $unwind : "$applicantDetails"
        },
        {
            $project:{
                _id : 1,
                "applicantDetails._id" : 1,
                "applicantDetails.username" : 1,
                "applicantDetails.email" : 1,
                "applicantDetails.fullname" : 1,
                "status" : 1,
            },
        },
    ])
    //console.log(applicantForJobs);
   // console.log("status ++"+applicantForJobs.status);
    

    return res
    .status(200)
    .json(new ApiResponse(200, applicantForJobs, "Applicants Retrive Sucessfully"))
})

const getJob = asyncHandler(async (req, res) => {

    const  userId  = req.user._id
    
    const jobsOfApplicant = await Applications.aggregate([
        {
            $match : { applicant : new mongoose.Types.ObjectId(userId)}
        },
        {   
            $lookup : {
                from : "jobs",
                localField : "job",
                foreignField : "_id",
                as : "jobDetails"
            },
        },
        {
            $unwind : "$jobDetails"
        },
        {
            $project:{
                _id : 1, // id of document which stores in MongoDB with jobId and userId
                "jobDetails._id" : 1,
                "jobDetails.title" : 1,
                "jobDetails.location" : 1,
                "jobDetails.overview" : 1,
                "jobDetails.status" :1,
                status:1
            },
        },
    ])
   // console.log(jobsOfApplicant);

    return res
    .status(200)
    .json(new ApiResponse(200, jobsOfApplicant, "Jobs Retrive Sucessfully"))
})

// const getJobPostedByRecruiter = asyncHandler(async (req, res) => {

//     const  userId  = req.user._id
    
//     const jobsPosted = await Applications.aggregate([
//         {
//             $match : { applicant : new mongoose.Types.ObjectId(userId)}
//         },
//         {   
//             $lookup : {
//                 from : "jobs",
//                 localField : "job",
//                 foreignField : "_id",
//                 as : "jobDetails"
//             },
//         },
//         {
//             $unwind : "$jobDetails"
//         },
//         {
//             $project:{
//                 _id : 1, // id of document which stores in MongoDB with jobId and userId
//                 "jobDetails._id" : 1,
//                 "jobDetails.title" : 1,
//                 "jobDetails.location" : 1,
//                 "jobDetails.overview" : 1,
//             },
//         },
//     ])
//     console.log(jobsOfApplicant);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, jobsOfApplicant, "Jobs Retrive Sucessfully"))
// })

const changeApplicationState = asyncHandler(async(req, res) => {
    const { jobId, userId, status } = req.body;
   // console.log(jobId, userId, status);
    

    // Update the status in the database
    const updatedApplication = await Applications.findOneAndUpdate(
        { job: jobId, applicant: userId }, // Find the matching application
        { $set: { status: status } }, // Update the status
        { new: true } // Return the updated document
    );

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const emailSubject = `Application ${status}`;
    const emailText =
        status === "Accepted"
        ? `Congratulations! Your job application has been accepted.`
        : `We regret to inform you that your job application has been rejected.`;

    await sendEmail(user.email, emailSubject, emailText);

   // console.log("email sent!");
    

    if (!updatedApplication) {
        return res.status(404).json(new ApiResponse(404, null, "Application not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedApplication, "Status updated successfully"));
});



export {
    getApplicant,
    applyToJob,
    getJob,
    changeApplicationState
}


import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Applications} from "../models/jobApplication.models.js"
import {Jobs} from "../models/jobs.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"

const applyToJob = asyncHandler(async (req, res) => {

    const { jobId } = req.body
    console.log(jobId);
    
    
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

    res
    .status(200)
    .json(new ApiResponse(200,newApplication,"applied to job successfully"))

})

const getApplicant = asyncHandler(async (req, res) => {

    const { JobId } = req.body
    
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
                "applicantDetails.username" : 1,
                "applicantDetails.email" : 1,
                "applicantDetails.fullname" : 1,
            },
        },
    ])
    console.log(applicantForJobs);

    return res
    .status(200)
    .json(new ApiResponse(200, applicantForJobs, "Applicants Retrive Sucessfully"))
})

export {
    getApplicant,
    applyToJob
}


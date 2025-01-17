import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Jobs} from "../models/jobs.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const postJobs = asyncHandler(async(req,res) => {

    const {title, location, salary, type, overview, responsiblity, requirment} = req.body

    if(
        [title,location,salary,type,overview,responsiblity,requirment].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }

    const coverImageLocatPath = req.files?.coverImage[0]?.path

    const coverImage = await uploadOnCloudinary(coverImageLocatPath)

    // if (!coverImage) {
    //     throw new ApiError(400, "coverimage file is required")
    // }
    // if(coverImage.url == null){
    //     coverImage.url = ""
    // }

    const jobPost = await Jobs.create({
        title,
        location,
        salary,
        type,
        overview,
        responsiblity,
        requirment,
        coverImage: coverImage.url ,
        createdBy:req.user._id,
    })


    return res
    .status(200)
    .json(
        new ApiResponse(201, jobPost, "JobPost created successfully")
    )

})

const getJobs = asyncHandler(async (req, res) => {
    
    const { title, location, type, keyword } = req.query;

    console.log(req.query);
    

   
    const query = {};

    if (title) {
        query.title = { $regex: title, $options: "i" }; 
    }

    if (location) {
        query.location = { $regex: location, $options: "i" }; 
    }

    if (type) {
        query.type = type; 
    }
    if (keyword) {
        query.$or = 
        [
            { title: { $regex: keyword, $options: "i" } },
            { overview: { $regex: keyword, $options: "i" } },
            { responsibilities: { $regex: keyword, $options: "i" } },
        ];
    }

    console.log(query)
    

    
    const jobs = await Jobs.find(query);

    if (!jobs || jobs.length === 0) {
        throw new ApiError(404, "No jobs found with the given filters");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, jobs, "Jobs retrieved successfully"));
})

const updateJob = asyncHandler(async (req, res) => {
    const { id, title, location, salary, type, overview, responsibility, requirment } = req.body;

    // console.log(req.body);
    // console.log(requirment);
    
    

    
    if (!id) {
        throw new ApiError(400, "Job ID is required");
    }

    
    const job = await Jobs.findById(id);

    console.log(job);
    

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    
    if (title) job.title = title;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (type) job.type = type;
    if (overview) job.overview = overview;
    if (responsibility) job.responsibility = responsibility;
    if (requirment) job.requirment = requirment;

    // console.log(job);
    

    
    const updatedJob = await job.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
})

const deleteJob = asyncHandler(async(req, res) => {

    const { id } = req.body

    const job = await Jobs.findByIdAndDelete(id)

    if(!job){
        throw ApiError(400,"job not found")
    }

    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"job deleted succesfully")
    )
})



export {
    postJobs,
    getJobs,
    updateJob,
    deleteJob
}
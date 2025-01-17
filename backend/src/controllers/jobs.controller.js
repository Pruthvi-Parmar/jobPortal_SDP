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

export {
    postJobs,
}
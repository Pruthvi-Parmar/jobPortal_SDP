import { Complaint } from "../models/complaint.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const sendComplaint = asyncHandler(async(req,res)=>{
    const { userId, message} = req.body

    if(!userId){
        throw new ApiError(404,"user id is required")
    }

    const complaint = Complaint.create({
        senderId: userId,
        message: message
    })

    if(!complaint){
        throw new ApiError(500,"error in storing the complaint")
    }

    return res.status(200)
                .json(new ApiResponse(
                    200,
                    {
                        complaint
                    },
                    "complaint registerd successfully"
                ))
})

const retrieveComplaint = asyncHandler(async(req,res)=>{
    const complaint = await Complaint.find()

    return res.status(200)
                .json(new ApiResponse(
                    200,
                    {
                        complaint
                    },
                    "complaint retrived successfully"
                ))
})

export{
    retrieveComplaint,
    sendComplaint
}
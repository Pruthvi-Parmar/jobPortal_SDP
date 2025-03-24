import { Complaint } from "../models/complaint.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const sendComplaint = asyncHandler(async (req, res) => {
    const { userId, message } = req.body

    if (!userId) {
        throw new ApiError(404, "User ID is required")
    }

    const complaint = await Complaint.create({  // Fixed: Added 'await'
        senderId: userId,
        message: message
    })

    if (!complaint) {
        throw new ApiError(500, "Error in storing the complaint")
    }

    return res.status(200).json(new ApiResponse(
        200,
        { complaint },
        "Complaint registered successfully"
    ))
})

const retrieveComplaint = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find().populate("senderId", "username email fullname role")

    return res.status(200).json(new ApiResponse(
        200,
        { complaints },
        "Complaints retrieved successfully"
    ))
})

export {
    retrieveComplaint,
    sendComplaint
}

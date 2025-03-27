import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"




export const verifyJWTAdmin = asyncHandler(async (req, _, next) => { // "_" if req,res any of this is unused
    try {
        let token = req.cookies?.accessToken
        if(!token){
            token = req.headers.authorization?.split(" ")[1];
        }
       // console.log(req.headers.authorization?.split(" ")[1]);
        
        // console.log(token);
        
    
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!admin){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.admin = admin
        next()


    } catch (error) {
        throw new ApiError(401,error.message || "invalid access token message from catch block for Admin Access")
    }
})
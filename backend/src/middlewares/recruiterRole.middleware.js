import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authorizeRecruiter = () => {
    return asyncHandler(async (req, res, next) => {
        if (req.user.role === "recruiter") {
            next();
            
        }else{
            throw new ApiError(403, "Access Denied: You do not have permission to access this resource.");
        }
        
    });
};

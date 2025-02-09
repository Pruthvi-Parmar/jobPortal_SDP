import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    if (!req.admin) {
        throw new ApiError(403, "Access Denied: Admins Only");
    }
    next();
});

export{
    verifyAdmin
}

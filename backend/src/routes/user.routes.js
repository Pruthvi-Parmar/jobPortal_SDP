import { Router } from "express";
import { changePassword, getAllUsers, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, viewProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(upload.fields([{ name: 'resume', maxCount: 1 },{ name: 'coverimage', maxCount: 1 }]),registerUser)

router.route("/login").post(loginUser)

//secured routes 

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changePassword)
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)
router.route("/updateAccountDetails").post(verifyJWT, updateAccountDetails)
router.route("/viewProfile").post(viewProfile)
router.route("/getalluser").post(getAllUsers)



export default router   
import { Router } from "express";
import { changePostJobStatus, deleteApplication, deleteJob, deleteUser, getAdminDashboard, getAllApplications, getAllJobs, getAllUsers, loginAdmin, logoutAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyJWTAdmin } from "../middlewares/admin.auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyJWTAdmin, logoutAdmin)
router.route("/dashboard").post(getAdminDashboard)
router.route("/getalluser").post(getAllUsers)
router.route("/deleteuser").post(deleteUser)
router.route("/deletejob").post(deleteJob)
router.route("/getalljobs").post(getAllJobs)
router.route("/getAllApplications").post(verifyJWTAdmin,getAllApplications)
router.route("/deleteApplication").post(deleteApplication)
router.route("/changePostJobStatus").post(changePostJobStatus)



export default router   
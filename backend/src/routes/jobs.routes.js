import { Router } from "express";
import {deleteJob, getJobs, getJobsPostedByRecruiter, postJobs, updateJob, updateJobStatus,} from "../controllers/jobs.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeJobSeeker } from "../middlewares/jobSeekerRole.middleware.js";
import { authorizeRecruiter } from "../middlewares/recruiterRole.middleware.js";


const router = Router()

router.route("/post-job").post(verifyJWT,upload.fields([{ name: 'coverImage', maxCount: 1 }]),postJobs)
router.route("/get-job").post(getJobs)//router.route("/get-job").post(verifyJWT,authorizeRoles(["jobseeker"]),getJobs)
//in above route please send accesstoken in fetch header
router.route("/update-job").post(updateJob)
router.route("/delete-job").post(deleteJob)
router.route("/get-posted-job").post(verifyJWT,getJobsPostedByRecruiter)
router.route("/update-job-state").post(updateJobStatus)


export default router  
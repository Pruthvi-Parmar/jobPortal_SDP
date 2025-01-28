import { Router } from "express";
import {deleteJob, getJobs, getJobsPostedByRecruiter, postJobs, updateJob,} from "../controllers/jobs.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/post-job").post(verifyJWT,upload.fields([{ name: 'coverImage', maxCount: 1 }]),postJobs)
router.route("/get-job").post(getJobs)
router.route("/update-job").post(updateJob)
router.route("/delete-job").post(deleteJob)
router.route("/get-posted-job").post(verifyJWT,getJobsPostedByRecruiter)


export default router  
import { Router } from "express";
import {deleteJob, getJobs, postJobs, updateJob} from "../controllers/jobs.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { applyToJob, changeApplicationState, getApplicant, getJob } from "../controllers/application.controller.js";

const router = Router()

router.route("/apply-to-job").post(verifyJWT,applyToJob)
router.route("/get-job-application").post(getApplicant)
router.route("/get-applicants-job").post(verifyJWT, getJob)
router.route("/changeState").post(changeApplicationState)




export default router  
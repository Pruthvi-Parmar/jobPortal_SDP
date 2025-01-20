import { Router } from "express";
import {deleteJob, getJobs, postJobs, updateJob} from "../controllers/jobs.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { applyToJob, getApplicant } from "../controllers/application.controller.js";

const router = Router()

router.route("/apply-to-job").post(verifyJWT,applyToJob)
router.route("/get-job-application").post(getApplicant)




export default router  
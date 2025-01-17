import { Router } from "express";
import {postJobs} from "../controllers/jobs.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/post-job").post(verifyJWT,upload.fields([{ name: 'coverImage', maxCount: 1 }]),postJobs)

export default router  
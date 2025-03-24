import { Router } from "express";
import { retrieveComplaint, sendComplaint } from "../controllers/complaint.controller.js";

const router = Router()

router.route("/register-complaint").post(sendComplaint)
router.route("/retrieve-complaint").post(retrieveComplaint)

export default router  
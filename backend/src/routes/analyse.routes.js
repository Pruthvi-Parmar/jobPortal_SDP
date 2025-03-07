import { Router } from "express";
import { analyzeResume } from "../controllers/analyse.controller.js";

const router = Router()

router.post("/analyze", analyzeResume);

export default router
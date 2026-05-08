import Resume from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.post("/", isAuthenticated, Resume.createResume);
router.get("/:id", isAuthenticated, Resume.getResume);
router.get("/all", isAuthenticated, Resume.getUserResumes);

export default router;
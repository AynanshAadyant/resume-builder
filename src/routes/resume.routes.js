import Resume from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js"
import { Router } from "express";

const router = Router();

router.post("/create", isAuthenticated, requestLogger, Resume.createResume);
router.post("/create/prompt", isAuthenticated, requestLogger, Resume.createResumeFromPrompt )
router.get("/", isAuthenticated, requestLogger, Resume.getUserResumes);
router.get("/:id", isAuthenticated, requestLogger, Resume.getResumeById);
router.delete("/:id", isAuthenticated, requestLogger, Resume.deleteResume);

export default router;
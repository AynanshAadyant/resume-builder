import Resume from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js";
import { aiLimiter } from "../middlewares/rateLimit.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/create", isAuthenticated, aiLimiter, requestLogger, Resume.createResume);
router.post("/create/prompt", isAuthenticated, aiLimiter, requestLogger, Resume.createResumeFromPrompt);
router.get("/", isAuthenticated, requestLogger, Resume.getUserResumes);
router.get("/:id", isAuthenticated, requestLogger, Resume.getResumeById);
router.put("/:id", isAuthenticated, requestLogger, Resume.updateResume);
router.delete("/:id", isAuthenticated, requestLogger, Resume.deleteResume);

export default router;
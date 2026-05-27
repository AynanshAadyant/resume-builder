import Resume from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", isAuthenticated, Resume.createResume);
router.get("/:id", isAuthenticated, Resume.getResume);
router.get("/", isAuthenticated, Resume.getUserResumes);
router.delete("/:id", isAuthenticated, Resume.deleteResume);

export default router;
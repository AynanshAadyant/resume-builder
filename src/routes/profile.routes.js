import Profile from "../controllers/profile.controller.js";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js";

const router = Router();

router.post("/create", isAuthenticated, requestLogger, Profile.create);
router.get("/get", isAuthenticated, requestLogger, Profile.get);
router.get("/getAll", requestLogger, Profile.getAll);
router.put("/update", requestLogger, isAuthenticated, Profile.update);
router.delete("/delete",requestLogger, isAuthenticated, Profile.delete);

export default router;

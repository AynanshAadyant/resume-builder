import Profile from "../controllers/profile.controller.js";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js";

const router = Router();

router.post("/create", isAuthenticated, requestLogger, Profile.create);
router.get("/get", isAuthenticated, requestLogger, Profile.get);
router.get("/getAll", requestLogger, Profile.getAll);
router.put("/update",  isAuthenticated, requestLogger, Profile.update);
router.delete("/delete", isAuthenticated, requestLogger, Profile.delete);

export default router;

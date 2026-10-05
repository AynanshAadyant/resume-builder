import express from "express";
import auth from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, requestLogger, auth.register);
router.post("/login", authLimiter, requestLogger, auth.login);
router.get("/current", isAuthenticated, requestLogger, auth.current);
router.post("/logout", isAuthenticated, requestLogger, auth.logout);
router.put("/update", isAuthenticated, requestLogger, auth.update);

export default router;
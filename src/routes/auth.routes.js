import express from "express";
import auth from "../controllers/auth.controller.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import requestLogger from "../middlewares/logger.middleware.js";

const router = express.Router();

router.post("/register", isAuthenticated, auth.register);
router.post("/login", isAuthenticated, auth.login);
router.get("/current", isAuthenticated, requestLogger, auth.current);
router.post("/logout", isAuthenticated,requestLogger, auth.logout);


export default router
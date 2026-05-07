import express from "express";
import auth from "../controllers/auth.controller.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/current", isAuthenticated, auth.current);
router.post("/logout", isAuthenticated, auth.logout);


export default router
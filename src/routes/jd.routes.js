import JD from "../controllers/jd.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import requestLogger from "../middlewares/logger.middleware.js";
import express from "express";

const router = express.Router();

router.route("/").post(isAuthenticated, requestLogger, JD.store).get(isAuthenticated, requestLogger, JD.getAll);
router.route("/:id").get(isAuthenticated, requestLogger, JD.get).delete(isAuthenticated, requestLogger, JD.delete);
router.route("/parse/:id").post(isAuthenticated, requestLogger, JD.parse);

export default router;
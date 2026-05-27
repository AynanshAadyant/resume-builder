import JD from "../controllers/jd.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.route("/").post(isAuthenticated, JD.store).get(isAuthenticated, JD.getAll);
router.route("/:id").get(isAuthenticated, JD.get).delete(isAuthenticated, JD.delete);
router.route("/parse/:id").post(isAuthenticated, JD.parse);

export default router;
import Profile from "../controllers/profile.controller.js";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuthenticated, Profile.create);
router.get("/get", isAuthenticated, Profile.get);
router.get("/getAll", Profile.getAll);
router.put("/update", isAuthenticated, Profile.update);
router.delete("/delete", isAuthenticated, Profile.delete);

export default router;

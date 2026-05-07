import Profile from "../controllers/profile.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, Profile.create);
router.get("/get", authMiddleware, Profile.get);
router.get("/getAll", Profile.getAll);
router.put("/update", authMiddleware, Profile.update);
router.delete("/delete", authMiddleware, Profile.delete);

export default router;

import { Router } from "express";
import { updateAvatar } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.put("/avatar", authenticateToken, updateAvatar);

export default router;

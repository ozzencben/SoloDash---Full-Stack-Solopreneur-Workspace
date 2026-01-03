import express from "express";
import { getMe, login, register, updateProfile, } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.put("/profile", authenticateToken, updateProfile);
router.get("/me", authenticateToken, getMe);
export default router;
//# sourceMappingURL=authRoutes.js.map
import express from "express";
import { createProject, getMyProjects, deleteProject, updateProject } from "../controllers/projectController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/create", authenticateToken, createProject);
router.get("/my-projects", authenticateToken, getMyProjects);
router.delete("/delete/:id", authenticateToken, deleteProject);
router.put("/update/:id", authenticateToken, updateProject);
export default router;
//# sourceMappingURL=projectRoutes.js.map
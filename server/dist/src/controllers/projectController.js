import prisma from "../../db.js";
export const createProject = async (req, res) => {
    try {
        const { title, budget, deadline, category } = req.body;
        const userId = req.user.userId;
        const project = await prisma.project.create({
            data: {
                title,
                budget: parseFloat(budget),
                deadline: new Date(deadline),
                category: category || "Web App",
                userId: userId,
            },
        });
        res.status(201).json({
            message: "Project created successfully.",
            projectId: project.id,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Project creation failed.",
        });
    }
};
export const getMyProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        const projects = await prisma.project.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            projects,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Project creation failed." });
    }
};
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, budget, status, deadline } = req.body;
    const userId = req.user.userId;
    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: Number(id),
                userId: userId,
            },
            data: {
                title,
                budget: budget ? parseFloat(budget) : undefined,
                status,
                deadline: deadline ? new Date(deadline) : undefined,
            },
        });
        res.status(200).json({
            message: "Project updated successfully.",
            project: updatedProject,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Project update failed.",
        });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        await prisma.project.delete({
            where: {
                id: Number(id),
                userId: userId, // Güvenlik: Başkasının projesini silemez
            },
        });
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Delete failed." });
    }
};
//# sourceMappingURL=projectController.js.map
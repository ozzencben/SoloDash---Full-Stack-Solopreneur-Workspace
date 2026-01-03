import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401).json({
            error: "Access denied. Token not found.",
        });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            ...verified,
            id: verified.userId || verified.id, // Her iki ihtimali de destekle
            userId: verified.userId || verified.id,
        };
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid token." });
    }
};
//# sourceMappingURL=authMiddleware.js.map
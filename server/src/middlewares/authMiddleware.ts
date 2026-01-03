import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).json({
      error: "Access denied. Token not found.",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      ...verified,
      id: verified.userId || verified.id, // Her iki ihtimali de destekle
      userId: verified.userId || verified.id,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token." });
  }
};

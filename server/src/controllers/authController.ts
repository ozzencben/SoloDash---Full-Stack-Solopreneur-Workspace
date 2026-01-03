import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../db.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "This email is already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    res.status(201).json({
      message: "User registered successfully.",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during registration.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { projects: true }, // GİRİŞTE PROJELERİ DAHİL ET
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        projects: user.projects, // PROJELERİ FRONTEND'E GÖNDER
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};

export const getMe = async (req: any, res: any) => {
  try {
    const currentId = req.user.userId || req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: Number(currentId) },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        bio: true,
        role: true,
        avatarUrl: true,
        projects: { orderBy: { createdAt: "desc" } }, // SAYFA YENİLENDİĞİNDE PROJELERİ GETİR
      },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Profili güncelle (PUT /api/auth/profile)
export const updateProfile = async (req: any, res: any) => {
  const { name, title, bio } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, title, bio },
    });
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

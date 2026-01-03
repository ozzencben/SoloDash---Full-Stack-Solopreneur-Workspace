import * as dotenv from "dotenv";
dotenv.config(); // En üstte kalmalı

import cors from "cors";
import express, { Request, Response } from "express";
import prisma from "./db.js";

import { authenticateToken } from "./src/middlewares/authMiddleware.js";

import authRoutes from "./src/routes/authRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

// middleware
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "https://solo-dash-full-stack-solopreneur-wo.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" })); // Base64 için limiti yükselttik
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 5000;

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// Test amaçlı Sarah kullanıcısını veritabanına ekleyen rota
app.get("/seed", authenticateToken, async (req: Request, res: Response) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: "sarah@scaleup.com",
        name: "Sarah Miller",
        password: "password123", // Gerçek projede bunu hash'leyeceğiz (bcrypt)
        role: "ADMIN",
        projects: {
          create: {
            title: "ScaleUp Logo Tasarımı",
            budget: 500.0,
            deadline: new Date("2026-01-15"),
            status: "IN_PROGRESS",
          },
        },
      },
    });
    res.json({
      message: "Sarah ve ilk projesi başarıyla oluşturuldu!",
      newUser,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Veri oluşturulurken bir hata oluştu." });
  }
});

app.get("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }, // Şifreleri gönderme!
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Veri çekilemedi." });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde yayında!`);
});
